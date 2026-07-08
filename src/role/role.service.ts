import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {


  constructor(
    @Inject('ROLES_REPOSITORY') private readonly roleRepository: Repository<Role>,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource)
    {}
    
    async findRoleByRoleName(roleName: string): Promise<Role>{

      const role = await this.roleRepository.findOne({where: {roleName}});

      if(role === null){
        throw new NotFoundException('Role not found');
      }
      
      return role;
  }

}
