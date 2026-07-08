import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateProfileDto } from './dto/UpdateProfile.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorators';
import { UserDecorator } from 'src/common/decorators/user-decorators';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

import { UpdateProfileResponseDto } from './dto/update-profile-response.dto';
import { User } from 'src/user/user.entity';

@Controller('customer')
export class CustomerController {

  constructor(private readonly customerService: CustomerService){}


  @Patch('edit')
  @ResponseMessage('Profile has been updated')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  async editProfile(@UserDecorator() user: User, @Body() updateProfileDto: UpdateProfileDto){
    const profile = await this.customerService.editProfiles(user, updateProfileDto);
    return new UpdateProfileResponseDto(profile);
  }



  @ResponseMessage('Profile is successfully fetched')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getOneCustomer(@UserDecorator() user: User){
    const profile = await this.customerService.getCustomerProfilesByUserId(user);
    return new UpdateProfileResponseDto(profile);
  }


}
