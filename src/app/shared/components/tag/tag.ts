import { Component, input } from '@angular/core';

export type TagSeverity = 'primary' | 'secondary';

/** Etichetta arrotondata (ex p-tag). Il testo si passa come contenuto: <app-tag>Testo</app-tag> */
@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
})
export class Tag {
  /** primary = viola (default), secondary = neutro */
  public readonly severity = input<TagSeverity>('primary');
}
