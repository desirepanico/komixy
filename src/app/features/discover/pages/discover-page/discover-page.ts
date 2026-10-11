import { Component } from '@angular/core';
import { ComicCard } from '../../components/comic-card/comic-card';

@Component({
  selector: 'app-discover-page',
  imports: [ComicCard],
  templateUrl: './discover-page.html',
})
export class DiscoverPage {}
