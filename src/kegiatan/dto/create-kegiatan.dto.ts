import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateIndicatorDto } from 'src/common/dto/create-indicator.dto';

export class CreateKegiatanDto {
  @IsString()
  name: string;

  @IsString()
  unitId: string;

  @Type(() => Number)
  @IsNumber()
  totalAnggaran: number;

  @IsString()
  @IsUUID(4)
  programId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIndicatorDto)
  indicators?: CreateIndicatorDto[];
}
