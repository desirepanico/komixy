import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';

/** Navigazione della feature ranking: percorsi e spostamenti che partono dalla classifica. */
@Injectable({ providedIn: 'root' })
export class RankingNavigationService {
  private readonly router = inject(Router);

  public readonly rankingLink: readonly string[] = ['/', AppRoutes.Discover, AppRoutes.Ranking];
  public readonly discoverLink: readonly string[] = ['/', AppRoutes.Discover];

  public comicLink(id: string): readonly string[] {
    return ['/', AppRoutes.Comic, id];
  }

  public goToDiscover(): Promise<boolean> {
    return this.router.navigate(this.discoverLink);
  }

  public goToComic(id: string): Promise<boolean> {
    return this.router.navigate(this.comicLink(id));
  }
}
