import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BoardLineItem,
  BoardLineItemDto,
  Category,
  CategoryDto,
  CategoryModel,
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

  private async getDocumentStringFromUrl(url: string): Promise<string> {
    return new Promise((resolve) => {
      this.httpService
        .get(url, {
          responseType: 'arraybuffer',
        })
        .subscribe((response) => {
          resolve(response.data.toString('UTF-8'));
        });
    });
  }

  private getBoardFromFinishedListDocument(
    documentString: string,
  ): Array<BoardLineItemDto> {
    const { document } = new JSDOM(documentString).window;
    const artistsList: Array<string> = [
      ...document.querySelectorAll('tr[class^=count] td:nth-child(2)'),
    ].map((i) => i.textContent);
    const songList: Array<string> = [
      ...document.querySelectorAll('tr[class^=count] td:nth-child(3)'),
    ].map((i) => i.textContent);
    return songList.map((title, index) => ({
      placement: index + 1,
      title,
      artist: artistsList[index],
    }));
  }

  private async getBoardForCategory(
    category: CategoryModel,
  ): Promise<Array<BoardLineItemDto>> {
    console.info(`Starts parsing: ${category.name}`);
    const document = await this.getDocumentStringFromUrl(
      category.finishedListUrl,
    );

    const board = this.getBoardFromFinishedListDocument(document);
    console.info(`Parsing: ${category.name} done!`);
    return board;
  }

  public async getAllConfiguredCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  public async getAllBoardByCategory(
    categorySlug,
  ): Promise<BoardLineItemDto[]> {
    const category = await this.categoryRepository.findOne({
      where: { name: categorySlug },
      cache: 3600_000,
    });
    let result: BoardLineItemDto[] = [];
    const categoryModel = new CategoryModel(category);
    if (!categoryModel.isBoardComplete) {
      const url = this.getPlaylistUrlForCategory(categoryModel);
      result = await this.getBoardFromCategoryUrl(url);
    } else {
      result = categoryModel.board;
    }

    return result;
  }

  private async initializeCategories(
    categoriesDto: Array<CategoryDto>,
  ): Promise<void> {
    categoriesDto.forEach(async (category) => {
      let found = await this.categoryRepository.findOne({
        where: { name: category.name },
      });

      if (!found) {
        found = await this.categoryRepository.save(category);
      }

      this.updateFinishedListUrl(found, category);

      const foundModel = new CategoryModel(found);
      if (!foundModel.isBoardComplete && foundModel.finishedListUrl) {
        const categoryBoard = await this.getBoardForCategory(foundModel);
        const board = await this.boardLineItemRepository.save(categoryBoard);
        const categoryWithNewBoard: CategoryDto = {
          ...found,
          board,
        };

        this.categoryRepository.save(categoryWithNewBoard);
      }
    });
  }

  private updateFinishedListUrl(found: Category, category: CategoryDto) {
    if (!found.finishedListUrl && category.finishedListUrl) {
      found.finishedListUrl = category.finishedListUrl;
      this.categoryRepository.save(found);
    }
  }
}

