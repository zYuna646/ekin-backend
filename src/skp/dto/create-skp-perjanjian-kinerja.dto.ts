import { IsString } from 'class-validator';

export class CreateSkpPerjanjianKinerjaDto {
  @IsString()
  skpId: string;
}
