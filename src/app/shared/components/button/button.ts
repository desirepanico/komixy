import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ButtonVariant = 'filled' | 'outlined';

/**
 * Bottone (ex p-button). Si applica a elementi nativi, così funzionano `routerLink`, `click` e `disabled`:
 *   <button appButton (click)="...">Testo</button>
 *   <a appButton routerLink="/x">Testo</a>
 *   <button appButton variant="outlined" [iconOnly]="true" aria-label="..."><ng-icon .../></button>
 */
@Component({
  selector: 'button[appButton], a[appButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  templateUrl: './button.html',
})
export class Button {
  /** filled = pieno viola (default), outlined = solo bordo */
  public variant = input<ButtonVariant>('filled');
  /** true = bottone tondo di sola icona (serve aria-label) */
  public iconOnly = input<boolean>(false);

  protected classes = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 cursor-pointer rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-40';
    const variant =
      this.variant() === 'filled'
        ? 'bg-primary-500 text-surface-900 hover:bg-primary-300 active:bg-primary-200'
        : 'border border-primary-400 text-primary-300 hover:bg-primary-400/10';
    const size = this.iconOnly() ? 'size-10' : 'px-5 py-2.5 text-sm';
    return `${base} ${variant} ${size}`;
  });
}
