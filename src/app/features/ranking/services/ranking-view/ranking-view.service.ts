import { Injectable, signal } from '@angular/core';
import { RANKING_VIEW_STORAGE_KEY } from '@shared/constants/ui.const';
import { RankingView } from '../../models/ranking-view.model';

/** La vista scelta in «Rivedi la settimana», ricordata tra una visita e l'altra */
@Injectable({ providedIn: 'root' })
export class RankingViewService {
  private readonly _view = signal<RankingView>(this.read());

  public readonly view = this._view.asReadonly();

  public setView(view: RankingView): void {
    this._view.set(view);
    try {
      localStorage.setItem(RANKING_VIEW_STORAGE_KEY, view);
    } catch {
      // storage non disponibile: la scelta vale solo finché l'app è aperta
    }
  }

  private read(): RankingView {
    try {
      return localStorage.getItem(RANKING_VIEW_STORAGE_KEY) === 'cards' ? 'cards' : 'list';
    } catch {
      return 'list';
    }
  }
}
