import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';

/** Rotte della feature comics: l'elenco e la pagina di un fumetto. */
@Injectable({ providedIn: 'root' })
export class ComicsNavigationService {
  private readonly router = inject(Router);

  public readonly comicsLink: readonly string[] = ['/', AppRoutes.Comic];

  public detailLink(id: string): readonly string[] {
    return ['/', AppRoutes.Comic, id];
  }

  public goToDetail(id: string): Promise<boolean> {
    return this.router.navigate(this.detailLink(id));
  }
}
