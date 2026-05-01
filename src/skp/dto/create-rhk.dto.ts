import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';
import { RHK_JENIS, RHK_KLASIFIKASI } from 'src/common/const/rhk.const';

export class CreateRhkDto {
  @IsString()
  desc: string;

  @IsIn(Object.values(RHK_KLASIFIKASI))
  klasifikasi: string;

  @IsIn(Object.values(RHK_JENIS))
  jenis: string;

  @IsOptional()
  @IsString()
  penugasan?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rktIds?: string[];

  @IsOptional()
  @IsString()
  parentRhkId?: string; // Optional parent RHK ID (one-to-one parent relationship)
}
