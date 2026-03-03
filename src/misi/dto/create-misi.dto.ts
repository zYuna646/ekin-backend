import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMisiDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsString()
  @IsUUID(4)
  visiId: string;
}
