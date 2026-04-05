import {
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  SKP_STATUS,
  SKP_APPROACH,
  SKP_CASCADING,
} from 'src/common/const/skp.const';

export class UpdateSkpDto {
  @IsOptional()
  @IsString()
  nip?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(SKP_STATUS)
  status?: string;

  @IsOptional()
  @IsEnum(SKP_APPROACH)
  pendekatan?: string;

  @IsOptional()
  @IsEnum(SKP_CASCADING)
  cascading?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  unitId?: string[];

  @IsOptional()
  @IsArray()
  jabatan?: any[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  childSkpIds?: string[];
}
