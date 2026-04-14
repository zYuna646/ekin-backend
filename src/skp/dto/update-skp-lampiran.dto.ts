import { IsObject, IsString, IsArray } from 'class-validator';

export class UpdateSkpLampiranDto {
  @IsObject()
  lampirans!: {
    [key: string]: string[];
  };
}
