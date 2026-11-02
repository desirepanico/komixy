import { Component, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { HorizontalScroller } from '../../../../shared/components/horizontal-scroller/horizontal-scroller';
import { ComicCard } from '../../components/comic-card/comic-card';
import { ComicRankCard } from '../../components/comic-rank-card/comic-rank-card';
import { ComicItem } from '../../models/comic.model';

@Component({
  selector: 'app-discover-page',
  imports: [ComicCard, ComicRankCard, TranslocoPipe, HorizontalScroller],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {
  public selectedId = signal<string | null>(null); // ID del fumetto attualmente selezionato nei preferiti
  public comics = signal<ComicItem[]>([
    {
      id: '1',
      title: 'Neon Horizon',
      author: 'C. Arisato',
      volume: 4,
      totalVolumes: 12,
      isSingleVolume: false,
      editionType: null,
      coverUrl: 'https://picsum.photos/seed/komixy-neon/160/200',
    },
    {
      id: '2',
      title: 'Neon Horizon: Chronicles of the Last Star',
      author: 'Chiara Arisato & Lorenzo Hayakawa',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: 'variant',
      coverUrl: 'https://picsum.photos/seed/komixy-neon-alt/160/200',
    },
    {
      id: '3',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: 6,
      isSingleVolume: false,
      editionType: 'deluxe',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '4',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'collector',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '5',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'collector',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '6',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'collector',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
    {
      id: '7',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'collector',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
  ]);

  // Manga della settimana: in ordine di classifica
  public weeklyComics = signal<ComicItem[]>([
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
      editionType: 'collector',
      coverUrl: 'https://picsum.photos/seed/komixy-week-7/160/200',
    },
    {
      id: 'w8',
      title: 'Il Faro Silenzioso',
      author: 'Sora Kimura',
      volume: 1,
      totalVolumes: null,
      isSingleVolume: true,
      editionType: 'exclusive',
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

  // Seleziona o deseleziona un fumetto dai preferiti
  public toggleBookmark(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
  }
}
