import { BoardLineItemDto, CategoryDto } from './category.entity';
import { HttpService } from '@nestjs/axios';
import { CatSchedulerService } from '../cat-scheduler/cat-scheduler.service';
export declare class CategoriesService {
    private readonly httpService;
    private readonly catSchedulerService;
    constructor(httpService: HttpService, catSchedulerService: CatSchedulerService);
    private getBoardFromCategoryUrl;
    private parseRadioPlaylist;
    getAllConfiguredCategories(): CategoryDto[];
    private getPlaylistUrlForCategory;
    getAllBoardByCategory(categorySlug: string): Promise<BoardLineItemDto[]>;
}
