import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArticlesController } from './validation-articles.controller';

describe('ValidationArticlesController', () => {
  let controller: ValidationArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidationArticlesController],
    }).compile();

    controller = module.get<ValidationArticlesController>(
      ValidationArticlesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
