import { IsString, IsArray } from 'class-validator';

export class CreateJptDto {
  @IsString()
  name: string;

  @IsString()
  unitId: string;

  @IsArray()
  @IsString({ each: true })
  nip: string[];
}
