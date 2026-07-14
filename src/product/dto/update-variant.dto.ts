import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";


export class UpdateVariantDto{
  
  @IsOptional()
  @IsString()
  @MaxLength(50)
  size?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceOverride?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}