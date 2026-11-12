import { Injectable, signal } from '@angular/core';
import { RankingView } from '../../models/ranking-view.model';

/**
 * La vista scelta in «Rivedi la settimana». Sta in memoria: si ricorda uscendo e rientrando nella
 * classifica, ma non dopo aver ricaricato l'app, che riparte dall'elenco.
 */
@Injectable({ providedIn: 'root' })
export class RankingViewService {
  private readonly _view = signal<RankingView>('list');

  public readonly view = this._view.asReadonly();

  public setView(view: RankingView): void {
    this._view.set(view);
  }
}
