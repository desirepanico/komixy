import { Injectable, signal } from '@angular/core';
import { RankingView } from '../../models/ranking-view.model';

/** Ultima vista scelta, in memoria: vale quando l'indirizzo non ha `?view=`. */
@Injectable({ providedIn: 'root' })
export class RankingViewService {
  private readonly _view = signal<RankingView>('list');

  public readonly view = this._view.asReadonly();

  public setView(view: RankingView): void {
    this._view.set(view);
  }
}
