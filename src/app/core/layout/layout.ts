import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ViewportService } from '../services/viewport.service';
import { DesktopSidebar } from './components/desktop-sidebar/desktop-sidebar';
import { MobileBottomNav } from './components/mobile-bottom-nav/mobile-bottom-nav';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MobileBottomNav, DesktopSidebar],
  templateUrl: './layout.html',
})
export class Layout {
  protected readonly viewport = inject(ViewportService);
}
