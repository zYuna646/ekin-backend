import { IsDate, IsString } from 'class-validator';

export class CreatePeriodePenilaianDto {
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  unitId: string;
}
