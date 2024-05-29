import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { HttpModule } from '@nestjs/axios';
import { CategoriesController } from './categories.controller';
import { CatSchedulerModule } from '../cat-scheduler/cat-scheduler.module';

@Module({
  imports: [HttpModule, CatSchedulerModule],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {
  constructor(private readonly categoriesService: CategoriesService) {
    this.initialize();
  }

  async initialize() {}
}
