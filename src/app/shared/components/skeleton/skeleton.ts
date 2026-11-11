import { Component } from '@angular/core';

/**
 * Segnaposto grigio che pulsa mentre il contenuto arriva (copertine, blocchi di una pagina).
 * Decorativo: nascosto ai lettori di schermo. Misure e raggio si danno con le classi Tailwind sul tag.
 *
 *   <app-skeleton class="h-6 w-56" />
 *   <app-skeleton class="absolute inset-0 rounded-lg" />
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
