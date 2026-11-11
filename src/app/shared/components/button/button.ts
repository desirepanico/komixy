import { Component, computed, input } from '@angular/core';
import { BUTTON_COLORS, BUTTON_SIZES } from '../../constants/ui.const';
import { ButtonSeverity, ButtonSize, ButtonVariant } from '../../models/button.model';

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
  /** md = altezza 44px (default), sm = 36px per i bottoni dentro le card */
  public readonly size = input<ButtonSize>('md');
  /** true = bottone tondo di sola icona (serve aria-label) */
  public readonly iconOnly = input<boolean>(false);
  /** true = bordi completamente tondi (pillola/cerchio, come `rounded` di PrimeNG); false = angoli arrotondati (rounded-sm) */
  public readonly rounded = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-40';
    const variant = this.variant();
    const colors = BUTTON_COLORS[this.severity()][variant];
    const radius = this.rounded() ? 'rounded-full' : 'rounded-sm';
    // il bottone text lascia a chi lo usa allineamento, spaziature e testo
    if (variant === 'text' && !this.iconOnly()) {
      return `${base} ${colors} ${radius}`;
    }
    const size = this.iconOnly() ? 'size-10' : BUTTON_SIZES[this.size()];
    return `${base} justify-center gap-2 font-semibold ${colors} ${size} ${radius}`;
  });
}
