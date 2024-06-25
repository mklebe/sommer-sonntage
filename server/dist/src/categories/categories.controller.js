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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const fuse_js_1 = __importDefault(require("fuse.js"));
const _2023_scandals_1 = require("../../datdastorage/2023_scandals");
const _2023_water_1 = require("../../datdastorage/2023_water");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async receiveBoard(categorySlug) {
        if (categorySlug === 'Top100Scandal') {
            return _2023_scandals_1.top100Scandals;
        }
        else if (categorySlug === 'Top100Water') {
            return _2023_water_1.top100Water;
        }
        else {
            return this.categoriesService.getAllBoardByCategory(categorySlug);
        }
    }
    async getAllCategories() {
        const categories = await this.categoriesService.getAllConfiguredCategories();
        delete categories[0].board;
        return categories;
    }
    async getAllWithCategory(categorySlug) {
        return this.receiveBoard(categorySlug);
    }
    async findBulkSongInCategory(categorySlug, searchList, response) {
        let list;
        if (categorySlug === 'Top100Scandal') {
            list = _2023_scandals_1.top100Scandals;
        }
        else if (categorySlug === 'Top100Water') {
            list = _2023_water_1.top100Water;
        }
        else {
            list = await this.categoriesService.getAllBoardByCategory(categorySlug);
        }
        if (!list) {
            response.status(common_1.HttpStatus.NOT_FOUND).send([]);
        }
        const searchResult = searchList.map(({ artist, title }) => {
            const hit = this.searchHit(list, artist, title);
            if (hit) {
                return hit;
            }
            else {
                return {
                    artist,
                    title,
                    placement: 0,
                };
            }
        });
        response.status(common_1.HttpStatus.OK).send(searchResult);
    }
    async findSongInCategory(categorySlug, { artist, title }, response) {
        const list = await this.categoriesService.getAllBoardByCategory(categorySlug);
        if (!list) {
            response.status(common_1.HttpStatus.NOT_FOUND).send([]);
        }
        const hit = this.searchHit(list, artist, title);
        if (hit) {
            response.status(common_1.HttpStatus.OK).send(hit);
        }
        else {
            response.status(common_1.HttpStatus.OK).send({
                artist,
                title,
                placement: 0,
            });
        }
    }
    searchHit(list, artist, title) {
        const cleanedArtist = decodeURIComponent(artist);
        const cleanedTitle = decodeURIComponent(title);
        const defaultConfig = {
            shouldSort: true,
            threshold: 0.25,
            includeScore: true,
        };
        const artistSearch = new fuse_js_1.default(list, Object.assign(Object.assign({}, defaultConfig), { keys: ['artist'] }));
        const titleSearch = new fuse_js_1.default(list, Object.assign(Object.assign({}, defaultConfig), { keys: ['title'] }));
        const artistHits = artistSearch
            .search(cleanedArtist)
            .map((item) => item.item);
        const titleHits = titleSearch
            .search(decodeURIComponent(cleanedTitle))
            .map((item) => item.item);
        const [hit] = artistHits.filter((value) => titleHits.includes(value));
        return hit;
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getAllWithCategory", null);
__decorate([
    (0, common_1.Post)('search/bulk/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findBulkSongInCategory", null);
__decorate([
    (0, common_1.Post)('search/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findSongInCategory", null);
CategoriesController = __decorate([
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
exports.CategoriesController = CategoriesController;
//# sourceMappingURL=categories.controller.js.map