import { IsOptional, IsString } from 'class-validator';

export class ApproveSkpDto {
  @IsOptional()
  @IsString()
  remarks?: string;
}
