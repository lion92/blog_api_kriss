import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArticlesService } from './validation-articles.service';

describe('ValidationArticlesService', () => {
  let service: ValidationArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationArticlesService],
    }).compile();

    service = module.get<ValidationArticlesService>(ValidationArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
