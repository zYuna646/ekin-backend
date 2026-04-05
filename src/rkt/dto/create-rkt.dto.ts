import {
  IsIn,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateIndicatorDto } from 'src/common/dto/create-indicator.dto';
import { RKT_LABELS } from 'src/common/const/rkt.const';

export class CreateRktDto {
  @IsString()
  name!: string;

  @IsString()
  unitId!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAnggaran!: number;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(RKT_LABELS))
  label?: string;

  @IsString()
  @IsUUID(4)
  renstraId!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  subKegiatan?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIndicatorDto)
  input?: CreateIndicatorDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIndicatorDto)
  output?: CreateIndicatorDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIndicatorDto)
  outcome?: CreateIndicatorDto[];
}
