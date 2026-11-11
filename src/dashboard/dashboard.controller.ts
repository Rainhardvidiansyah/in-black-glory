import { Controller, Get, Logger } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

@Controller('dashboard')
export class DashboardController {

  //This page is for admin only

  private logger = new Logger(DashboardController.name);

  constructor(private readonly dashboardService: DashboardService){}


  @Get('/')
  @Roles(Role.ADMIN)
  async summary(){

  }
}
