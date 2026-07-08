import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { rolesProviders } from './role.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  
  providers: [RoleService, ...rolesProviders],
  exports: [RoleService],
})
export class RoleModule {}
