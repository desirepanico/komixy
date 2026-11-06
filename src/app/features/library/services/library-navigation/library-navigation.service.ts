import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/constants/navigation.const';

/** Rotte della feature library: la pagina della libreria. */
@Injectable({ providedIn: 'root' })
export class LibraryNavigationService {
  private readonly router = inject(Router);

  public readonly libraryLink: readonly string[] = ['/', AppRoutes.Library];

  public goToLibrary(): Promise<boolean> {
    return this.router.navigate(this.libraryLink);
  }
}
