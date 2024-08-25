import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { BoardLineItemDto } from './category.entity';
import { Response } from 'express';
import Fuse from 'fuse.js';
import { top100Scandals } from '../../datdastorage/2023_scandals';
import { top100Water } from '../../datdastorage/2023_water';
import { top100UpNorth } from '../../datdastorage/2024_up_north';
import { crime_songs } from '../../datdastorage/2024_crime';
import { top100EatIt } from '../../datdastorage/2024_eat_it';
import { top100sixties } from '../../datdastorage/2024_sixties';
import { top100work } from '../../datdastorage/2024_work';
import { top100space } from '../../datdastorage/2024_space';

interface SongSearchToken {
  title: string;
  artist: string;
}

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  private async receiveBoard(
    categorySlug: string,
  ): Promise<Array<BoardLineItemDto>> {
    if (categorySlug === 'Top100Space') {
      return top100space;
    } else if (categorySlug === 'Top100Work') {
      return top100work;
    } else if (categorySlug === 'Top100EatIt') {
      return top100EatIt;
    } else if (categorySlug === 'Top100Sixties') {
      return top100sixties;
    } else if (categorySlug === 'Top100CrimeTime') {
      return crime_songs;
    } else if (categorySlug === 'Top100UpNorth') {
      return top100UpNorth;
    } else if (categorySlug === 'Top100Scandal') {
      return top100Scandals;
    } else if (categorySlug === 'Top100Water') {
      return top100Water;
    } else {
      return this.categoriesService
        .getAllBoardByCategory(categorySlug)
        .catch((e) => {
          console.log(e);
          return Promise.resolve([]);
        });
    }
  }

  @Get()
  async getAllCategories() {
    const categories =
      await this.categoriesService.getAllConfiguredCategories();
    delete categories[0].board;

    return categories;
  }

  @Get(':slug')
  async getAllWithCategory(
    @Param('slug') categorySlug: string,
  ): Promise<Array<BoardLineItemDto>> {
    return this.receiveBoard(categorySlug);
  }

  @Post('search/bulk/:slug')
  async findBulkSongInCategory(
    @Param('slug') categorySlug: string,
    @Body() searchList: BoardLineItemDto[],
    @Res() response: Response,
  ): Promise<void> {
    const list: BoardLineItemDto[] = await this.receiveBoard(categorySlug);

    if (!list) {
      response.status(HttpStatus.NOT_FOUND).send([]);
    }

    const searchResult: BoardLineItemDto[] = searchList.map(
      ({ artist, title }) => {
        const hit = this.searchHit(list, artist, title);

        if (hit) {
          return hit;
        } else {
          return {
            artist,
            title,
            placement: 0,
          };
        }
      },
    );

    response.status(HttpStatus.OK).send(searchResult);
  }

  @Post('search/:slug')
  async findSongInCategory(
    @Param('slug') categorySlug: string,
    @Body() { artist, title }: SongSearchToken,
    @Res() response: Response,
  ): Promise<void> {
    const list: BoardLineItemDto[] = await this.receiveBoard(categorySlug);

    if (!list) {
      response.status(HttpStatus.NOT_FOUND).send([]);
    }

    const hit = this.searchHit(list, artist, title);

    if (hit) {
      response.status(HttpStatus.OK).send(hit);
    } else {
      response.status(HttpStatus.OK).send({
        artist,
        title,
        placement: 0,
      } as BoardLineItemDto);
    }
  }

  private searchHit(
    list: BoardLineItemDto[],
    artist: string,
    title: string,
  ): BoardLineItemDto {
    const cleanedArtist = decodeURIComponent(artist);
    const cleanedTitle = decodeURIComponent(title);
    const defaultConfig = {
      shouldSort: true,
      threshold: 0.25,
      includeScore: true,
    };

    const artistSearch = new Fuse(list, {
      ...defaultConfig,
      keys: ['artist'],
    });
    const titleSearch = new Fuse(list, {
      ...defaultConfig,
      keys: ['title'],
    });

    const artistHits = artistSearch
      .search(cleanedArtist)
      .map((item) => item.item);
    const titleHits = titleSearch
      .search(decodeURIComponent(cleanedTitle))
      .map((item) => item.item);

    const [hit] = artistHits.filter((value) => titleHits.includes(value));

    return hit;
  }
}
