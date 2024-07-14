import { BoardLineItemDto } from 'src/categories/category.entity';
export declare class RankingService {
    private categoryIndices;
    private defaultIndexConfiguration;
    getHello(): void;
    createIndexForCategory(category: string, songs: BoardLineItemDto[]): void;
    getRatingForSong(category: string, artist: string, title: string): BoardLineItemDto;
}
