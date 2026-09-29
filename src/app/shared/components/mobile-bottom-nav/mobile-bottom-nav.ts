import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matBarcodeScannerOutline } from '@ng-icons/material-symbols/outline';

@Component({
  selector: 'app-mobile-bottom-nav',
  imports: [NgIcon],
  templateUrl: './mobile-bottom-nav.html',
  providers: [provideIcons({ matBarcodeScannerOutline })],
})
export class MobileBottomNav {}
