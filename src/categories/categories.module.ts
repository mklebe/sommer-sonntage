import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardLineItem, Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { HttpModule } from '@nestjs/axios';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, BoardLineItem]), HttpModule],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {
  constructor(private readonly categoriesService: CategoriesService) {
    this.initialize();
  }

  async initialize() {
    
  }
}
