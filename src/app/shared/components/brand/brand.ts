import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

/** Logo con il nome «Komixy». Il nome è un marchio: l'`alt` non si traduce. */
@Component({
  selector: 'app-brand',
  imports: [NgOptimizedImage],
  templateUrl: './brand.html',
  host: { class: 'inline-flex items-center' },
})
export class Brand {}
