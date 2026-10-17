import { Component, signal } from '@angular/core';
import { ComicCard, EditionType } from '../../components/comic-card/comic-card';
export interface ComicItem {
  id: string;
  title: string;
  author: string;
  volume: number;
  totalVolumes: number | null;
  isSingleVolume: boolean;
  editionType: EditionType | null;
  coverUrl: string;
}
@Component({
  selector: 'app-discover-page',
  imports: [ComicCard],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {
  // Stato per il bookmark selezionato
  public selectedId = signal<string | null>(null);

  // Lista di dati generati
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
      id: '3',
      title: 'Cyber Pulse Reborn',
      author: 'Kenji Sato',
      volume: 2,
      totalVolumes: null,
      isSingleVolume: false,
      editionType: 'collector',
      coverUrl: 'https://picsum.photos/seed/komixy-cyber/160/200',
    },
  ]);

  public toggleBookmark(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
  }
}
