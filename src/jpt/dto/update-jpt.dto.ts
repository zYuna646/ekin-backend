import { PartialType } from '@nestjs/mapped-types';
import { CreateJptDto } from './create-jpt.dto';

export class UpdateJptDto extends PartialType(CreateJptDto) {}
