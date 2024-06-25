import { Test, TestingModule } from '@nestjs/testing';
import { CatSchedulerService } from './cat-scheduler.service';
import { Category } from 'src/categories/category.entity';

function createCategory(airingStartsAt: Date, airingEndsAt: Date): Category {
  return {
    airingStartsAt,
    airingEndsAt,
    board: [],
    id: 1,
    name: 'name',
    year: 2023,
    finishedListUrl: 'url',
  };
}

describe('CatSchedulerService', () => {
  let service: CatSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatSchedulerService],
    }).compile();

    service = module.get<CatSchedulerService>(CatSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isAiring', () => {
    it('must be airing when current time is between airing end and airing start', () => {
      const now = new Date();
      const airingStartsAt = new Date(now.getTime() - 1000);
      const airingEndsAt = new Date(now.getTime() + 1000);

      const category = createCategory(airingStartsAt, airingEndsAt);

      expect(service.isAiring(category)).toBe(true);
    });

    it('must not be airing when current time is before airing start', () => {
      const now = new Date();
      const airingStartsAt = new Date(now.getTime() + 1000);
      const airingEndsAt = new Date(now.getTime() + 2000);

      const category = createCategory(airingStartsAt, airingEndsAt);

      expect(service.isAiring(category)).toBe(false);
    });
  });

  describe('isUpcoming', () => {
    it('must be upcoming when current time is before airing start', () => {
      const now = new Date();
      const airingStartsAt = new Date(now.getTime() + 1000);
      const airingEndsAt = new Date(now.getTime() + 2000);

      const category = createCategory(airingStartsAt, airingEndsAt);

      expect(service.isUpcoming(category)).toBe(true);
    });

    it('must not be upcoming when current time is after airing start', () => {
      const now = new Date();
      const airingStartsAt = new Date(now.getTime() - 1000);
      const airingEndsAt = new Date(now.getTime() + 1000);

      const category = createCategory(airingStartsAt, airingEndsAt);

      expect(service.isUpcoming(category)).toBe(false);
    });
  });

  describe('isComplete', () => {
    it('must be complete when current time is after airing end', () => {
      const now = new Date();
      const airingStartsAt = new Date(now.getTime() - 2000);
      const airingEndsAt = new Date(now.getTime() - 1000);

      const category = createCategory(airingStartsAt, airingEndsAt);

      expect(service.isComplete(category)).toBe(true);
    });

    it('must not be complete when current time is before airing end', () => {
      const now = new Date();
      const airingStartsAt = new Date(now.getTime() - 1000);
      const airingEndsAt = new Date(now.getTime() + 1000);

      const category = createCategory(airingStartsAt, airingEndsAt);

      expect(service.isComplete(category)).toBe(false);
    });
  });
});
