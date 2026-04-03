import { Controller } from '@nestjs/common';
import { IdasnService } from './idasn.service';

@Controller('idasn')
export class IdasnController {
  constructor(private readonly idasnService: IdasnService) {}
}
