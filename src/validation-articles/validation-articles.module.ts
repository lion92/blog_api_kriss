import { Module } from '@nestjs/common';
import { ValidationArticlesController } from './validation-articles.controller';
import { ValidationArticlesService } from './validation-articles.service';

@Module({
  controllers: [ValidationArticlesController],
  providers: [ValidationArticlesService],
})
export class ValidationArticlesModule {}
