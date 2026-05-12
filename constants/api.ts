<<<<<<< HEAD
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'localhost:8080';
=======
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://localhost:8080';
>>>>>>> b52a0b2 (created the map screen, and api consuming endpoint for it, need to recheck the data sent/received)

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
    heatmapData: (prodctId?: number, latitude?: number, longitude?: number) => `${BASE_URL}/api/prices/heatmap?productId=${prodctId}&latidude=${latitude}&longitude=${longitude}`,
    uploadProductImage: (productId: number) => `${BASE_URL}/api/products/${productId}/image`,
    detectNearbyLocation: `${BASE_URL}/api/locations/nearby`,
    resolveBarcodeCollision: (productId: number) => `${BASE_URL}/api/products/${productId}/resolve-barcode-collision`,
    login: `${BASE_URL}/api/auth/login`,
    refreshToken: `${BASE_URL}/api/auth/refresh-token`,
    register: `${BASE_URL}/api/auth/register`,
    me: `${BASE_URL}/api/users/me`,
    productById: (id: number) => `${BASE_URL}/api/products/${id}`,
    cartCompare: `${BASE_URL}/api/cart/compare`,
  },
};