import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matTuneOutline } from '@ng-icons/material-symbols/outline';

/** Il pulsante «Filtri»: apre il pannello e mostra quanti gruppi sono attivi. Con `compact` resta la sola icona. */
@Component({
  selector: 'app-discover-filters-button',
  imports: [NgIcon, TranslocoPipe],
  providers: [provideIcons({ matTuneOutline })],
  templateUrl: './discover-filters-button.html',
  host: { class: 'shrink-0' },
})
export class DiscoverFiltersButton {
  public readonly count = input.required<number>();
  public readonly compact = input<boolean>(false);
  public readonly expanded = input<boolean>(false);
  public readonly pressed = output<void>();
}
