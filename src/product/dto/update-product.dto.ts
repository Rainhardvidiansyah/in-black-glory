import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 }) // NUMERIC(10,2) as in the DB Postgresql
  @Min(0)
  @Type(() => Number)
  basePrice?: number;

}

