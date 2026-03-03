import { IsArray, IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRenstraDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  desc: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  unitId: string;

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  misiIds?: string[];
}
