import { IsDate, IsString } from 'class-validator';

export class CreatePeriodePenilaianDto {
  @IsString()
  name: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  unitId: string;
}
