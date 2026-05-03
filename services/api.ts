import { API } from '@/constants/api';
import {
  AuthResponse,
  BarcodeDetectionResponse,
  CreateProductRequest,
  Location,
  LocationDetectionResponse,
  LoginRequest,
  PriceSummaryResponse,
  Product,
  ProductDetectionResponse,
  RegisterRequest,
} from '@/types';
import { tokenStorage } from '@/utils/tokenStorage';

const DEFAULT_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
};

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 60000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

// Wraps fetchWithTimeout — attaches token, retries once on 401 after refresh
export async function fetchAuthenticated(url: string, options: RequestInit = {}, timeoutMs = 60000): Promise<Response> {
  const accessToken = await tokenStorage.getAccessToken();

  const res = await fetchWithTimeout(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  }, timeoutMs);

  if (res.status === 401) {
    const refreshed = await authService.refresh();
    if (!refreshed) throw new Error('SESSION_EXPIRED');

    const newToken = await tokenStorage.getAccessToken();
    return fetchWithTimeout(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
      },
    }, timeoutMs);
  }

  return res;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const productService = {
  async detectByImage(imageUri: string): Promise<ProductDetectionResponse[]> {
    console.log('Calling:', API.endpoints.detectImage);
    const form = new FormData();
    form.append('file', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' } as any);
    const res = await fetchAuthenticated(API.endpoints.detectImage, { method: 'POST', body: form });
    return handleResponse(res);
  },

  async detectByBarcode(barcode: string): Promise<BarcodeDetectionResponse> {
    const res = await fetchAuthenticated(API.endpoints.detectBarcode(barcode), { method: 'GET' });
    return handleResponse(res);
  },

  async resolveBarcodeCollision(productId: number, barcode: string, confirm: boolean): Promise<Product> {
    const res = await fetchAuthenticated(
      `${API.endpoints.resolveBarcodeCollision(productId)}?barcode=${barcode}&confirm=${confirm}`,
      { method: 'POST' }
    );
    return handleResponse(res);
  },

  async confirmImage(productId: number, imageUri: string, similarity: number): Promise<Product> {
    const form = new FormData();
    form.append('file', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' } as any);
    const res = await fetchAuthenticated(
      `${API.endpoints.confirmImage(productId)}?similarity=${similarity}`,
      { method: 'POST', body: form }
    );
    return handleResponse(res);
  },

  async search(name: string): Promise<Product[]> {
    const res = await fetchAuthenticated(`${API.endpoints.searchProducts}?name=${encodeURIComponent(name)}`);
    return handleResponse(res);
  },

  async create(request: CreateProductRequest, photoUri?: string): Promise<Product> {
    const res = await fetchAuthenticated(API.endpoints.createProduct, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...DEFAULT_HEADERS },
        body: JSON.stringify(request),
    });
    const product = await handleResponse<Product>(res);

    if (photoUri) {
        const form = new FormData();
        form.append('file', { uri: photoUri, type: 'image/jpeg', name: 'photo.jpg' } as any);
        await fetchAuthenticated(API.endpoints.uploadProductImage(product.id), {
            method: 'POST',
            body: form,
        }, 60000);
    }

    return product;
  },
};

export const locationService = {
  async search(name: string): Promise<Location[]> {
    const res = await fetchAuthenticated(`${API.endpoints.searchLocations}?name=${encodeURIComponent(name)}`);
    return handleResponse(res);
  },

  async detectNearby(latitude: number, longitude: number): Promise<LocationDetectionResponse | null> {
    const res = await fetchAuthenticated(
      `${API.endpoints.detectNearbyLocation}?latitude=${latitude}&longitude=${longitude}`,
      { method: 'POST' }
    );
    return handleResponse(res);
  },

  async create(
    name: string,
    address: string,
    type: Location['type'],
    latitude: number,
    longitude: number,
  ): Promise<Location> {
    const res = await fetchAuthenticated(API.endpoints.createLocation, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, type, latitude, longitude }),
    });
    return handleResponse(res);
  },
};

export const priceService = {
  async report(productId: number, locationId: number, price: number): Promise<void> {
    await fetchAuthenticated(API.endpoints.reportPrice, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, locationId, price }),
    });
  },

  async getSummary(productId: number): Promise<PriceSummaryResponse> {
    const res = await fetchAuthenticated(API.endpoints.priceDetails(productId));
    return handleResponse(res);
  },
};

export const authService = {
  async login(request: LoginRequest): Promise<AuthResponse> {
    const res = await fetchAuthenticated(API.endpoints.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...DEFAULT_HEADERS },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? `HTTP ${res.status}`);
    }

    return handleResponse(res);
  },

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const res = await fetchAuthenticated(API.endpoints.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...DEFAULT_HEADERS },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? `HTTP ${res.status}`);
    }

    return handleResponse(res);
  },
 
  async refresh(): Promise<boolean> {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) return false;
 
    const res = await fetch(API.endpoints.refreshToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...DEFAULT_HEADERS },
      body: JSON.stringify({ refreshToken }),
    });
 
    if (!res.ok) {
      await tokenStorage.clearTokens();
      return false;
    }
 
    const data: AuthResponse = await handleResponse(res);
    await tokenStorage.saveTokens(data.accessToken, data.refreshToken);
    return true;
  },
 
  async logout(): Promise<void> {
    await tokenStorage.clearTokens();
  },
};
