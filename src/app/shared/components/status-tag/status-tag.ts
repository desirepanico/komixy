import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
export type StatusTagSeverity =
  | 'success'
  | 'secondary'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast'
  | undefined
  | null;
@Component({
  selector: 'app-status-tag',
  imports: [TagModule],
  templateUrl: './status-tag.html',
})
export class StatusTag {
  public readonly value = input.required<string>();

  public readonly severity = input<StatusTagSeverity>(undefined);

  public readonly rounded = input<boolean>(true);
}
