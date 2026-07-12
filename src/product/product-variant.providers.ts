import { DataSource } from 'typeorm';

import { ProductVariant } from './entities/product-variant.entity';

export const productVariantProviders = [
  {
    provide: 'PRODUCT_VARIANT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ProductVariant),
    inject: ['DATA_SOURCE'],
  },
];


