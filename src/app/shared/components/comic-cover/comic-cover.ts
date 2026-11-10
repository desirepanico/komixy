import { Component, computed, input, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBrokenImageOutline } from '@ng-icons/material-symbols/outline';
import { Skeleton } from '../skeleton/skeleton';

/**
 * Copertina con skeleton finché l'immagine è in attesa e segnaposto se non carica.
 * Dimensioni e raggio le decide chi la usa con le classi sul tag: `<app-comic-cover class="h-20 aspect-2/3 rounded-lg" ... />`.
 */
@Component({
  selector: 'app-comic-cover',
  imports: [TranslocoPipe, Skeleton, NgIcon],
  providers: [provideIcons({ matBrokenImageOutline })],
  templateUrl: './comic-cover.html',
  host: { class: 'relative block overflow-hidden' },
})
export class ComicCover {
  public readonly src = input.required<string>();
  public readonly title = input.required<string>();
  /** Copertina visibile senza scorrere: si scarica subito e non in lazy */
  public readonly eager = input<boolean>(false);
  public readonly fetchPriority = input<'high' | 'auto'>('auto');
  /** Leggero ingrandimento quando la card che la contiene (`group`) ha il mouse sopra */
  public readonly zoom = input<boolean>(false);

  protected readonly loaded = signal<boolean>(false);
  protected readonly failed = signal<boolean>(false);

  protected readonly imageClasses = computed(() =>
    this.zoom()
      ? 'size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
      : 'size-full object-cover',
  );

  protected onLoad(): void {
    this.loaded.set(true);
  }

  protected onError(): void {
    this.loaded.set(true);
    this.failed.set(true);
  }
}
