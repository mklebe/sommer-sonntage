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
import { BoardLineItem, BoardLineItemDto } from './category.entity';
import { Response } from 'express';
import Fuse from 'fuse.js';

interface SongSearchToken {
  title: string;
  artist: string;
}

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

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
  ): Promise<Array<BoardLineItem>> {
    return this.categoriesService.getAllBoardByCategory(categorySlug);
  }

  @Post('search/:slug')
  async findSongInCategory(
    @Param('slug') categorySlug: string,
    @Body() { artist, title }: SongSearchToken,
    @Res() response: Response,
  ): Promise<void> {
    const cleanedArtist = decodeURIComponent(artist);
    const cleanedTitle = decodeURIComponent(title);
    const list = await this.categoriesService.getAllBoardByCategory(
      categorySlug,
    );

    if (!list) {
      response.status(HttpStatus.NOT_FOUND).send([]);
    }

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
}
