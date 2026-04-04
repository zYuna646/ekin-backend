import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltersJptDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage?: number;
}
