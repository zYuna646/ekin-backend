import { IsOptional, IsString } from 'class-validator';

export class RejectSkpDto {
  @IsOptional()
  @IsString()
  remarks?: string;
}
