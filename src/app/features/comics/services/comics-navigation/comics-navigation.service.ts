import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@shared/models/app-routes.model';

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
