import { computed, Injectable, signal } from '@angular/core';
import { RankingEntry } from '../../models/ranking-entry.model';
import { ComicItem } from '../../models/comic.model';

@Injectable({ providedIn: 'root' })
export class WeeklyRankingService {
  // TODO(api): sostituire con i dati reali dell'API
  private readonly comics = signal<ComicItem[]>([
    {
      id: 'w1',
      title: 'One Piece',
      author: 'Eiichiro Oda',
      volume: 107,
      totalVolumes: 110,
      isSingleVolume: false,
      editionType: 'limited',
      coverUrl: '/img/covers/one-piece.webp',
    },
    {
      id: 'w2',
      title: 'Chainsaw Man',
      author: 'Tatsuki Fujimoto',
      volume: 11,
      totalVolumes: 20,
      isSingleVolume: false,
      editionType: null,
      coverUrl: '/img/covers/chainsaw-man.webp',
    },
    {
      id: 'w3',
      title: 'Watchmen',
      author: 'Alan Moore, Dave Gibbons',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: 'deluxe',
      coverUrl: '/img/covers/watchmen.webp',
    },
    {
      id: 'w4',
      title: 'One Piece',
      author: 'Eiichiro Oda',
      volume: 100,
      totalVolumes: 110,
      isSingleVolume: false,
      editionType: 'variant',
      coverUrl: '/img/covers/one-piece.webp',
    },
    {
      id: 'w5',
      title: 'V for Vendetta',
      author: 'Alan Moore, David Lloyd',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: null,
      coverUrl: '/img/covers/v-for-vendetta.webp',
    },
    {
      id: 'w6',
      title: 'Chainsaw Man',
      author: 'Tatsuki Fujimoto',
      volume: 7,
      totalVolumes: 20,
      isSingleVolume: false,
      editionType: 'limited',
      coverUrl: '/img/covers/chainsaw-man.webp',
    },
    {
      id: 'w7',
      title: 'One Piece',
      author: 'Eiichiro Oda',
      volume: 13,
      totalVolumes: 110,
      isSingleVolume: false,
      editionType: null,
      coverUrl: '/img/covers/one-piece.webp',
    },
    {
      id: 'w8',
      title: 'Chainsaw Man',
      author: 'Tatsuki Fujimoto',
      volume: 3,
      totalVolumes: 20,
      isSingleVolume: false,
      editionType: null,
      coverUrl: '/img/covers/chainsaw-man.webp',
    },
    {
      id: 'w9',
      title: 'One Piece',
      author: 'Eiichiro Oda',
      volume: 1,
      totalVolumes: 110,
      isSingleVolume: false,
      editionType: null,
      coverUrl: '/img/covers/one-piece.webp',
    },
    {
      id: 'w10',
      title: 'V for Vendetta',
      author: 'Alan Moore, David Lloyd',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: 'variant',
      coverUrl: '/img/covers/v-for-vendetta.webp',
    },
  ]);

  /** La classifica: la posizione dipende dall'ordine dei fumetti */
  public readonly entries = computed<RankingEntry[]>(() =>
    this.comics().map((comic, index) => ({ rank: index + 1, comic })),
  );
}
