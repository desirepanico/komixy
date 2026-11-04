import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';

/** Navigazione della feature discover: percorsi e spostamenti che partono da Scopri. */
@Injectable({ providedIn: 'root' })
export class DiscoverNavigationService {
  private readonly router = inject(Router);

  public readonly discoverLink: readonly string[] = ['/', AppRoutes.Discover];
  public readonly rankingLink: readonly string[] = ['/', AppRoutes.Discover, AppRoutes.Ranking];

  public comicLink(id: string): readonly string[] {
    return ['/', AppRoutes.Comic, id];
  }

  public goToRanking(): Promise<boolean> {
    return this.router.navigate(this.rankingLink);
  }

  public goToComic(id: string): Promise<boolean> {
    return this.router.navigate(this.comicLink(id));
  }
}
