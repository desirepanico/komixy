import { Component, input } from '@angular/core';

export type TagSeverity = 'primary' | 'secondary' | 'accent';

/** Etichetta arrotondata (ex p-tag). Il testo si passa come contenuto: <app-tag>Testo</app-tag> */
@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
})
export class Tag {
  /** primary = viola pieno (default), secondary = neutro, accent = viola trasparente con anello, discreto sulle card viola (come il bottone accent) */
  public readonly severity = input<TagSeverity>('primary');
}
