import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

/** Rotte della feature library: la pagina della libreria. */
@Service()
export class LibraryNavigationService {
  private readonly _router = inject(Router);

  public readonly libraryLink: readonly string[] = ['/', AppRoutes.Library];

  public goToLibrary(): Promise<boolean> {
    return this._router.navigate(this.libraryLink);
  }
}
