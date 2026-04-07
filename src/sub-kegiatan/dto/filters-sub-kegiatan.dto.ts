import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';

export class FiltersSubKegiatanDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  unitIds?: string[];

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
  kegiatanId?: string;
}
