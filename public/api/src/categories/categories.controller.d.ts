import { CategoriesService } from './categories.service';
import { BoardLineItemDto } from './category.entity';
import { Response } from 'express';
interface SongSearchToken {
    title: string;
    artist: string;
}
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    private receiveBoard;
    getAllCategories(): Promise<import("./category.entity").CategoryDto[]>;
    getAllWithCategory(categorySlug: string): Promise<Array<BoardLineItemDto>>;
    findBulkSongInCategory(categorySlug: string, searchList: BoardLineItemDto[], response: Response): Promise<void>;
    findSongInCategory(categorySlug: string, { artist, title }: SongSearchToken, response: Response): Promise<void>;
    private searchHit;
}
export {};
