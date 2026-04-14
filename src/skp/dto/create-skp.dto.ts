import {
  IsString,
  IsUUID,
  IsDateString,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';
import { SKP_APPROACH } from 'src/common/const/skp.const';

export class CreateSkpDto {
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsEnum(SKP_APPROACH)
  pendekatan!: string;

  @IsString()
  @IsUUID(4)
  renstraId!: string;
}
