import { Injectable, computed, inject, signal } from '@angular/core';
import { WEEKLY_PACK_STORAGE_KEY, WEEKLY_PACK_TIME_ZONE } from '../../constants/pack.const';
import { RankingEntry } from '../../models/ranking-entry.model';
import { WeeklyRankingService } from '../weekly-ranking/weekly-ranking.service';
import { daysUntilNextWeek, dateInZone, isoWeek } from './iso-week/iso-week';

interface OpenedPack {
  week: string;
  openedAt: string;
}

/**
 * La busta della settimana: 10 carte, i volumi più letti, che si aprono una volta a settimana.
 * Le carte sono la classifica della settimana, non c'è casualità.
 */
@Injectable({ providedIn: 'root' })
export class WeeklyPackService {
  private readonly ranking = inject(WeeklyRankingService);

  private readonly today = dateInZone(new Date(), WEEKLY_PACK_TIME_ZONE);
  private readonly current = isoWeek(this.today);
  private readonly weekKey = `${this.current.year}-W${this.current.week}`;

  // TODO(api): l'apertura la registra il server, una per utente (user_id) o per ospite (guest_id)
  private readonly opened = signal<OpenedPack | null>(this.read());

  /** Numero della settimana ISO, mostrato come «Settimana 46» */
  public readonly weekNumber: number = this.current.week;
  public readonly daysUntilNextPack: number = daysUntilNextWeek(this.today);

  public readonly isOpened = computed(() => this.opened()?.week === this.weekKey);
  public readonly openedAt = computed(() => {
    const opened = this.opened();
    return opened?.week === this.weekKey ? new Date(opened.openedAt) : null;
  });

  /** Le carte dalla 10ª alla 1ª: nell'ordine in cui si girano */
  public readonly deck = computed<RankingEntry[]>(() => [...this.ranking.entries()].reverse());
  /** Una carta è rara se è un'edizione speciale (variant, deluxe, limited) */
  public readonly rareCount = computed(
    () => this.ranking.entries().filter((entry) => entry.comic.editionType !== null).length,
  );

  /** Registra l'apertura. Si può richiamare: la prima volta conta, le altre non cambiano nulla. */
  public open(): void {
    if (this.isOpened()) return;
    const opened: OpenedPack = { week: this.weekKey, openedAt: new Date().toISOString() };
    this.opened.set(opened);
    this.write(opened);
  }

  /** Giorno dell'apertura, es. «Lun 10 nov» */
  public openedOnLabel(lang: string): string | null {
    const openedAt = this.openedAt();
    if (!openedAt) return null;
    const label = new Intl.DateTimeFormat(lang, {
      timeZone: WEEKLY_PACK_TIME_ZONE,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
      .format(openedAt)
      .replace(/\./g, '');
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  private read(): OpenedPack | null {
    try {
      const raw = localStorage.getItem(WEEKLY_PACK_STORAGE_KEY);
      const value: unknown = raw ? JSON.parse(raw) : null;
      if (value && typeof value === 'object' && 'week' in value && 'openedAt' in value) {
        return value as OpenedPack;
      }
    } catch {
      // Storage non disponibile o contenuto rovinato: la busta risulta da aprire
    }
    return null;
  }

  private write(opened: OpenedPack): void {
    try {
      localStorage.setItem(WEEKLY_PACK_STORAGE_KEY, JSON.stringify(opened));
    } catch {
      // Storage non disponibile (es. navigazione privata): l'apertura vale solo finché l'app è aperta
    }
  }
}
