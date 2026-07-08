import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/database/database.module';
import { productProviders } from './product.providers';
import { RedisConfigModule } from 'src/redisconfig/redis-config.module';


@Module({

  imports: [DatabaseModule, RedisConfigModule],
 
  providers: [ProductService, ...productProviders],

  controllers: [ProductsController]
})
export class ProductModule {}
