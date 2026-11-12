import { Component, input } from '@angular/core';

export type TagSeverity = 'primary' | 'secondary' | 'accent';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
})
export class Tag {
  public readonly severity = input<TagSeverity>('primary');
}
