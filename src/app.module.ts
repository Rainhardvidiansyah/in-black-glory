import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';


import { RedisConfigModule } from './redisconfig/redis-config.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { EmailModule } from './email/email.module';
import { QueueModule } from './queue/queue.module';
import { CustomerModule } from './customer/customer.module';
import { RoleModule } from './role/role.module';
import { ProductModule } from './product/product.module';
import { MinioModule } from './minio/minio.module';


@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [{
          name: 'login',
          ttl: 60000,
          limit: 5,
        }],
        storage: new ThrottlerStorageRedisService({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        }),
      }),
    }),

    DatabaseModule, RedisConfigModule,
    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env'
      ],
      ignoreEnvFile: false,
    }),
    
    AuthModule,
    UserModule, 
    RoleModule,
    ProductModule,
    EmailModule,
    QueueModule, 
    CustomerModule, MinioModule,
  ],
  providers: [],

  
})


export class AppModule {}
