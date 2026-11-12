import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

/** Logo con il nome «Komixy»; il nome sta in `common.brand` e l'`alt` lo usa. */
@Component({
  selector: 'app-brand',
  imports: [NgOptimizedImage, TranslocoPipe],
  templateUrl: './brand.html',
  host: { class: 'inline-flex items-center' },
})
export class Brand {}
