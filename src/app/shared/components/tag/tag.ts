import { Component, input } from '@angular/core';

export type TagSeverity = 'primary' | 'secondary' | 'accent';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
})
export class Tag {
  /** accent = viola trasparente con anello, discreto sulle card viola */
  public readonly severity = input<TagSeverity>('primary');
}
