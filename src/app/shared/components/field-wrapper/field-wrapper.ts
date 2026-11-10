import { Component, computed, inject, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
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
  private readonly transloco = inject(TranslocoService);

  public readonly label = input.required<string>();
  public readonly inputId = input.required<string>();
  public readonly errors = input<readonly ValidationError[]>([]);

  // Nel messaggio il nome sta a metà frase: iniziale minuscola («Il campo email è obbligatorio»)
  private readonly field = computed(() => {
    const name = this.transloco.translate(this.label());
    return name.charAt(0).toLowerCase() + name.slice(1);
  });

  protected readonly error = computed(() => {
    const [error] = this.errors();
    if (!error) return '';
    const field = this.field();
    const known = this.transloco.translate(`common.validation.${error.kind}`, { ...error, field });
    return known.startsWith('common.validation.')
      ? this.transloco.translate('common.validation.generic', { field })
      : known;
  });
}
