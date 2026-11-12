import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { AppRoutes } from '@shared/models/app-routes.model';

/** Rotte della feature comics: l'elenco e la pagina di un fumetto. */
@Injectable({ providedIn: 'root' })
export class ComicsNavigationService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly discoverNavigation = inject(DiscoverNavigationService);

  public readonly comicsLink: readonly string[] = ['/', AppRoutes.Comic];

  public detailLink(id: string): readonly string[] {
    return ['/', AppRoutes.Comic, id];
  }

  public goToDetail(id: string): Promise<boolean> {
    return this.router.navigate(this.detailLink(id));
  }

  /**
   * Torna alla pagina da cui si è arrivati (Scopri, la classifica con la sua vista, la busta...).
   * Se il dettaglio è la prima pagina aperta, per esempio da un link condiviso, non c'è una pagina
   * dell'app a cui tornare e si va a Scopri. Il router numera le navigazioni in `navigationId`: dal
   * secondo in poi c'è una pagina precedente.
   */
  public goBack(): void {
    const state = this.location.getState() as { navigationId?: number } | null;
    if ((state?.navigationId ?? 0) > 1) {
      this.location.back();
    } else {
      void this.discoverNavigation.goToDiscover();
    }
  }
}
