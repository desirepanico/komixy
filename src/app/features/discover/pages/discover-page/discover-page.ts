import { afterNextRender, Component, ElementRef, signal, viewChild } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matChevronLeftOutline, matChevronRightOutline } from '@ng-icons/material-symbols/outline';
import { Button } from 'primeng/button';
import { ComicCard, EditionType } from '../../components/comic-card/comic-card';

// Modello che rappresenta un fumetto nella pagina Discovery
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
  imports: [ComicCard, Button, NgIcon, TranslocoPipe],
  templateUrl: './discover-page.html',
  providers: [
    provideIcons({
      matChevronLeftOutline,
      matChevronRightOutline,
    }),
  ],
})
export class DiscoverPage {
  private comicListRef = viewChild<ElementRef<HTMLDivElement>>('comicList'); // Riferimento al contenitore scrollabile del template.

  // Osserva i cambiamenti delle dimensioni della lista.
  private resizeObserver?: ResizeObserver;

  public canScrollLeft = signal<boolean>(false);
  public canScrollRight = signal<boolean>(false);
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

  // Osserva le dimensioni dei contenitori per rilevare
  constructor() {
    afterNextRender(() => {
      const element = this.comicListRef()?.nativeElement;
      if (!element) return;

      this.resizeObserver = new ResizeObserver(() => {
        this.updateScrollState(element);
      });

      this.resizeObserver.observe(element);
      if (element.parentElement) {
        this.resizeObserver.observe(element.parentElement);
      }

      this.updateScrollState(element);
    });
  }
  /**_
   * Aggiorna la visibilità delle frecce in base alla posizione
   * corrente e allo spazio disponibile per lo scorrimento.
   */
  public updateScrollState(element: HTMLElement): void {
    const maxScrollLeft = element.scrollWidth - element.clientWidth;

    this.canScrollLeft.set(element.scrollLeft > 1);
    this.canScrollRight.set(element.scrollLeft < maxScrollLeft - 1);
  }

  // Seleziona o deseleziona un fumetto dai preferiti
  public toggleBookmark(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
  }

  // Scorre il carosello nella direzione richiesta:
  // 1 = avanti, -1 = indietro
  public scrollComics(container: HTMLElement, direction: number): void {
    container.scrollBy({
      // Scorre di una larghezza pari all'area visibile
      left: container.clientWidth * direction,
      behavior: 'smooth',
    });
  }
}
