import { Component, computed, input } from '@angular/core';

/**
 * Bottone tondo a due stati (ToggleButton di Figma), per azioni come il segnalibro. Si applica a un `button`;
 * il contenuto è l'icona e l'`aria-label` lo passa chi lo usa:
 *   <button appToggleButton type="button" [pressed]="salvato()" aria-label="..."><ng-icon .../></button>
 */
@Component({
  selector: 'button[appToggleButton]',
  host: {
    '[class]': 'classes()',
    '[attr.aria-pressed]': 'pressed()',
  },
  templateUrl: './toggle-button.html',
})
export class ToggleButton {
  /** true = attivo (sfondo viola scuro e bordo viola) */
  public readonly pressed = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border text-primary-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-40';
    const state = this.pressed()
      ? 'border-primary-500 bg-primary-900'
      : 'border-surface-700 bg-surface-800';
    return `${base} ${state}`;
  });
}
