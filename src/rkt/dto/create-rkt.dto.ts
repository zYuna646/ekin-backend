import {
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateIndicatorDto } from 'src/common/dto/create-indicator.dto';

export class CreateRktDto {
  @IsString()
  name: string;

  @IsString()
  unitId: string;

  @Type(() => Number)
  @IsNumber()
  totalAnggaran: number;

  @IsString()
  @IsUUID(4)
  renstraId: string;

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
