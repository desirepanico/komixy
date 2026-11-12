import { Injectable, inject, signal } from '@angular/core';
import { ComicItem } from '../../models/comic.model';
import { WeeklyRankingService } from '../weekly-ranking/weekly-ranking.service';

/** I fumetti conosciuti dall'app: i «Manga da scoprire» e quelli della classifica settimanale. */
@Injectable({ providedIn: 'root' })
export class ComicCatalogService {
  private readonly ranking = inject(WeeklyRankingService);

  // TODO(api): sostituire con i dati reali dell'API
  private readonly _toDiscover = signal<ComicItem[]>([
    {
      id: 'd1',
      title: 'One Piece',
      author: 'Eiichiro Oda',
      volume: 25,
      totalVolumes: 110,
      isSingleVolume: false,
      editionType: 'variant',
      coverUrl: '/img/covers/one-piece.webp',
    },
    {
      id: 'd2',
      title: 'Chainsaw Man',
      author: 'Tatsuki Fujimoto',
      volume: 5,
      totalVolumes: 20,
      isSingleVolume: false,
      editionType: null,
      coverUrl: '/img/covers/chainsaw-man.webp',
    },
    {
      id: 'd3',
      title: 'V for Vendetta',
      author: 'Alan Moore, David Lloyd',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: 'limited',
      coverUrl: '/img/covers/v-for-vendetta.webp',
    },
    {
      id: 'd4',
      title: 'Watchmen',
      author: 'Alan Moore, Dave Gibbons',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: 'deluxe',
      coverUrl: '/img/covers/watchmen.webp',
    },
  ]);

  public readonly toDiscover = this._toDiscover.asReadonly();

  public find(id: string): ComicItem | undefined {
    return (
      this._toDiscover().find((comic) => comic.id === id) ??
      this.ranking.entries().find((entry) => entry.comic.id === id)?.comic
    );
  }
}
