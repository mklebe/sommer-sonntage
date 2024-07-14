interface Song {
    artist: string;
    title: string;
}
export interface BoardLineItemDto extends Song {
    placement: number;
}
export declare class Category {
    id: number;
    name: string;
    year: number;
    board: BoardLineItem[];
    airingStartsAt: Date;
    airingEndsAt: Date;
    finishedListUrl?: string;
}
export declare class BoardLineItem implements BoardLineItemDto {
    id: number;
    artist: string;
    title: string;
    placement: number;
    category: Category;
}
export type CategoryDto = Omit<Category, 'id'>;
export {};
