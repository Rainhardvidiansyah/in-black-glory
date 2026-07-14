import { ProductVariant } from "../entities/product-variant.entity";

export class ProductVariantResponse{

  productId: string;

  productVariantId: string;

  productName: string;
  
  color: string;

  quantity: number;

  size: string;

  constructor(varian: ProductVariant){
    this.productId = varian.productId;
    this.productVariantId = varian.id;
    this.color = varian.color;
    this.quantity = varian.quantity;
    this.size = varian.size;
  }
}