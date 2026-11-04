import { Component, computed, input } from '@angular/core';

export type ButtonVariant = 'filled' | 'outlined' | 'text';
export type ButtonSeverity = 'primary' | 'secondary';

const COLORS: Record<ButtonSeverity, Record<ButtonVariant, string>> = {
  primary: {
    filled: 'bg-primary-500 text-surface-900 hover:bg-primary-300 active:bg-primary-200',
    outlined: 'border border-primary-400 text-primary-300 hover:bg-primary-400/10',
    text: 'text-surface-400 hover:text-surface-100',
  },
  secondary: {
    filled: 'bg-surface-700 text-surface-100 hover:bg-surface-600 active:bg-surface-500',
    outlined: 'border border-surface-500 text-surface-300 hover:bg-surface-500/10',
    text: 'text-surface-500 hover:text-surface-300',
  },
};

/**
 * Bottone (ex p-button). Si applica a elementi nativi, così funzionano `routerLink`, `click` e `disabled`:
 *   <button appButton (click)="...">Testo</button>
 *   <a appButton routerLink="/x">Testo</a>
 *   <button appButton severity="secondary">Testo</button>
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
  /** primary = viola (default), secondary = neutro */
  public readonly severity = input<ButtonSeverity>('primary');
  /** true = bottone tondo di sola icona (serve aria-label) */
  public readonly iconOnly = input<boolean>(false);
  /** true = bordi completamente tondi (pillola/cerchio, come `rounded` di PrimeNG); false = angoli arrotondati (rounded-xl) */
  public readonly rounded = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-40';
    const variant = this.variant();
    const colors = COLORS[this.severity()][variant];
    const radius = this.rounded() ? 'rounded-full' : 'rounded-xl';
    // il bottone text lascia a chi lo usa allineamento, spaziature e testo
    if (variant === 'text' && !this.iconOnly()) {
      return `${base} ${colors} ${radius}`;
    }
    const size = this.iconOnly() ? 'size-10' : 'px-5 py-2.5 text-sm';
    return `${base} justify-center gap-2 font-semibold ${colors} ${size} ${radius}`;
  });
}
