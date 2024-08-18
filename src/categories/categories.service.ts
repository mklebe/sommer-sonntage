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
import axios from 'axios';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly catSchedulerService: CatSchedulerService,
  ) {}

  private async getBoardFromCategoryUrl(
    catUrl: string,
  ): Promise<Array<BoardLineItemDto>> {
    return new Promise((resolve, reject) => {
      console.log(`Getting board from ${catUrl}`);
      axios
        .get(catUrl, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          if (!response.status.toString().startsWith('2')) {
            reject('Could not get board with url: ' + catUrl);
          }
          const songListDocument = response.data.toString('UTF-8');
          const lines: BoardLineItemDto[] =
            this.parseRadioPlaylist(songListDocument);
          resolve(lines);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  private parseRadioPlaylist(listScript: string): BoardLineItemDto[] {
    let currentPosition = 100;

    const { document } = new JSDOM(listScript).window;

    const top100List = [...document.querySelectorAll('.play_track')];

    let firstUndefined = 0;
    const allTop100Songs = top100List.map((tableRow, index) => {
      const time = tableRow.querySelector('.play_time').textContent;
      const playHour = parseInt(time.split(':')[0]);
      if (playHour >= 9 && playHour < 19) {
        const artist = tableRow.querySelector('.trackinterpret').textContent;
        const title = tableRow.querySelector('.tracktitle').textContent;

        return {
          time,
          artist,
          title,
        };
      } else {
        if (firstUndefined === 0) {
          firstUndefined = index;
        }
        return undefined;
      }
    });

    const songsSortedByTime = allTop100Songs
      .slice(0, firstUndefined)
      .sort((a, b) => {
        return a.time.localeCompare(b.time);
      });

    return songsSortedByTime.map((song) => {
      return {
        ...song,
        placement: currentPosition--,
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
    return `https://www.radioeins.de/musik/playlists.html`;
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
    return this.getBoardFromCategoryUrl(url).catch((e) => {
      return Promise.resolve([]);
    });
  }
}

function convertDateToRadioEinsDate(dateFormat: Date, hour: string): string {
  const date = dateFormat.getDate();
  const month = dateFormat.getMonth() + 1;
  const year = dateFormat.getFullYear();

  return `${date}-${month}-${year}_${hour}-00`;
}
