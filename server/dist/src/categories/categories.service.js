"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const jsdom_1 = require("jsdom");
const axios_1 = require("@nestjs/axios");
const cat_scheduler_service_1 = require("../cat-scheduler/cat-scheduler.service");
let CategoriesService = class CategoriesService {
    constructor(httpService, catSchedulerService) {
        this.httpService = httpService;
        this.catSchedulerService = catSchedulerService;
    }
    async getBoardFromCategoryUrl(catUrl) {
        return new Promise((resolve) => {
            this.httpService
                .get(catUrl, {
                responseType: 'arraybuffer',
            })
                .subscribe((response) => {
                const songListDocument = response.data.toString('UTF-8');
                const lines = this.parseRadioPlaylist(songListDocument);
                resolve(lines);
            });
        });
    }
    parseRadioPlaylist(listScript) {
        const top100Table = new RegExp('<table(.|\n)*?</table>');
        let currentPosition = 100;
        const { document } = new jsdom_1.JSDOM(listScript.match(top100Table)[0]).window;
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
    getAllConfiguredCategories() {
        return [
            ...initialCategory2021,
            ...initialCategory2022,
            ...initialCategory2023,
        ];
    }
    getPlaylistUrlForCategory({ airingStartsAt, airingEndsAt, }) {
        const start = convertDateToRadioEinsDate(airingStartsAt, '09');
        const end = convertDateToRadioEinsDate(airingEndsAt, '19');
        return `https://playlist.funtip.de/playList.do?action=searching&remote=1&version=2&from=${start}&to=${end}&jsonp_callback=jQuery224044240703639644585_1627199132642&_=1627199132643`;
    }
    async getAllBoardByCategory(categorySlug) {
        const allCategories = this.getAllConfiguredCategories();
        allCategories.forEach((category) => {
            const a = Object.assign(Object.assign({}, category), { id: 0 });
            console.log(`Checking ${a.name} ${this.catSchedulerService.isAiring(a)}`);
        });
        const currentCategory = allCategories.find((i) => i.name === categorySlug);
        if (!currentCategory) {
            return Promise.reject('Could not find category');
        }
        const url = this.getPlaylistUrlForCategory(currentCategory);
        return await this.getBoardFromCategoryUrl(url);
    }
};
CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        cat_scheduler_service_1.CatSchedulerService])
], CategoriesService);
exports.CategoriesService = CategoriesService;
function convertDateToRadioEinsDate(dateFormat, hour) {
    const date = dateFormat.getDate();
    const month = dateFormat.getMonth() + 1;
    const year = dateFormat.getFullYear();
    return `${date}-${month}-${year}_${hour}-00`;
}
class RadioEinsDate {
    constructor(radioEinsFormat) {
        this.radioEinsFormat = radioEinsFormat;
        const [datum, uhrzeit] = this.radioEinsFormat.split('_');
        const [date, month, year] = datum.split('-');
        const [hour] = uhrzeit.split('-');
        this.dateFormat = new Date(`${year}-${month}-${date}T${hour}:00:00.000Z`);
    }
}
const initialCategory2023 = [
    {
        name: 'Top100Trennungslieder',
        year: 2023,
        airingStartsAt: new RadioEinsDate('16-07-2023_07-00').dateFormat,
        airingEndsAt: new RadioEinsDate('16-07-2023_17-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/2023/trennungslieder/trennung_top_100.html',
    },
    {
        name: 'Top100BodyParts',
        year: 2023,
        airingStartsAt: new RadioEinsDate('23-07-2023_07-00').dateFormat,
        airingEndsAt: new RadioEinsDate('23-07-2023_17-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/2023/koerperteile/koerperteile_die_top_100.html',
    },
    {
        name: 'Top100Questions',
        year: 2023,
        airingStartsAt: new RadioEinsDate('30-07-2023_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('30-07-2023_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/2023/fragen/fragen_die_top_100.html',
    },
    {
        name: 'Top100Psychedelic',
        year: 2023,
        airingStartsAt: new RadioEinsDate('06-08-2023_07-00').dateFormat,
        airingEndsAt: new RadioEinsDate('06-08-2023_17-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/2023/psychedelia/psychedelia_die_top_100.html',
    },
    {
        name: 'Top100Scandal',
        year: 2023,
        airingStartsAt: new RadioEinsDate('13-08-2023_07-00').dateFormat,
        airingEndsAt: new RadioEinsDate('13-08-2023_17-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/2023/skandal-songs/skandal_die_top_100.html',
    },
    {
        name: 'Top100Water',
        year: 2023,
        airingStartsAt: new RadioEinsDate('20-08-2023_07-00').dateFormat,
        airingEndsAt: new RadioEinsDate('20-08-2023_17-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/2023/wasser/wasser_die_top_100.html',
    },
    {
        name: 'Top100Zero',
        year: 2023,
        airingStartsAt: new RadioEinsDate('27-08-2023_07-00').dateFormat,
        airingEndsAt: new RadioEinsDate('27-08-2023_17-00').dateFormat,
        board: [],
    },
];
const initialCategory2022 = [
    {
        name: 'Top100Nineties',
        year: 2022,
        airingStartsAt: new RadioEinsDate('21-08-2022_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('21-08-2022_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_songs_der_90er_jahre/nineties_die_top_100.html',
    },
    {
        name: 'Top100Rock',
        year: 2022,
        airingStartsAt: new RadioEinsDate('14-08-2022_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('14-08-2022_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_hard_rock_und_heavy_metal_songs/rock_hard_die_top_100.html',
    },
    {
        name: 'Top100Clothes',
        year: 2022,
        airingStartsAt: new RadioEinsDate('07-08-2022_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('07-08-2022_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_songs_ueber_klamotten/jeans_on_die_top_100.html',
    },
    {
        name: 'Top100Frauen',
        year: 2022,
        airingStartsAt: new RadioEinsDate('31-07-2022_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('31-07-2022_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_lieder_von_frauen/female_power_die_top_100.html',
    },
    {
        name: 'Top100NDW',
        year: 2022,
        airingStartsAt: new RadioEinsDate('24-07-2022_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('24-07-2022_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_ndw_lieder/ich_geb_gas_die_top_100.html',
    },
    {
        name: 'Top100Sex',
        year: 2022,
        airingStartsAt: new RadioEinsDate('17-07-2022_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('17-07-2022_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_songs_ueber_sex/lets_talk_about_die_top_100.html',
    },
    {
        name: 'Top100Radio',
        year: 2022,
        airingStartsAt: new RadioEinsDate('10-07-2022_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('10-07-2022_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die-100-besten-2022/die_100_besten_lieder_uebers_radio/radio_on_die_top_100.html',
    },
];
const initialCategory2021 = [
    {
        name: 'Top100Instrumentals',
        year: 2021,
        airingStartsAt: new RadioEinsDate('08-08-2021_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('08-08-2021_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_instrumentallieder/instrumentals_die_top_100.html',
    },
    {
        name: 'Top100Mobility',
        year: 2021,
        airingStartsAt: new RadioEinsDate('01-08-2021_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('01-08-2021_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_mobilitaetslieder/on_the_road_die_top_100.html',
    },
    {
        name: 'Top100Eighties',
        year: 2021,
        airingStartsAt: new RadioEinsDate('25-07-2021_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('25-07-2021_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_songs_der_80er/eighties_die_top_100.html',
    },
    {
        name: 'Top100Drugs',
        year: 2021,
        airingStartsAt: new RadioEinsDate('18-07-2021_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('18-07-2021_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_drogenlieder/flying_high_die_top_100.html',
    },
    {
        name: 'Top100Animals',
        year: 2021,
        airingStartsAt: new RadioEinsDate('11-07-2021_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('11-07-2021_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_tierlieder/animals_die_top_100.html',
    },
    {
        name: 'Top100Numbers',
        year: 2021,
        airingStartsAt: new RadioEinsDate('04-07-2021_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('04-07-2021_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_zahlenlieder/magic_numbers_die_top_100.html',
    },
    {
        name: 'Top100Family',
        year: 2021,
        airingStartsAt: new RadioEinsDate('27-06-2021_09-00').dateFormat,
        airingEndsAt: new RadioEinsDate('27-06-2021_19-00').dateFormat,
        board: [],
        finishedListUrl: 'https://www.radioeins.de/musik/top_100/die_100_besten_2021/die_100_besten_familienlieder/we_are_family_die_top_100.html',
    },
];
//# sourceMappingURL=categories.service.js.map