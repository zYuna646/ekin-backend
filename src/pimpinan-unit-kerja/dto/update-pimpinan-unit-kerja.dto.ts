import { PartialType } from '@nestjs/mapped-types';
import { CreatePimpinanUnitKerjaDto } from './create-pimpinan-unit-kerja.dto';

export class UpdatePimpinanUnitKerjaDto extends PartialType(
  CreatePimpinanUnitKerjaDto,
) {}
