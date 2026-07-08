import { Module } from '@nestjs/common';
import { UserService } from './user.service';

import { usersProviders } from './user.providers';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { CustomerModule } from 'src/customer/customer.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [DatabaseModule, RoleModule, CustomerModule],
  providers: [UserService, ...usersProviders],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
