import { Injectable } from '@nestjs/common';
import { BoardLineItemDto, Category, CategoryDto } from './category.entity';
import { JSDOM } from 'jsdom';
import { HttpService } from '@nestjs/axios';
import { CatSchedulerService } from '../cat-scheduler/cat-scheduler.service';
import {
  initialCategory2021,
  initialCategory2022,
  initialCategory2023,
} from './categoryConfig';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly catSchedulerService: CatSchedulerService,
  ) {}

  private async getBoardFromCategoryUrl(
    catUrl: string,
  ): Promise<Array<BoardLineItemDto>> {
    return new Promise((resolve) => {
      this.httpService
        .get(catUrl, {
          responseType: 'arraybuffer',
        })
        .subscribe((response) => {
          const songListDocument = response.data.toString('UTF-8');
          const lines: BoardLineItemDto[] =
            this.parseRadioPlaylist(songListDocument);

          resolve(lines);
        });
    });
  }

  private parseRadioPlaylist(listScript: string): BoardLineItemDto[] {
    const top100Table = new RegExp('<table(.|\n)*?</table>');
    let currentPosition = 100;

    const { document } = new JSDOM(listScript.match(top100Table)[0]).window;
    const top100List = [...document.querySelectorAll('tr td:nth-child(2)')];
    return top100List.map((tableRow) => {
      const songRow = tableRow.textContent
        .split('\\n                ')[2]
        .replace('        ', '');
      return {
        placement: currentPosition--,
        artist: songRow.split(' — ')[0],
        title: songRow.split(' — ')[1],
      };
    });
  }

  public getAllConfiguredCategories(): CategoryDto[] {
    return [
      ...initialCategory2021,
      ...initialCategory2022,
      ...initialCategory2023,
    ];
  }

  private getPlaylistUrlForCategory({
    airingStartsAt,
    airingEndsAt,
  }: CategoryDto): string {
    const start = convertDateToRadioEinsDate(airingStartsAt, '09');
    const end = convertDateToRadioEinsDate(airingEndsAt, '19');
    return `https://playlist.funtip.de/playList.do?action=searching&remote=1&version=2&from=${start}&to=${end}&jsonp_callback=jQuery224044240703639644585_1627199132642&_=1627199132643`;
  }

  public async getAllBoardByCategory(
    categorySlug: string,
  ): Promise<BoardLineItemDto[]> {
    const allCategories = this.getAllConfiguredCategories();
    allCategories.forEach((category) => {
      const a: Category = {
        ...category,
        id: 0,
      };

      console.log(`Checking ${a.name} ${this.catSchedulerService.isAiring(a)}`);
    });
    const currentCategory = allCategories.find((i) => i.name === categorySlug);
    if (!currentCategory) {
      return Promise.reject('Could not find category');
    }
    const url = this.getPlaylistUrlForCategory(currentCategory);
    return await this.getBoardFromCategoryUrl(url);
  }
}

function convertDateToRadioEinsDate(dateFormat: Date, hour: string): string {
  const date = dateFormat.getDate();
  const month = dateFormat.getMonth() + 1;
  const year = dateFormat.getFullYear();

  return `${date}-${month}-${year}_${hour}-00`;
}
