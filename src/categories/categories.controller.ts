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
import { BoardLineItem } from './category.entity';
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
    return this.categoriesService.getAllConfiguredCategories();
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
    const list = await this.categoriesService.getAllBoardByCategory(
      categorySlug,
    );
    if (!list) {
      response.status(HttpStatus.NOT_FOUND).send([]);
    }

    const fuse = new Fuse(list, {
      includeScore: true,
      keys: ['artist', 'title'],
    });

    const result = fuse.search(`${artist} ${title}`).map((item) => item.item);

    response.status(HttpStatus.FOUND).send(result);
  }
}
