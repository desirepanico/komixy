import { Component, computed, input } from '@angular/core';

export type ButtonVariant = 'filled' | 'outlined' | 'text';
export type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';

// Colori presi dai set Severity, Outlined e Text del file Figma "Manga App"
const FILLED_TEXT = 'text-surface-800';
const COLORS: Record<ButtonSeverity, Record<ButtonVariant, string>> = {
  primary: {
    filled: `bg-primary-300 ${FILLED_TEXT} hover:bg-primary-500`,
    outlined: 'border border-primary-400 text-primary-300 hover:bg-primary-400/15',
    text: 'text-primary-300 hover:bg-primary-400/15',
  },
  secondary: {
    filled: 'border border-surface-700 bg-surface-800 text-primary-300 hover:border-surface-600 hover:bg-surface-700',
    outlined: 'border border-surface-600 text-surface-400 hover:bg-surface-600/15',
    text: 'text-surface-400 hover:bg-surface-600/15',
  },
  success: {
    filled: `bg-green-400 ${FILLED_TEXT} hover:bg-green-300`,
    outlined: 'border border-green-400 text-green-400 hover:bg-green-400/15',
    text: 'text-green-400 hover:bg-green-400/15',
  },
  info: {
    filled: `bg-blue-400 ${FILLED_TEXT} hover:bg-sky-300`,
    outlined: 'border border-blue-400 text-blue-400 hover:bg-blue-400/15',
    text: 'text-blue-400 hover:bg-blue-400/15',
  },
  warn: {
    filled: `bg-orange-400 ${FILLED_TEXT} hover:bg-orange-300`,
    outlined: 'border border-orange-300 text-orange-300 hover:bg-orange-300/15',
    text: 'text-orange-300 hover:bg-orange-300/15',
  },
  danger: {
    filled: `bg-rose-400 ${FILLED_TEXT} hover:bg-rose-300`,
    outlined: 'border border-rose-300 text-rose-300 hover:bg-rose-300/15',
    text: 'text-red-400 hover:bg-red-400/15',
  },
  contrast: {
    filled: `bg-surface-100 ${FILLED_TEXT} hover:bg-surface-300`,
    outlined: 'border border-surface-100 text-surface-100 hover:bg-surface-100/15',
    text: 'text-surface-100 hover:bg-surface-100/15',
  },
};

/**
 * Bottone (ex p-button). Si applica a elementi nativi, così funzionano `routerLink`, `click` e `disabled`:
 *   <button appButton (click)="...">Testo</button>
 *   <a appButton routerLink="/x">Testo</a>
 *   <button appButton severity="danger">Testo</button>
 *   <button appButton variant="outlined" [iconOnly]="true" [rounded]="true" aria-label="..."><ng-icon .../></button>
 */
@Component({
  selector: 'button[appButton], a[appButton]',
  host: { '[class]': 'classes()' },
  templateUrl: './button.html',
})
export class Button {
  /** filled = pieno viola (default), outlined = solo bordo, text = senza sfondo (spaziature e testo li decide chi lo usa, tranne iconOnly) */
  public readonly variant = input<ButtonVariant>('filled');
  /** colore del bottone, come nei set Figma: primary (default), secondary, success, info, warn, danger, contrast */
  public readonly severity = input<ButtonSeverity>('primary');
  /** true = bottone tondo di sola icona (serve aria-label) */
  public readonly iconOnly = input<boolean>(false);
  /** true = bordi completamente tondi (pillola/cerchio, come `rounded` di PrimeNG); false = angoli arrotondati (rounded-sm) */
  public readonly rounded = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-40';
    const variant = this.variant();
    const colors = COLORS[this.severity()][variant];
    const radius = this.rounded() ? 'rounded-full' : 'rounded-sm';
    // il bottone text lascia a chi lo usa allineamento, spaziature e testo
    if (variant === 'text' && !this.iconOnly()) {
      return `${base} ${colors} ${radius}`;
    }
    const size = this.iconOnly() ? 'size-10' : 'h-11 px-4 text-base';
    return `${base} justify-center gap-2 font-semibold ${colors} ${size} ${radius}`;
  });
}
