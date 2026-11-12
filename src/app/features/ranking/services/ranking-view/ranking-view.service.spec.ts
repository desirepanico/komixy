import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { RANKING_VIEW_STORAGE_KEY } from '@shared/constants/ui.const';
import { RankingViewService } from './ranking-view.service';

describe('RankingViewService', () => {
  beforeEach(() => localStorage.clear());

  it("parte dall'elenco", () => {
    expect(TestBed.inject(RankingViewService).view()).toBe('list');
  });

  it("ricorda la vista scelta anche dopo aver riaperto l'app", () => {
    TestBed.inject(RankingViewService).setView('cards');
    expect(localStorage.getItem(RANKING_VIEW_STORAGE_KEY)).toBe('cards');

    TestBed.resetTestingModule();
    expect(TestBed.inject(RankingViewService).view()).toBe('cards');
  });

  it('ignora un valore salvato che non conosce', () => {
    localStorage.setItem(RANKING_VIEW_STORAGE_KEY, 'altro');
    expect(TestBed.inject(RankingViewService).view()).toBe('list');
  });
});
