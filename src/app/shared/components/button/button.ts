import { Component, computed, input } from '@angular/core';
import { BUTTON_COLORS, BUTTON_SIZES } from '../../constants/ui.const';
import { ButtonSeverity, ButtonSize, ButtonVariant } from '../../models/button.model';

/**
 * Si applica a `button` o `a`, così restano validi `routerLink`, `click` e `disabled`.
 *   <button appButton variant="outlined" [iconOnly]="true" aria-label="..."><ng-icon .../></button>
 */
@Component({
  selector: 'button[appButton], a[appButton]',
  host: { '[class]': 'classes()' },
  templateUrl: './button.html',
})
export class Button {
  /** `text` non ha sfondo e lascia a chi lo usa spaziature e testo (tranne `iconOnly`) */
  public readonly variant = input<ButtonVariant>('filled');
  public readonly severity = input<ButtonSeverity>('primary');
  /** `sm` (36 px) è per i bottoni dentro le card, `md` è 44 px */
  public readonly size = input<ButtonSize>('md');
  /** Bottone tondo di sola icona: serve `aria-label` */
  public readonly iconOnly = input<boolean>(false);
  /** true = pillola o cerchio; false = angoli arrotondati */
  public readonly rounded = input<boolean>(false);
  /** Aspetto da link, sottolineato alla selezione: solo su `<a>` */
  public readonly underline = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-40';
    const variant = this.variant();
    const colors = BUTTON_COLORS[this.severity()][variant];
    const radius = this.rounded() ? 'rounded-full' : 'rounded-sm';
    const decoration = this.underline()
      ? 'decoration-current underline-offset-4 hover:underline focus-visible:underline active:underline'
      : '';
    // Il bottone text lascia a chi lo usa allineamento, spaziature e testo
    if (variant === 'text' && !this.iconOnly()) {
      return `${base} ${colors} ${radius} ${decoration}`;
    }
    const size = this.iconOnly() ? 'size-10' : BUTTON_SIZES[this.size()];
    return `${base} justify-center gap-2 font-semibold ${colors} ${size} ${radius} ${decoration}`;
  });
}
