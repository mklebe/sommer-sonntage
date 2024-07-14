import { Injectable } from '@nestjs/common';
import Fuse from 'fuse.js';
import { BoardLineItemDto } from 'src/categories/category.entity';

interface CategoryIndex {
  artistIndex: Fuse<BoardLineItemDto>;
  titleIndex: Fuse<BoardLineItemDto>;
}

@Injectable()
export class RankingService {
  private categoryIndices: Map<string, CategoryIndex> = new Map();
  private defaultIndexConfiguration: Fuse.IFuseOptions<BoardLineItemDto> = {
    shouldSort: true,
    threshold: 0.25,
    includeScore: true,
  };

  getHello(): void {
    console.log('Hello from RankingService');
  }

  createIndexForCategory(category: string, songs: BoardLineItemDto[]): void {
    // check whether category already exists
    if (this.categoryIndices.has(category)) {
      throw new Error('Category already exists');
    }
    // check for duplicates
    const uniqueSongs = new Set(
      songs.map((song) => `${song.artist}-${song.title}`),
    );
    if (uniqueSongs.size !== songs.length) {
      throw new Error('Duplicate song');
    }

    this.categoryIndices.set(category, {
      artistIndex: new Fuse(songs, {
        ...this.defaultIndexConfiguration,
        keys: ['artist'],
      }),
      titleIndex: new Fuse(songs, {
        ...this.defaultIndexConfiguration,
        keys: ['title'],
      }),
    });
  }

  getRatingForSong(
    category: string,
    artist: string,
    title: string,
  ): BoardLineItemDto {
    // search song in index
    const index = this.categoryIndices.get(category);
    if (!index) {
      throw new Error('Category not set');
    }
    const artistHits = index.artistIndex
      .search(artist)
      .map((item) => item.item);
    const titleHits = index.titleIndex.search(title).map((item) => item.item);

    const hit = artistHits.filter((value) => titleHits.includes(value))[0] || {
      artist,
      title,
      placement: 0,
    };

    return hit;
  }
}
