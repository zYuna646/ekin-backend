import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltersSkpDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  renstraId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage?: number = 10;
}
