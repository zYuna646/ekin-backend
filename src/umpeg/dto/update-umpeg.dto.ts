import { PartialType } from '@nestjs/mapped-types';
import { CreateUmpegDto } from './create-umpeg.dto';

export class UpdateUmpegDto extends PartialType(CreateUmpegDto) {}
