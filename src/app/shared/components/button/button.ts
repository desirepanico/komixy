import { Component, computed, input } from '@angular/core';
import { BUTTON_COLORS } from '../../constants/ui.const';
import { ButtonSeverity, ButtonVariant } from '../../models/button.model';

@Component({
  selector: 'button[appButton], a[appButton]',
  host: { '[class]': 'classes()' },
  templateUrl: './button.html',
})
export class Button {
  public readonly variant = input<ButtonVariant>('filled');
  public readonly severity = input<ButtonSeverity>('primary');
  public readonly iconOnly = input<boolean>(false);
  public readonly rounded = input<boolean>(false);
  public readonly underline = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center gap-2 cursor-pointer text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-40';
    const variant = this.variant();
    const colors = BUTTON_COLORS[this.severity()][variant];
    const radius = this.rounded() ? 'rounded-full' : 'rounded-sm';
    const decoration = this.underline()
      ? 'decoration-current underline-offset-4 hover:underline focus-visible:underline active:underline'
      : '';
    if (this.iconOnly()) {
      return `${base} justify-center size-11 ${colors} ${radius} ${decoration}`;
    }
    // Il link nel testo (variant text e underline) segue la riga: niente altezza fissa
    if (variant === 'text' && this.underline()) {
      return `${base} px-1 ${colors} ${radius} ${decoration}`;
    }
    // Il testo non ha sfondo né bordo, quindi un padding più stretto lo tiene vicino a ciò che lo circonda
    const box = variant === 'text' ? 'h-11 px-3' : 'justify-center h-11 px-4';
    return `${base} ${box} ${colors} ${radius} ${decoration}`;
  });
}
