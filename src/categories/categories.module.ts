import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService],
})
export class CategoriesModule {
  constructor(private readonly categoriesService: CategoriesService) {
    this.initialize();
  }

  async initialize() {
    await this.categoriesService.initializeCategoriesFor2023();
    await this.categoriesService.initializeCategoriesFor2022();
    await this.categoriesService.initializeCategoriesFor2021();
  }
}
