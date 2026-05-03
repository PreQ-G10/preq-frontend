const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://squiggly-decode-contort.ngrok-free.dev';

export const API = {
  baseUrl: BASE_URL,
  endpoints: {
    detectImage: `${BASE_URL}/api/detection/image`,
    detectBarcode: (barcode: string) => `${BASE_URL}/api/products/barcode/${barcode}`,
    confirmImage: (productId: number) => `${BASE_URL}/api/products/${productId}/confirm-image`,
    searchProducts: `${BASE_URL}/api/products/search`,
    createProduct: `${BASE_URL}/api/products`,
    searchLocations: `${BASE_URL}/api/locations/search`,
    createLocation: `${BASE_URL}/api/locations`,
    reportPrice: `${BASE_URL}/api/prices`,
    priceDetails: (productId: number) => `${BASE_URL}/api/prices/${productId}`,
    uploadProductImage: (productId: number) => `${BASE_URL}/api/products/${productId}/image`,
    detectNearbyLocation: `${BASE_URL}/api/locations/nearby`,
    resolveBarcodeCollision: (productId: number) => `${BASE_URL}/api/products/${productId}/resolve-barcode-collision`,
    login: `${BASE_URL}/api/auth/login`,
    refreshToken: `${BASE_URL}/api/auth/refresh-token`,
    register: `${BASE_URL}/api/auth/register`,
    me: `${BASE_URL}/api/users/me`,
  },
};