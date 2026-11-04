import { computed, Injectable, signal } from '@angular/core';
import { RankingEntry } from '../models/ranking-entry.model';
import { ComicItem } from '../../../core/models/comic.model';

/** Classifica dei manga più letti della settimana, in ordine di posizione. */
@Injectable({ providedIn: 'root' })
export class WeeklyRankingService {
  // TODO: sostituire con i dati reali dell'API
  private readonly comics = signal<ComicItem[]>([
    {
      id: 'w1',
      title: 'Neon Horizon',
      author: 'C. Arisato',
      volume: 5,
      totalVolumes: 12,
      isSingleVolume: false,
      editionType: null,
      coverUrl: 'https://picsum.photos/seed/komixy-week-1/160/200',
    },
    {
      id: 'w2',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 3,
      totalVolumes: 6,
      isSingleVolume: false,
      editionType: 'deluxe',
      coverUrl: 'https://picsum.photos/seed/komixy-week-2/160/200',
    },
    {
      id: 'w3',
      title: 'Le Cronache di Aurora',
      author: 'Mei Tanaka',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: 'limited',
      coverUrl: 'https://picsum.photos/seed/komixy-week-3/160/200',
    },
    {
      id: 'w4',
      title: 'Midnight Ronin',
      author: 'Takeshi Mori',
      volume: 8,
      totalVolumes: 20,
      isSingleVolume: false,
      editionType: null,
      coverUrl: 'https://picsum.photos/seed/komixy-week-4/160/200',
    },
    {
      id: 'w5',
      title: 'Stella Errante',
      author: 'Yuki Hayashi',
      volume: 2,
      totalVolumes: 9,
      isSingleVolume: false,
      editionType: 'variant',
      coverUrl: 'https://picsum.photos/seed/komixy-week-5/160/200',
    },
    {
      id: 'w6',
      title: 'Ombre di Kyoto',
      author: 'Hana Ishida',
      volume: 4,
      totalVolumes: 10,
      isSingleVolume: false,
      editionType: null,
      coverUrl: 'https://picsum.photos/seed/komixy-week-6/160/200',
    },
    {
      id: 'w7',
      title: 'Dragon Forge',
      author: 'Ryo Nakamura',
      volume: 11,
      totalVolumes: 30,
      isSingleVolume: false,
      editionType: 'limited',
      coverUrl: 'https://picsum.photos/seed/komixy-week-7/160/200',
    },
    {
      id: 'w8',
      title: 'Il Faro Silenzioso',
      author: 'Sora Kimura',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: 'variant',
      coverUrl: 'https://picsum.photos/seed/komixy-week-8/160/200',
    },
    {
      id: 'w9',
      title: 'Pixel Samurai',
      author: 'Aoi Fujita',
      volume: 6,
      totalVolumes: 14,
      isSingleVolume: false,
      editionType: null,
      coverUrl: 'https://picsum.photos/seed/komixy-week-9/160/200',
    },
    {
      id: 'w10',
      title: 'Eclipse Academy',
      author: 'Daichi Sasaki',
      volume: 3,
      totalVolumes: 8,
      isSingleVolume: false,
      editionType: 'deluxe',
      coverUrl: 'https://picsum.photos/seed/komixy-week-10/160/200',
    },
  ]);

  /** La classifica: la posizione dipende dall'ordine dei fumetti */
  public readonly entries = computed<RankingEntry[]>(() =>
    this.comics().map((comic, index) => ({ rank: index + 1, comic })),
  );
}
