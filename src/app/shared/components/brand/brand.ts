import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-brand',
  imports: [NgOptimizedImage, TranslocoPipe],
  templateUrl: './brand.html',
  host: { class: 'inline-flex items-center' },
})
export class Brand {}
