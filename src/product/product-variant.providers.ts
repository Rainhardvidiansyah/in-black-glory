import { DataSource } from 'typeorm';

import { ProductVariant } from './entities/product-variant.entity';

export const productProviders = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ProductVariant),
    inject: ['DATA_SOURCE'],
  },
];


