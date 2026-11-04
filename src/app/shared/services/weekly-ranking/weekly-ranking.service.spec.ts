import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { WeeklyRankingService } from './weekly-ranking.service';

describe('WeeklyRankingService', () => {
  const entries = () => TestBed.inject(WeeklyRankingService).entries();

  it('numera le posizioni partendo da 1 senza buchi', () => {
    expect(entries().map((e) => e.rank)).toEqual(entries().map((_, i) => i + 1));
  });

  it('non ha fumetti duplicati in classifica', () => {
    const ids = entries().map((e) => e.comic.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
