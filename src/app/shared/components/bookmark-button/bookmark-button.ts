import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBookmarkOutline } from '@ng-icons/material-symbols/outline';

/**
 * Bottone tondo "segnalibro" in stile glass. Si applica a un <button>; posizione e click si gestiscono fuori:
 *   <button appBookmarkButton type="button" class="absolute right-2 top-2" [bookmarked]="x" (click)="...">
 */
@Component({
  selector: 'button[appBookmarkButton]',
  imports: [NgIcon, TranslocoPipe],
  templateUrl: './bookmark-button.html',
  providers: [provideIcons({ matBookmarkOutline })],
  host: {
    '[class]': 'classes()',
    '[attr.aria-pressed]': 'bookmarked()',
  },
})
export class BookmarkButton {
  public readonly bookmarked = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'flex size-9 cursor-pointer items-center justify-center rounded-full border text-primary-300 backdrop-blur-md transition-all outline-hidden focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-400';
    const tone = this.bookmarked()
      ? 'border-primary-400 bg-primary-900/90'
      : 'border-surface-50/20 bg-surface-950/75';
    return `${base} ${tone}`;
  });
}
