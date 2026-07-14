import { ProductVariant } from "../entities/product-variant.entity";

export class VariantResponseDto {
  readonly id: string;
  readonly productId: string;
  readonly sku: string;
  readonly size: string;
  readonly color: string;
  readonly priceOverride: number | null;
  readonly quantity: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly product?: {
  readonly name: string;
  readonly basePrice: number;
  };

  private constructor(props: VariantResponseDto) {
    Object.assign(this, props);
  }

  static from(variant: ProductVariant): VariantResponseDto {
    return new VariantResponseDto({
      id: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      priceOverride: variant.priceOverride,
      quantity: variant.quantity,
      isActive: variant.isActive,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
      product: variant.product
        ? {
            name: variant.product.name,
            basePrice: variant.product.basePrice,
          }
        : undefined,
    });
  }
}