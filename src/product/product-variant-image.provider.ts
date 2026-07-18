import { DataSource } from "typeorm";
import { ProductVariantImage } from "./entities/product-variant-image.entity";


export const productVariantImageProviders = [
  {
    provide: 'PRODUCT_VARIANT_IMAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ProductVariantImage),
    inject: ['DATA_SOURCE'],
  },
];