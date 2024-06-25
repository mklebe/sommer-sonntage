import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { HttpModule } from '@nestjs/axios';
import { CatSchedulerModule } from '../cat-scheduler/cat-scheduler.module';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CatSchedulerModule],
      providers: [CategoriesService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
