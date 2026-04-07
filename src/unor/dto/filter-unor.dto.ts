import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterUnorDto {
  @IsString()
  search?: string;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage?: number;
}
