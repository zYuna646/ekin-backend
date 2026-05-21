import { Test, TestingModule } from '@nestjs/testing';
import { PimpinanUnitKerjaController } from './pimpinan-unit-kerja.controller';
import { PimpinanUnitKerjaService } from './pimpinan-unit-kerja.service';

describe('PimpinanUnitKerjaController', () => {
  let controller: PimpinanUnitKerjaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PimpinanUnitKerjaController],
      providers: [PimpinanUnitKerjaService],
    }).compile();

    controller = module.get<PimpinanUnitKerjaController>(
      PimpinanUnitKerjaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
