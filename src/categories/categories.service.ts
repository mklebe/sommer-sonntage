import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BoardLineItem,
  BoardLineItemDto,
  Category,
  CategoryDto,
} from './category.entity';
import { Repository } from 'typeorm';
import { JSDOM } from 'jsdom';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(BoardLineItem)
    private boardLineItemRepository: Repository<BoardLineItem>,
    private readonly httpService: HttpService,
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
          const songListDocument = response.data.toString('latin1');
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

  private getPlaylistUrlForCategory({
    airingStartsAt,
    airingEndsAt,
  }: CategoryDto): string {
    const start = convertDateToRadioEinsDate(airingStartsAt);
    const end = convertDateToRadioEinsDate(airingEndsAt);
    return `https://playlist.funtip.de/playList.do?action=searching&remote=1&version=2&from=${start}&to=${end}&jsonp_callback=jQuery224044240703639644585_1627199132642&_=1627199132643`;
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async getCategoriesByYear(year: number): Promise<Array<Category>> {
    return this.categoryRepository.find({ where: { year } });
  }

  async initializeCategoriesFor2023(): Promise<void> {
    this.initializeCategories(initialCategory2023);
  }

  async initializeCategoriesFor2022(): Promise<void> {
    this.initializeCategories(initialCategory2022);
  }

  async initializeCategoriesFor2021(): Promise<void> {
    this.initializeCategories(initialCategory2021);
  }

  private async getBoardForCategory(
    category: CategoryDto,
  ): Promise<Array<BoardLineItemDto>> {
    const listScriptUrl = this.getPlaylistUrlForCategory(category);

    const board = await this.getBoardFromCategoryUrl(listScriptUrl);

    return board;
  }

  private async initializeCategories(
    categoriesDto: Array<CategoryDto>,
  ): Promise<void> {
    categoriesDto.forEach(async (category) => {
      const found = await this.categoryRepository.findOne({
        where: { name: category.name },
      });
      if (!found.isBoardComplete) {
        const categoryBoard = await this.getBoardForCategory(found);
        const board = await this.boardLineItemRepository.save(categoryBoard);
        const categoryWithNewBoard: CategoryDto = {
          ...found,
          board,
        };

        this.categoryRepository.save(categoryWithNewBoard);
      }
      if (!found) {
        await this.categoryRepository.save(category);
      }
    });
  }
}

function convertDateToRadioEinsDate(dateFormat: Date): string {
  const date = dateFormat.getDate();
  const month = dateFormat.getMonth();
  const year = dateFormat.getFullYear();
  const hour = dateFormat.getHours();

  return `${date}-${month}-${year}_${hour}-00`;
}

class RadioEinsDate {
  public dateFormat: Date;

  constructor(private radioEinsFormat: string) {
    const [datum, uhrzeit] = this.radioEinsFormat.split('_');
    const [date, month, year] = datum.split('-');
    const [hour] = uhrzeit.split('-');

    this.dateFormat = new Date(`${year}-${month}-${date}T${hour}:00:00.000Z`);
  }
}

const initialCategory2023: Array<CategoryDto> = [
  {
    name: 'Top100BreakUps',
    year: 2023,
    airingStartsAt: new RadioEinsDate('16-07-2023_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('16-07-2023_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100BodyParts',
    year: 2023,
    airingStartsAt: new RadioEinsDate('23-07-2023_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('23-07-2023_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Questions',
    year: 2023,
    airingStartsAt: new RadioEinsDate('30-07-2023_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('30-07-2023_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Psychedelic',
    year: 2023,
    airingStartsAt: new RadioEinsDate('06-08-2023_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('06-08-2023_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Scandal',
    year: 2023,
    airingStartsAt: new RadioEinsDate('13-08-2023_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('13-08-2023_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Water',
    year: 2023,
    airingStartsAt: new RadioEinsDate('20-08-2023_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('20-08-2023_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Zero',
    year: 2023,
    airingStartsAt: new RadioEinsDate('27-08-2023_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('27-08-2023_19-00').dateFormat,
    board: [],
  },
];

const initialCategory2022: Array<CategoryDto> = [
  {
    name: 'Top100Nineties',
    year: 2022,
    airingStartsAt: new RadioEinsDate('21-08-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('21-08-2022_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Rock',
    year: 2022,
    airingStartsAt: new RadioEinsDate('14-08-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('14-08-2022_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Clothes',
    year: 2022,
    airingStartsAt: new RadioEinsDate('07-08-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('07-08-2022_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Frauen',
    year: 2022,
    airingStartsAt: new RadioEinsDate('31-07-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('31-07-2022_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100NDW',
    year: 2022,
    airingStartsAt: new RadioEinsDate('24-07-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('24-07-2022_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Sex',
    year: 2022,
    airingStartsAt: new RadioEinsDate('17-07-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('17-07-2022_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Radio',
    year: 2022,
    airingStartsAt: new RadioEinsDate('10-07-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('10-07-2022_19-00').dateFormat,
    board: [],
  },
];

const initialCategory2021: Array<CategoryDto> = [
  {
    name: 'Top100Instrumentals',
    year: 2021,
    airingStartsAt: new RadioEinsDate('08-08-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('08-08-2021_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Mobility',
    year: 2021,
    airingStartsAt: new RadioEinsDate('01-08-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('01-08-2021_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Eighties',
    year: 2021,
    airingStartsAt: new RadioEinsDate('25-07-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('25-07-2021_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Drugs',
    year: 2021,
    airingStartsAt: new RadioEinsDate('18-07-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('18-07-2021_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Animals',
    year: 2021,
    airingStartsAt: new RadioEinsDate('11-07-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('11-07-2021_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Numbers',
    year: 2021,
    airingStartsAt: new RadioEinsDate('04-07-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('04-07-2021_19-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Family',
    year: 2021,
    airingStartsAt: new RadioEinsDate('27-06-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('27-06-2021_19-00').dateFormat,
    board: [],
  },
];
