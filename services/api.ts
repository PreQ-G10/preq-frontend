import { API } from '@/constants/api';
import {
  CreateProductRequest,
  Location,
  LocationDetectionResponse,
  PriceSummaryResponse,
  Product,
  ProductDetectionResponse,
} from '@/types';

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

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const productService = {
  async detectByImage(imageUri: string): Promise<ProductDetectionResponse[]> {
    console.log('Calling:', API.endpoints.detectImage);
    const form = new FormData();
    form.append('file', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' } as any);
    const res = await fetchWithTimeout(API.endpoints.detectImage, { method: 'POST', body: form });
    return handleResponse(res);
  },

  async confirmImage(productId: number, imageUri: string, similarity: number): Promise<Product> {
    const form = new FormData();
    form.append('file', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' } as any);
    const res = await fetchWithTimeout(
      `${API.endpoints.confirmImage(productId)}?similarity=${similarity}`,
      { method: 'POST', body: form }
    );
    return handleResponse(res);
  },

  async search(name: string): Promise<Product[]> {
    const res = await fetch(`${API.endpoints.searchProducts}?name=${encodeURIComponent(name)}`);
    return handleResponse(res);
  },

  async create(request: CreateProductRequest, photoUri?: string): Promise<Product> {
    const res = await fetchWithTimeout(API.endpoints.createProduct, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...DEFAULT_HEADERS },
        body: JSON.stringify(request),
    });
    const product = await handleResponse<Product>(res);

    if (photoUri) {
        const form = new FormData();
        form.append('file', { uri: photoUri, type: 'image/jpeg', name: 'photo.jpg' } as any);
        await fetchWithTimeout(API.endpoints.uploadProductImage(product.id), {
            method: 'POST',
            body: form,
        }, 60000);
    }

    return product;
  },
};

export const locationService = {
  async search(name: string): Promise<Location[]> {
    const res = await fetch(`${API.endpoints.searchLocations}?name=${encodeURIComponent(name)}`);
    return handleResponse(res);
  },

  async detectNearby(imageUri: string, latitude: number, longitude: number): Promise<LocationDetectionResponse | null> {
    const form = new FormData();
    form.append('image', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' } as any);
    const res = await fetchWithTimeout(
      `${API.endpoints.detectNearbyLocation}?latitude=${latitude}&longitude=${longitude}`,
      { method: 'POST', body: form }
    );
    if (res.status === 404) return null;
    return handleResponse(res);
  },

  async create(
    name: string,
    address: string,
    type: Location['type'],
    latitude: number,
    longitude: number,
  ): Promise<Location> {
    const res = await fetch(API.endpoints.createLocation, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, type, latitude, longitude }),
    });
    return handleResponse(res);
  },
};

export const priceService = {
  async report(productId: number, locationId: number, price: number): Promise<void> {
    await fetch(API.endpoints.reportPrice, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, locationId, price }),
    });
  },

  async getSummary(productId: number): Promise<PriceSummaryResponse> {
    const res = await fetch(API.endpoints.priceDetails(productId));
    return handleResponse(res);
  },
};