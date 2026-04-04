import { Test, TestingModule } from '@nestjs/testing';
import { JptService } from './jpt.service';

describe('JptService', () => {
  let service: JptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JptService],
    }).compile();

    service = module.get<JptService>(JptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
