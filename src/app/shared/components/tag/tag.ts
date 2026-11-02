import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TagSeverity = 'primary' | 'secondary';

/** Etichetta arrotondata (ex p-tag). Il testo si passa come contenuto: <app-tag>Testo</app-tag> */
@Component({
  selector: 'app-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-block rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold"
      [class.bg-primary-500]="severity() === 'primary'"
      [class.text-surface-900]="severity() === 'primary'"
      [class.bg-surface-700]="severity() === 'secondary'"
      [class.text-surface-100]="severity() === 'secondary'"
    >
      <ng-content />
    </span>
  `,
})
export class Tag {
  /** primary = viola (default), secondary = neutro */
  public severity = input<TagSeverity>('primary');
}
