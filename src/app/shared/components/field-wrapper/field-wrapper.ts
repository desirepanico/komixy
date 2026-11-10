import { Component, computed, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { TranslocoPipe, translateSignal } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorOutline } from '@ng-icons/material-symbols/outline';

/**
 * `errors` vuoto = nessun messaggio; altrimenti scrive il primo con `common.validation.<kind>` e il nome
 * del campo, o `common.validation.generic` se quel tipo non ha un testo. `inputId` collega etichetta e `aria-describedby`.
 */
@Component({
  selector: 'app-field-wrapper',
  imports: [TranslocoPipe, NgIcon],
  templateUrl: './field-wrapper.html',
  providers: [provideIcons({ matErrorOutline })],
  host: { class: 'flex flex-col gap-2' },
})
export class FieldWrapper {
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly errors = input<readonly ValidationError[]>([]);

  private readonly firstError = computed(() => this.errors()[0]);
  private readonly labelText = translateSignal(this.label);

  // Nel messaggio il nome sta a metà frase: iniziale minuscola («Il campo email è obbligatorio»)
  private readonly params = computed(() => {
    const name = this.labelText();
    return { ...this.firstError(), field: name.charAt(0).toLowerCase() + name.slice(1) };
  });
  private readonly known = translateSignal(
    computed(() => `common.validation.${this.firstError()?.kind}`),
    this.params,
  );
  private readonly generic = translateSignal('common.validation.generic', this.params);

  protected readonly error = computed(() => {
    if (!this.firstError()) return '';
    const known = this.known();
    return known.startsWith('common.validation.') ? this.generic() : known;
  });
}
