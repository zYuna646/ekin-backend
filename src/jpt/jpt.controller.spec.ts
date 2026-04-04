import { Test, TestingModule } from '@nestjs/testing';
import { JptController } from './jpt.controller';
import { JptService } from './jpt.service';

describe('JptController', () => {
  let controller: JptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JptController],
      providers: [JptService],
    }).compile();

    controller = module.get<JptController>(JptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
