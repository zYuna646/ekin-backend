import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class FiltersRktDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage?: number;

  @IsOptional()
  @IsString()
  @IsUUID(4)
  renstraId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;
}
