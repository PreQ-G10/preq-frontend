export interface Product {
  id: number;
  name: string;
  brand: string;
  quantity: number;
  quantityType: string;
  barcode?: string;
  images: string[];
}

export interface ProductDetectionResponse {
  productId: number;
  name: string;
  brand: string;
  quantity: number;
  quantityType: string;
  imageUrl?: string;
  similarity: number;
  isConfident: boolean;
}

export interface CreateProductRequest {
  name: string;
  brand: string;
  quantity: number;
  quantityType: string;
  barcode?: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  type: 'SUPERMARKET' | 'STORE' | 'PHARMACY' | 'OTHER';
}

export interface LocationProductPrice {
  id: number;
  productId: number;
  locationId: number;
  price: number;
  reportedAt: string;
}

export interface PriceSummaryResponse {
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
  weightedPrice: number;
  topLocations: TopLocationResponse[];
}

export interface TopLocationResponse {
  name: string;
  address: string;
  avgPrice: number;
  reportCount: number;
}