import { IsString, IsArray } from 'class-validator';

export class CreatePimpinanUnitKerjaDto {
  @IsString()
  name: string;

  @IsString()
  unitKerjaId: string;

  @IsString()
  unitId: string;

  @IsArray()
  @IsString({ each: true })
  nip: string[];
}
