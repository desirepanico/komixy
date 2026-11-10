import { Component, computed, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { translateSignal } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorOutline } from '@ng-icons/material-symbols/outline';

/** Mostra il primo errore con `common.validation.<kind>`, o `common.validation.generic` se manca. */
@Component({
  selector: 'app-field-wrapper',
  imports: [NgIcon],
  templateUrl: './field-wrapper.html',
  providers: [provideIcons({ matErrorOutline })],
  host: { class: 'flex flex-col gap-2' },
})
export class FieldWrapper {
  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly errors = input<readonly ValidationError[]>([]);

  private readonly firstError = computed(() => this.errors()[0]);
  protected readonly name = translateSignal(this.label);

  // Nel messaggio il nome sta a metà frase: iniziale minuscola («Il campo email è obbligatorio»)
  private readonly params = computed(() => {
    const name = this.name();
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
