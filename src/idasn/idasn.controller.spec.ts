import { Test, TestingModule } from '@nestjs/testing';
import { IdasnController } from './idasn.controller';
import { IdasnService } from './idasn.service';

describe('IdasnController', () => {
  let controller: IdasnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdasnController],
      providers: [IdasnService],
    }).compile();

    controller = module.get<IdasnController>(IdasnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
