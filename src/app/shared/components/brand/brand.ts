import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

/** Logo con il nome "Komixy" (la X in viola, come nel logo). Il nome è un marchio: non si traduce. */
@Component({
  selector: 'app-brand',
  imports: [NgOptimizedImage],
  templateUrl: './brand.html',
  host: { class: 'inline-flex items-center gap-3' },
})
export class Brand {}
