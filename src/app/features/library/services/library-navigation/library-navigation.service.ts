import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

/** Rotte della feature library: la pagina della libreria. */
@Injectable({ providedIn: 'root' })
export class LibraryNavigationService {
  private readonly _router = inject(Router);

  public readonly libraryLink: readonly string[] = ['/', AppRoutes.Library];

  public goToLibrary(): Promise<boolean> {
    return this._router.navigate(this.libraryLink);
  }
}
