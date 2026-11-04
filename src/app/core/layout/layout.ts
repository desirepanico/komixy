import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Swipe } from '@shared/directives/swipe/swipe.directive';
import { MobileSwipeService } from '@shared/services/mobile-swipe/mobile-swipe.service';
import { ViewportService } from '@shared/services/viewport/viewport.service';
import { DesktopSidebar } from './components/desktop-sidebar/desktop-sidebar';
import { MobileBottomNav } from './components/mobile-bottom-nav/mobile-bottom-nav';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, MobileBottomNav, DesktopSidebar, Swipe],
  templateUrl: './layout.html',
})
export class Layout {
  protected readonly viewport = inject(ViewportService);
  protected readonly swipeService = inject(MobileSwipeService);
}
