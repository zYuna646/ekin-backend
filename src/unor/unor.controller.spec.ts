import { Test, TestingModule } from '@nestjs/testing';
import { UnorController } from './unor.controller';
import { UnorService } from './unor.service';

describe('UnorController', () => {
  let controller: UnorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnorController],
      providers: [UnorService],
    }).compile();

    controller = module.get<UnorController>(UnorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
