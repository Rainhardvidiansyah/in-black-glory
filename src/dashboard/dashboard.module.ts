import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ProductModule } from 'src/product/product.module';
import { RedisConfigModule } from 'src/redisconfig/redis-config.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ProductModule, RedisConfigModule, DatabaseModule],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
