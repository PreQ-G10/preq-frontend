export const Routes = {
  home: '/' as const,
  camera: '/camera' as const,
  search: '/search' as const,
  productConfirm: '/product/confirm' as const,
  productCreate: '/product/create' as const,
  productDetails: (id: number) => `/product/${id}` as const,
  priceCollaborate: '/price/collaborate' as const,
  priceDetails: (id: number) => `/price/details/${id}` as const,
};