function convertDateToRadioEinsDate(dateFormat: Date): string {
  const date = dateFormat.getDate();
  const month = dateFormat.getMonth() + 1;
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
    name: 'Top100Trennungslieder',
    year: 2023,
    airingStartsAt: new RadioEinsDate('16-07-2023_07-00').dateFormat,
    airingEndsAt: new RadioEinsDate('16-07-2023_17-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/2023/trennungslieder/trennung_top_100.html',
  },
  {
    name: 'Top100BodyParts',
    year: 2023,
    airingStartsAt: new RadioEinsDate('23-07-2023_07-00').dateFormat,
    airingEndsAt: new RadioEinsDate('23-07-2023_17-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/2023/koerperteile/koerperteile_die_top_100.html',
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
    airingStartsAt: new RadioEinsDate('06-08-2023_07-00').dateFormat,
    airingEndsAt: new RadioEinsDate('06-08-2023_17-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Scandal',
    year: 2023,
    airingStartsAt: new RadioEinsDate('13-08-2023_07-00').dateFormat,
    airingEndsAt: new RadioEinsDate('13-08-2023_17-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Water',
    year: 2023,
    airingStartsAt: new RadioEinsDate('20-08-2023_07-00').dateFormat,
    airingEndsAt: new RadioEinsDate('20-08-2023_17-00').dateFormat,
    board: [],
  },
  {
    name: 'Top100Zero',
    year: 2023,
    airingStartsAt: new RadioEinsDate('27-08-2023_07-00').dateFormat,
    airingEndsAt: new RadioEinsDate('27-08-2023_17-00').dateFormat,
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
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_songs_der_90er_jahre/nineties_die_top_100.html',
  },
  {
    name: 'Top100Rock',
    year: 2022,
    airingStartsAt: new RadioEinsDate('14-08-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('14-08-2022_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_hard_rock_und_heavy_metal_songs/rock_hard_die_top_100.html',
  },
  {
    name: 'Top100Clothes',
    year: 2022,
    airingStartsAt: new RadioEinsDate('07-08-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('07-08-2022_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_songs_ueber_klamotten/jeans_on_die_top_100.html',
  },
  {
    name: 'Top100Frauen',
    year: 2022,
    airingStartsAt: new RadioEinsDate('31-07-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('31-07-2022_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_lieder_von_frauen/female_power_die_top_100.html',
  },
  {
    name: 'Top100NDW',
    year: 2022,
    airingStartsAt: new RadioEinsDate('24-07-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('24-07-2022_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_ndw_lieder/ich_geb_gas_die_top_100.html',
  },
  {
    name: 'Top100Sex',
    year: 2022,
    airingStartsAt: new RadioEinsDate('17-07-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('17-07-2022_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_songs_ueber_sex/lets_talk_about_die_top_100.html',
  },
  {
    name: 'Top100Radio',
    year: 2022,
    airingStartsAt: new RadioEinsDate('10-07-2022_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('10-07-2022_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_lieder_uebers_radio/radio_on_die_top_100.html',
  },
];

const initialCategory2021: Array<CategoryDto> = [
  {
    name: 'Top100Instrumentals',
    year: 2021,
    airingStartsAt: new RadioEinsDate('08-08-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('08-08-2021_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_instrumentallieder/instrumentals_die_top_100.html',
  },
  {
    name: 'Top100Mobility',
    year: 2021,
    airingStartsAt: new RadioEinsDate('01-08-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('01-08-2021_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_mobilitaetslieder/on_the_road_die_top_100.html',
  },
  {
    name: 'Top100Eighties',
    year: 2021,
    airingStartsAt: new RadioEinsDate('25-07-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('25-07-2021_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_songs_der_80er/eighties_die_top_100.html',
  },
  {
    name: 'Top100Drugs',
    year: 2021,
    airingStartsAt: new RadioEinsDate('18-07-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('18-07-2021_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_drogenlieder/flying_high_die_top_100.html',
  },
  {
    name: 'Top100Animals',
    year: 2021,
    airingStartsAt: new RadioEinsDate('11-07-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('11-07-2021_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_tierlieder/animals_die_top_100.html',
  },
  {
    name: 'Top100Numbers',
    year: 2021,
    airingStartsAt: new RadioEinsDate('04-07-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('04-07-2021_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_zahlenlieder/magic_numbers_die_top_100.html',
  },
  {
    name: 'Top100Family',
    year: 2021,
    airingStartsAt: new RadioEinsDate('27-06-2021_09-00').dateFormat,
    airingEndsAt: new RadioEinsDate('27-06-2021_19-00').dateFormat,
    board: [],
    finishedListUrl:
      'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_familienlieder/we_are_family_die_top_100.html',
  },
];
