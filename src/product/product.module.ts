import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/database/database.module';
import { productProviders } from './product.providers';
import { RedisConfigModule } from 'src/redisconfig/redis-config.module';
import { ProductVariantService } from './product-variant.service';
import { productVariantProviders } from './product-variant.providers';


@Module({

  imports: [DatabaseModule, RedisConfigModule],
 
  providers: [
    ProductService, ...productProviders, 
    ProductVariantService, ...productVariantProviders],

  controllers: [ProductController]
})
export class ProductModule {}
