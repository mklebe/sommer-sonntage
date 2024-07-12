import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { HttpModule } from '@nestjs/axios';
import { CategoriesController } from './categories.controller';
import { CatSchedulerModule } from '../cat-scheduler/cat-scheduler.module';
import { RankingModule } from 'src/ranking/ranking.module';
import { RankingService } from 'src/ranking/ranking.service';

@Module({
  imports: [HttpModule, CatSchedulerModule, RankingModule],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
