import { Injectable } from '@nestjs/common';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class CatSchedulerService {
  isAiring(category: Category): boolean {
    const now = new Date();
    return now >= category.airingStartsAt && now <= category.airingEndsAt;
  }

  isUpcoming(category: Category): boolean {
    const now = new Date();
    return now < category.airingStartsAt;
  }

  isComplete(category: Category): boolean {
    const now = new Date();
    return now > category.airingEndsAt;
  }
}
