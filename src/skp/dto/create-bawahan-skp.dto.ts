import {
  IsString,
  IsDate,
  IsEnum,
} from 'class-validator';
import { SKP_APPROACH } from 'src/common/const/skp.const';

export class CreateBawahanSkpDto {
  @IsString()
  bawahanNip!: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsEnum(SKP_APPROACH)
  pendekatan!: string;
}
