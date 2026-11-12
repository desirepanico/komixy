import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'button[appToggleButton]',
  host: {
    '[class]': 'classes()',
    '[attr.aria-pressed]': 'pressed()',
  },
  templateUrl: './toggle-button.html',
})
export class ToggleButton {
  public readonly pressed = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border text-primary-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-40';
    const state = this.pressed()
      ? 'border-primary-500 bg-primary-900'
      : 'border-surface-700 bg-surface-950/75';
    return `${base} ${state}`;
  });
}
