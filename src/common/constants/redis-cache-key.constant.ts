export const RedisCacheKey = {
  PRODUCT: (id: string) => `product:${id}`,
  FLASH_SALE_PRODUCT: (id: string) => `flash-sale:product:${id}`,
  USER_PROFILE: (id: string) => `user:profile:${id}`,
  REFRESH_TOKEN: (userId: string) => `refresh:${userId}`,
  PRODUCT_VARIANT: (variantId: string) => `variant:${variantId}`,
  PRODUCT_SLUG: (slug: string) => `product:slug:${slug}`,
} as const;


