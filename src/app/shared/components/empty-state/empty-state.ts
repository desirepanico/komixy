import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

/**
 * Segnaposto centrato con icona, titolo e frase (pagine non ancora pronte, liste vuote).
 * Testi già tradotti; l'icona va registrata con `provideIcons` dalla pagina che lo usa.
 *
 *   <app-empty-state icon="matPersonOutline" [title]="'profile.comingSoon' | transloco"
 *     [description]="'profile.comingSoonHint' | transloco" />
 */
@Component({
  selector: 'app-empty-state',
  imports: [NgIcon],
  templateUrl: './empty-state.html',
})
export class EmptyState {
  public readonly icon = input.required<string>();
  public readonly title = input.required<string>();
  public readonly description = input.required<string>();
}
