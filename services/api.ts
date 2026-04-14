import { API } from '@/constants/api';
import {
  CreateProductRequest,
  Location,
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

  async create(request: CreateProductRequest): Promise<Product> {
    const res = await fetch(API.endpoints.createProduct, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse(res);
  },
};

export const locationService = {
  async search(name: string): Promise<Location[]> {
    const res = await fetch(`${API.endpoints.searchLocations}?name=${encodeURIComponent(name)}`);
    return handleResponse(res);
  },

  async create(name: string, address: string, type: Location['type']): Promise<Location> {
    const res = await fetch(API.endpoints.createLocation, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, type }),
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