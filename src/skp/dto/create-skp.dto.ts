import { IsString, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { SKP_APPROACH } from 'src/common/const/skp.const';

export class CreateSkpDto {
  @IsString()
  nip!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsEnum(SKP_APPROACH)
  pendekatan!: string;

  @IsString()
  @IsUUID(4)
  renstraId!: string;
}
