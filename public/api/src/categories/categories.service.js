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
const categoryConfig_1 = require("./categoryConfig");
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
            ...categoryConfig_1.initialCategory2021,
            ...categoryConfig_1.initialCategory2022,
            ...categoryConfig_1.initialCategory2023,
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
//# sourceMappingURL=categories.service.js.map