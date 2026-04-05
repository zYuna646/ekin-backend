import { IsNotEmpty, IsIn, IsOptional, IsString } from 'class-validator';
import { SETTINGS_KEY } from 'src/common/const/settings.const';

const ALLOWED_KEYS = Object.values(SETTINGS_KEY);

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  @IsIn(ALLOWED_KEYS, {
    message: `key must be one of: ${ALLOWED_KEYS.join(', ')}`,
  })
  key?: string;

  @IsNotEmpty()
  value: string | string[] | number;
}
