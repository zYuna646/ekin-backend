import { IsString } from 'class-validator';

export class CreateIndicatorDto {
  @IsString()
  name: string;

  @IsString()
  target: string;

  @IsString()
  satuan: string;
}
