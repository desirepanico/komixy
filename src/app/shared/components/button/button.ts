import { Component, computed, input } from '@angular/core';
import { BUTTON_COLORS } from '../../constants/ui.const';
import { ButtonSeverity, ButtonVariant } from '../../models/button.model';

/** Si applica a elementi nativi (`<button appButton>`, `<a appButton routerLink>`): così funzionano `routerLink`, `click` e `disabled`. */
@Component({
  selector: 'button[appButton], a[appButton]',
  host: { '[class]': 'classes()' },
  templateUrl: './button.html',
})
export class Button {
  /** text = senza sfondo: spaziature e testo li decide chi lo usa (tranne iconOnly) */
  public readonly variant = input<ButtonVariant>('filled');
  public readonly severity = input<ButtonSeverity>('primary');
  /** Solo icona: serve `aria-label` */
  public readonly iconOnly = input<boolean>(false);
  public readonly rounded = input<boolean>(false);
  /** Aspetto da link: sottolineato alla selezione (mouse, tastiera, tocco). Va su `<a href>` o `<a routerLink>` (anche `target="_blank"`), non su un `<button>` */
  public readonly underline = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-40';
    const variant = this.variant();
    const colors = BUTTON_COLORS[this.severity()][variant];
    const radius = this.rounded() ? 'rounded-full' : 'rounded-sm';
    const decoration = this.underline()
      ? 'underline-offset-4 hover:underline focus-visible:underline active:underline'
      : '';
    // il bottone text lascia a chi lo usa allineamento, spaziature e testo
    if (variant === 'text' && !this.iconOnly()) {
      return `${base} ${colors} ${radius} ${decoration}`;
    }
    const size = this.iconOnly() ? 'size-10' : 'h-11 px-4 text-base';
    return `${base} justify-center gap-2 font-semibold ${colors} ${size} ${radius} ${decoration}`;
  });
}
