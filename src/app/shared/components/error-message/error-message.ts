import { Component, computed, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { translateSignal } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorOutline } from '@ng-icons/material-symbols/outline';

/** Mostra il primo errore con `common.validation.<kind>`, o `common.validation.generic` se manca. */
@Component({
  selector: 'app-error-message',
  imports: [NgIcon],
  templateUrl: './error-message.html',
  providers: [provideIcons({ matErrorOutline })],
  host: {
    role: 'alert',
    class:
      'flex items-start gap-1.5 text-sm text-red-400 max-sm:-mt-1 max-sm:gap-1 max-sm:text-xs max-sm:leading-snug',
  },
})
export class ErrorMessage {
  public readonly errors = input<readonly ValidationError[]>([]);
  public readonly field = input<string>('');

  private readonly firstError = computed(() => this.errors()[0]);
  private readonly params = computed(() => ({ ...this.firstError(), field: this.field() }));
  private readonly known = translateSignal(
    computed(() => `common.validation.${this.firstError()?.kind}`),
    this.params,
  );
  private readonly generic = translateSignal('common.validation.generic', this.params);

  protected readonly message = computed(() => {
    if (!this.firstError()) return '';
    const known = this.known();
    return known.startsWith('common.validation.') ? this.generic() : known;
  });
}
