import { PartialType } from '@nestjs/mapped-types';
import { CreateTujuanDto } from './create-tujuan.dto';

export class UpdateTujuanDto extends PartialType(CreateTujuanDto) {}
