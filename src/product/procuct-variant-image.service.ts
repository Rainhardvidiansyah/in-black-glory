import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductVariantImage } from "./entities/product-variant-image.entity";


@Injectable()
export class ProductVariantImageService{

  constructor(@Inject("PRODUCT_VARIANT_IMAGE_REPOSITORY") private readonly variantImageRepository: Repository<ProductVariantImage>){}

}