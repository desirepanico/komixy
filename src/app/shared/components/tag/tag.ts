import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TagSeverity = 'primary' | 'secondary';

/** Etichetta arrotondata (ex p-tag). Il testo si passa come contenuto: <app-tag>Testo</app-tag> */
@Component({
  selector: 'app-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tag.html',
})
export class Tag {
  /** primary = viola (default), secondary = neutro */
  public severity = input<TagSeverity>('primary');
}
