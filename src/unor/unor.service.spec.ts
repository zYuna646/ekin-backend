import { Test, TestingModule } from '@nestjs/testing';
import { UnorService } from './unor.service';

describe('UnorService', () => {
  let service: UnorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnorService],
    }).compile();

    service = module.get<UnorService>(UnorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
