import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobileBottomNav } from '../../shared/components/mobile-bottom-nav/mobile-bottom-nav';
import { ViewportService } from '../services/viewport.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MobileBottomNav],
  templateUrl: './layout.html',
})
export class Layout {
  protected readonly viewport = inject(ViewportService);
}
