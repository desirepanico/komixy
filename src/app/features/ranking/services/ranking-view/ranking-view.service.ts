import { computed, inject, Injectable, signal } from '@angular/core';
import { RANKING_VIEW_STORAGE_KEY } from '@shared/constants/ui.const';
import { PackSupportService } from '@shared/services/pack-support/pack-support.service';
import { SafeStorage } from '@shared/services/safe-storage/safe-storage.service';
import { RankingView } from '../../models/ranking-view.model';

/** Vista scelta per la classifica (elenco o carte), ricordata tra una visita e l'altra */
@Injectable({ providedIn: 'root' })
export class RankingViewService {
  private readonly storage = inject(SafeStorage);
  private readonly support = inject(PackSupportService);
  private readonly saved = signal<RankingView>(this.load());

  /** Senza 3D le carte non ci sono: si vede sempre l'elenco */
  public readonly canChoose = this.support.supports3d;
  public readonly view = computed<RankingView>(() => (this.canChoose ? this.saved() : 'list'));

  public set(view: RankingView): void {
    this.saved.set(view);
    this.storage.write(RANKING_VIEW_STORAGE_KEY, view);
  }

  private load(): RankingView {
    return this.storage.read(RANKING_VIEW_STORAGE_KEY) === 'cards' ? 'cards' : 'list';
  }
}
