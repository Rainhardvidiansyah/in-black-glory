import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // cegah admin/frontend minta 1 juta data sekaligus
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string; // cari berdasarkan nama produk
}