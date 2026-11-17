import { afterRenderEffect, Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Fa ripartire l'animazione dell'elemento ogni volta che `appRestartAnimation` cambia (e alla prima comparsa),
 * senza ricrearlo: un `@for (x of [valore]; track x)` farebbe lo stesso ma Angular lo segnala (NG0956).
 * L'animazione si scrive sull'attributo che la direttiva imposta:
 *   <b [appRestartAnimation]="count()" class="data-restart:animate-bump">{{ count() }}</b>
 */
@Directive({ selector: '[appRestartAnimation]' })
export class RestartAnimation {
  public readonly appRestartAnimation = input.required<unknown>();

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    afterRenderEffect(() => {
      this.appRestartAnimation();
      element.removeAttribute('data-restart');
      // Leggere un valore di layout fa registrare al browser l'attributo tolto, così il nuovo riparte da capo
      void element.offsetWidth;
      element.setAttribute('data-restart', '');
    });
  }
}
