"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ranking_service_1 = require("./ranking.service");
describe('RankingService', () => {
    let service;
    let artist;
    let title;
    let category;
    beforeEach(async () => {
        artist = 'The Ramones';
        title = 'Bonzo Goes to Bitburg';
        category = 'Top100Punk';
        const module = await testing_1.Test.createTestingModule({
            providers: [ranking_service_1.RankingService],
        }).compile();
        service = module.get(ranking_service_1.RankingService);
    });
    function createIndexAndSong(songs = [], expectedPlacement, cat = category) {
        service.createIndexForCategory(cat, songs);
        return {
            artist,
            title,
            placement: expectedPlacement,
        };
    }
    it('should throw an error when creating an index for a category with the same name and artist', () => {
        const songs = [
            {
                artist: 'The Clash',
                title: 'London Calling',
                placement: 1,
            },
            {
                artist: 'The Clash',
                title: 'London Calling',
                placement: 2,
            },
        ];
        expect(() => {
            service.createIndexForCategory(category, songs);
        }).toThrowError('Duplicate song');
    });
    it('should return an object with placement 0 when the artist and the title are in the list but different entries', () => {
        const songs = [
            { artist: 'The Clash', title: 'Bonzo Goes to Bitburg', placement: 1 },
            { artist: 'The Ramones', title: 'London Calling', placement: 2 },
        ];
        const expectedPlacement = 0;
        const song = createIndexAndSong(songs, expectedPlacement);
        const result = service.getRatingForSong(category, artist, title);
        expect(result).toEqual(song);
    });
    it('should return an object with artist, title, and placement with value 0, when the list is empty', () => {
        const expectedPlacement = 0;
        const song = createIndexAndSong([], expectedPlacement);
        const result = service.getRatingForSong(category, artist, title);
        expect(result).toEqual(song);
    });
    it('should return an object with artist, title and placement with value 0, when the song is not in the list but there are songs in the list', () => {
        const songs = [
            { artist: 'The Clash', title: 'London Calling', placement: 1 },
        ];
        const expectedPlacement = 0;
        const song = createIndexAndSong(songs, expectedPlacement);
        const result = service.getRatingForSong(category, artist, title);
        expect(result).toEqual(song);
    });
    it('should throw a CategoryNotSet Error, when the category is not in the list', () => {
        const expectedPlacement = 0;
        createIndexAndSong([], expectedPlacement, category);
        expect(() => {
            service.getRatingForSong('Top100Rock', artist, title);
        }).toThrowError('Category not set');
    });
    it('should throw an error when creating an index which is not unique', () => {
        service.createIndexForCategory(category, []);
        expect(() => {
            service.createIndexForCategory(category, []);
        }).toThrowError('Category already exists');
    });
});
//# sourceMappingURL=ranking.service.spec.js.map