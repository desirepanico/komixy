import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matPlayArrowOutline } from '@ng-icons/material-symbols/outline';
import { ButtonModule } from 'primeng/button';
import { MobileBottomNav } from './shared/components/mobile-bottom-nav/mobile-bottom-nav';
@Component({
  selector: 'app-root',
  imports: [ButtonModule, NgIcon, MobileBottomNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [provideIcons({ matPlayArrowOutline })],
})
export class App {
  protected readonly title = signal('komixy');
}
