import { IsString, IsEnum } from 'class-validator';
import { SKP_APPROACH } from 'src/common/const/skp.const';

export class CreateBawahanSkpDto {
  @IsString()
  bawahanNip!: string;

  @IsEnum(SKP_APPROACH)
  pendekatan!: string;
}
