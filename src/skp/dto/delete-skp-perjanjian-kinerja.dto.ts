import { IsString } from 'class-validator';

export class DeleteSkpPerjanjianKinerjaDto {
  @IsString()
  perjanjianKinerjaId: string;
}
