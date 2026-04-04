import { IsString, IsArray, IsUUID } from 'class-validator';

export class CreateUmpegDto {
  @IsString()
  name: string;

  @IsString()
  unitId: string;

  @IsArray()
  @IsString({ each: true })
  nip: string[];
}
