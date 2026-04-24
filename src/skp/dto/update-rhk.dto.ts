import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';
import { RHK_JENIS, RHK_KLASIFIKASI } from 'src/common/const/rhk.const';

export class UpdateRhkDto {
  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsIn(Object.values(RHK_KLASIFIKASI))
  klasifikasi?: string;

  @IsOptional()
  @IsIn(Object.values(RHK_JENIS))
  jenis?: string;

  @IsOptional()
  @IsString()
  penugasan?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rktIds?: string[];
}
