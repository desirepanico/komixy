import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matPlayArrowOutline } from '@ng-icons/material-symbols/outline';
@Component({
  selector: 'app-root',
  imports: [ButtonModule, NgIcon],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [provideIcons({ matPlayArrowOutline })],
})
export class App {
  protected readonly title = signal('komixy');
}
