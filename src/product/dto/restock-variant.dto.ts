import { IsInt, Min } from 'class-validator';

export class RestockVariantDto {
  @IsInt()
  @Min(1)
  amount: number;
}