"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const fuse_js_1 = __importDefault(require("fuse.js"));
let RankingService = class RankingService {
    constructor() {
        this.categoryIndices = new Map();
        this.defaultIndexConfiguration = {
            shouldSort: true,
            threshold: 0.25,
            includeScore: true,
        };
    }
    getHello() {
        console.log('Hello from RankingService');
    }
    createIndexForCategory(category, songs) {
        if (this.categoryIndices.has(category)) {
            throw new Error('Category already exists');
        }
        const uniqueSongs = new Set(songs.map((song) => `${song.artist}-${song.title}`));
        if (uniqueSongs.size !== songs.length) {
            throw new Error('Duplicate song');
        }
        this.categoryIndices.set(category, {
            artistIndex: new fuse_js_1.default(songs, Object.assign(Object.assign({}, this.defaultIndexConfiguration), { keys: ['artist'] })),
            titleIndex: new fuse_js_1.default(songs, Object.assign(Object.assign({}, this.defaultIndexConfiguration), { keys: ['title'] })),
        });
    }
    getRatingForSong(category, artist, title) {
        const index = this.categoryIndices.get(category);
        if (!index) {
            throw new Error('Category not set');
        }
        const artistHits = index.artistIndex
            .search(artist)
            .map((item) => item.item);
        const titleHits = index.titleIndex.search(title).map((item) => item.item);
        const hit = artistHits.filter((value) => titleHits.includes(value))[0] || {
            artist,
            title,
            placement: 0,
        };
        return hit;
    }
};
RankingService = __decorate([
    (0, common_1.Injectable)()
], RankingService);
exports.RankingService = RankingService;
//# sourceMappingURL=ranking.service.js.map