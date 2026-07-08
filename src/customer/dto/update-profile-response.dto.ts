import { CustomerProfile } from "../customer.entity";


export class UpdateProfileResponseDto{

  userId!: string;

  email!: string;

  phoneNumber!: string;

  address!: string;

  constructor(profile: CustomerProfile){
    this.userId = profile.user.id;
    this.email = profile.user.email;
    this.phoneNumber = profile.phone;
    this.address = profile.address;
  }


}