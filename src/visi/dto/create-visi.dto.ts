import { IsOptional, IsString } from 'class-validator';

export class CreateVisiDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  desc?: string;
}
