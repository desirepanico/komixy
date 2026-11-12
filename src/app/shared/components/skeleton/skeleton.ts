import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.html',
  host: {
    class: 'block animate-pulse rounded-md bg-surface-800 motion-reduce:animate-none',
    'aria-hidden': 'true',
  },
})
export class Skeleton {}
