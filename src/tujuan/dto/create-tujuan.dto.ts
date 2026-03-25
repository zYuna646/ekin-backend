import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateIndicatorDto } from 'src/common/dto/create-indicator.dto';

export class CreateTujuanDto {
  @IsString()
  name: string;

  @IsString()
  unitId: string;

  @IsString()
  @IsUUID(4)
  renstraId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIndicatorDto)
  indicators?: CreateIndicatorDto[];
}
