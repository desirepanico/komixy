import { Injectable, signal } from '@angular/core';
import { RankingView } from '../../models/ranking-view.model';

/**
 * L'ultima vista scelta in «Rivedi la settimana». Sta in memoria: serve quando l'indirizzo non ha `?view=`
 * (es. si rientra dal link «Rivedi la settimana»); ricaricando l'app riparte dall'elenco.
 */
@Injectable({ providedIn: 'root' })
export class RankingViewService {
  private readonly _view = signal<RankingView>('list');

  public readonly view = this._view.asReadonly();

  public setView(view: RankingView): void {
    this._view.set(view);
  }
}
