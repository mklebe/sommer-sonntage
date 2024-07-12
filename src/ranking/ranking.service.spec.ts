import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';

describe('RankingService', () => {
  let service: RankingService;
  let artist: string;
  let title: string;
  let category: string;

  beforeEach(async () => {
    artist = 'The Ramones';
    title = 'Bonzo Goes to Bitburg';
    category = 'Top100Punk';
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankingService],
    }).compile();

    service = module.get<RankingService>(RankingService);
  });

  // Adjusted helper function to accept expected placement
  function createIndexAndSong(
    songs: any[] = [],
    expectedPlacement: number,
    cat: string = category,
  ) {
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
    const expectedPlacement = 0; // Placement value might not be relevant for this test
    createIndexAndSong([], expectedPlacement, category); // Setup category
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
