import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

/**
 * Testi già tradotti; l'icona va registrata con `provideIcons` dalla pagina che lo usa.
 *   <app-empty-state icon="matPersonOutline" [title]="..." [description]="..." />
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
