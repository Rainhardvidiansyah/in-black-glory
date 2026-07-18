export const MinioBucket = {
  PRODUCT_IMAGE: 'product-images',
  PHOTO_PROFILE: 'photo-profiles'
} as const;

export type MinioBucket = (typeof MinioBucket)[keyof typeof MinioBucket];