import { Test, TestingModule } from '@nestjs/testing';
import { IdasnService } from './idasn.service';

describe('IdasnService', () => {
  let service: IdasnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdasnService],
    }).compile();

    service = module.get<IdasnService>(IdasnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
