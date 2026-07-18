import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class UploadVariantImageDto{

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPrimary?: boolean;

}