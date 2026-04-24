import { Type, Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';

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
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return [];
  })
  @IsArray()
  @IsString({ each: true })
  unitIds?: string[];
}
