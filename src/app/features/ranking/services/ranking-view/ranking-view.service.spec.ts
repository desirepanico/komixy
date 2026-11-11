import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RANKING_VIEW_STORAGE_KEY } from '@shared/constants/ui.const';
import { PackSupportService } from '@shared/services/pack-support/pack-support.service';
import { RankingViewService } from './ranking-view.service';

const con3d = (supportato: boolean) =>
  TestBed.overrideProvider(PackSupportService, { useValue: { supports3d: supportato } });

describe('RankingViewService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("senza preferenze parte dall'elenco", () => {
    con3d(true);
    expect(TestBed.inject(RankingViewService).view()).toBe('list');
  });

  it('ricorda la vista scelta anche con un nuovo servizio', () => {
    con3d(true);
    TestBed.inject(RankingViewService).set('cards');
    expect(localStorage.getItem(RANKING_VIEW_STORAGE_KEY)).toBe('cards');

    TestBed.resetTestingModule();
    con3d(true);
    expect(TestBed.inject(RankingViewService).view()).toBe('cards');
  });

  it('un valore salvato sconosciuto vale elenco', () => {
    con3d(true);
    localStorage.setItem(RANKING_VIEW_STORAGE_KEY, 'altro');
    expect(TestBed.inject(RankingViewService).view()).toBe('list');
  });

  it('senza 3D si vede sempre l’elenco e non si può scegliere', () => {
    con3d(false);
    const servizio = TestBed.inject(RankingViewService);
    servizio.set('cards');
    expect(servizio.canChoose).toBe(false);
    expect(servizio.view()).toBe('list');
  });

  it('con 3D si può scegliere e cambiare vista', () => {
    con3d(true);
    const servizio = TestBed.inject(RankingViewService);
    expect(servizio.canChoose).toBe(true);
    servizio.set('cards');
    expect(servizio.view()).toBe('cards');
    servizio.set('list');
    expect(servizio.view()).toBe('list');
  });
=======
import { beforeEach, describe, expect, it } from 'vitest';
import { RANKING_VIEW_STORAGE_KEY } from '@shared/constants/ui.const';
import { RankingViewService } from './ranking-view.service';

describe('RankingViewService', () => {
  beforeEach(() => localStorage.clear());

  it("parte dall'elenco", () => {
    expect(TestBed.inject(RankingViewService).view()).toBe('list');
  });

  it('ricorda la vista scelta anche dopo aver riaperto l\'app', () => {
    TestBed.inject(RankingViewService).setView('cards');
    expect(localStorage.getItem(RANKING_VIEW_STORAGE_KEY)).toBe('cards');

    TestBed.resetTestingModule();
    expect(TestBed.inject(RankingViewService).view()).toBe('cards');
  });

  it('ignora un valore salvato che non conosce', () => {
    localStorage.setItem(RANKING_VIEW_STORAGE_KEY, 'altro');
    expect(TestBed.inject(RankingViewService).view()).toBe('list');
  });
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
});
