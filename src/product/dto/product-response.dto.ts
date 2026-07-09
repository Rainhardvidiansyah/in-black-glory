import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";


export class ProductResponseDto{


  @IsString()
  @Expose()
  id: string;
  
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  description: string;

  @IsNumber()
  @Expose()
  basePrice: number;
}