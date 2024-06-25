import { CategoriesService } from './categories.service';
export declare class CategoriesModule {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    initialize(): Promise<void>;
}
