import { Test, TestingModule } from '@nestjs/testing';
import { PimpinanUnitKerjaService } from './pimpinan-unit-kerja.service';

describe('PimpinanUnitKerjaService', () => {
  let service: PimpinanUnitKerjaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PimpinanUnitKerjaService],
    }).compile();

    service = module.get<PimpinanUnitKerjaService>(PimpinanUnitKerjaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
