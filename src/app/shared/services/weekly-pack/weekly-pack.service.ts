import { computed, inject, Injectable, signal } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { FAKE_API_DELAY_MS } from '../../constants/form.const';
import { WEEKLY_PACK_STORAGE_KEY } from '../../constants/ui.const';
import { PackStatus } from '../../models/pack.model';
import { RankingEntry } from '../../models/ranking-entry.model';
import { SafeStorage } from '../safe-storage/safe-storage.service';
import { SessionService } from '../session/session.service';
import { WeeklyRankingService } from '../weekly-ranking/weekly-ranking.service';
import { daysUntilNextWeek, isoWeek } from './iso-week/iso-week';

/** La busta della settimana contiene la classifica: si apre una sola volta a settimana per utente (e per ospite) */
@Injectable({ providedIn: 'root' })
export class WeeklyPackService {
  private readonly storage = inject(SafeStorage);
  private readonly session = inject(SessionService);
  private readonly ranking = inject(WeeklyRankingService);
  private readonly today = new Date();
  private readonly week = isoWeek(this.today);
  private readonly openedKeys = signal<readonly string[]>(this.load());
  private readonly key = computed(
    () => `${this.session.user()?.id ?? 'anonymous'}:${this.week.year}-${this.week.week}`,
  );

  public readonly weekNumber = this.week.week;
  public readonly daysToNextPack = daysUntilNextWeek(this.today);
  public readonly status = computed<PackStatus>(() =>
    this.openedKeys().includes(this.key()) ? 'opened' : 'sealed',
  );
  public readonly entries = this.ranking.entries;

  // TODO: sostituire con POST /weekly-pack/open: atomico e idempotente, un'apertura per (utente o ospite, settimana)
  public open(): Observable<readonly RankingEntry[]> {
    return of(this.ranking.entries()).pipe(
      delay(FAKE_API_DELAY_MS),
      tap(() => this.markOpened()),
    );
  }

  private markOpened(): void {
    if (this.openedKeys().includes(this.key())) return;
    const keys = [...this.openedKeys(), this.key()];
    this.openedKeys.set(keys);
    this.storage.write(WEEKLY_PACK_STORAGE_KEY, JSON.stringify(keys));
  }

  private load(): readonly string[] {
    try {
      const saved: unknown = JSON.parse(this.storage.read(WEEKLY_PACK_STORAGE_KEY) ?? '[]');
      return Array.isArray(saved) ? saved.filter((k): k is string => typeof k === 'string') : [];
    } catch {
      return [];
    }
  }
}
