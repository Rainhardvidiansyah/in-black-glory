import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class CreateProductVariantDto{

  @IsNotEmpty()
  @IsString()
  size: string;
  
  @IsNotEmpty()
  @IsString()
  color: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  priceOverride?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  quantity?: number;
}