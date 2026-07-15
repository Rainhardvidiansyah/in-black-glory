import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/database/database.module';
import { productProviders } from './product.providers';
import { RedisConfigModule } from 'src/redisconfig/redis-config.module';
import { ProductVariantService } from './product-variant.service';
import { productVariantProviders } from './product-variant.providers';
import { ProductVariantController } from './product-variants.controller';
import { ProductVariantImageService } from './procuct-variant-image.service';
import { productVariantImageProviders } from './product-variant-image.provider';


@Module({

  imports: [DatabaseModule, RedisConfigModule],
 
  providers: [
    ProductService, ...productProviders, 
    ProductVariantService, ...productVariantProviders,
    ProductVariantImageService, ...productVariantImageProviders
  ],

  controllers: [ProductController, ProductVariantController]
})
export class ProductModule {}
