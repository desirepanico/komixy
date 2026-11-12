import { Component } from '@angular/core';

/**
 * Decorativo: misure e raggio si danno con classi Tailwind sul tag.
 *   <app-skeleton class="h-6 w-56" />
 */
@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.html',
  host: {
    class: 'block animate-pulse rounded-md bg-surface-800 motion-reduce:animate-none',
    'aria-hidden': 'true',
  },
})
export class Skeleton {}
