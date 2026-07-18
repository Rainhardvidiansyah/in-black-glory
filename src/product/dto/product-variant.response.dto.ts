import { ProductVariant } from "../entities/product-variant.entity";
import { ProductImageResponseDto } from "./product-image-response.dto";

export class ProductVariantResponse{

  productId: string;

  productVariantId: string;

  productName: string;
  
  color: string;

  quantity: number;

  size: string;

  images: ProductImageResponseDto[];

  constructor(varian: ProductVariant){
    this.productId = varian.productId;
    this.productVariantId = varian.id;
    this.productName = varian.product?.name;
    this.color = varian.color;
    this.quantity = varian.quantity;
    this.size = varian.size;
    this.images = (varian.images?? []).map(
      (img) => new ProductImageResponseDto(img)
    );
  }
}