import { Category } from 'src/categories/category.entity';
export declare class CatSchedulerService {
    isAiring(category: Category): boolean;
    isUpcoming(category: Category): boolean;
    isComplete(category: Category): boolean;
}
