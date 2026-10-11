import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBookmarkOutline } from '@ng-icons/material-symbols/outline';

@Component({
  selector: 'app-comic-card',
  imports: [NgIcon],
  templateUrl: './comic-card.html',
  styleUrl: './comic-card.css',
  providers: [
    provideIcons({
      matBookmarkOutline,
    }),
  ],
})
export class ComicCard {}
