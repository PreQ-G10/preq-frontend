export type LocationType = 'SUPERMARKET' | 'STORE' | 'PHARMACY' | 'OTHER';

export type FieldType = 'BRAND' | 'NAME' | 'QUANTITY' | 'QUANTITY_TYPE' | 'BARCODE';

export type BarcodeDetectionStatus = 'FOUND' | 'CREATED' | 'COLLISION' | 'NOT_FOUND' | 'INCOMPLETE_DATA';

export type PriceSource = 'REPORTED' | 'NEARBY_FALLBACK' | 'GLOBAL_FALLBACK' | 'NO_DATA';

export type LocationDetectionStatus = 'FOUND' | 'NOT_FOUND';

export type ReportScore = 'VALID' | 'PENDING_REVIEW' | 'INVALID';

export type FieldContestStatus = 'ALREADY_SUBMITTED' | 'FIRST_SUBMIT';

export interface BarcodeDetectionResponse {
  status: BarcodeDetectionStatus;
  product?: ProductDetectionResponse;
  apiProduct?: ProductDetectionResponse;
  existingProduct?: ProductDetectionResponse;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  quantity: number;
  quantityType: string;
  minPrice?: number;
  maxPrice?: number;
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
  type: LocationType;
  latitude?: number;
  longitude?: number;
}

export interface LocationProductPrice {
  id: number;
  productId: number;
  locationId: number;
  price: number;
  reportedAt: string;
  score: number;
  reportScore: ReportScore;
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

export interface GeolocationDetectionResponse {
  latitude: number;
  longitude: number;
  mapsUrl: string;
}

export interface LocationDetectionResponse {
  location?: Location;
  geolocation?: GeolocationDetectionResponse;
  distanceMeters?: number;
  status: LocationDetectionStatus;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  name: string;
  lastName: string;
  email: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateUserRequest {
  name: string;
  lastName: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface CartProductResponse {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  priceSource: PriceSource;
}

export interface CartLocationResponse {
  locationId: number;
  name: string;
  address: string;
  totalEstimatedPrice: number;
  distanceMeters?: number;
  products: CartProductResponse[];
}

export interface CartCompareResponse {
  locations: CartLocationResponse[];
  skippedProducts: string[];
}

export interface CartCompareRequest {
  items: { productId: number; quantity: number }[];
  userLatitude?: number;
  userLongitude?: number;
}

export interface ContestProductFieldRequest {
  fieldType: FieldType;
  fieldValue: string;
}

export interface HeatmapPointResponse {
  locationId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  avgPrice: number;
}

export interface PendingValidationResponse {
  id: number;
  price: number;
  reportedAt: string;
  locationId: number;
  locationName: string;
  locationAddress: string;
  product: Product;
}

export interface ConfirmPriceResponse {
  confirmedAt: string;
}

export interface DisputePriceRequest {
  alternativePrice: number;
  userLatitude?: number;
  userLongitude?: number;
}

export interface NearbyOffer {
  product: Product;
  location: Location;
  distanceMeters: number;
  price: number;
  averagePrice: number;
}