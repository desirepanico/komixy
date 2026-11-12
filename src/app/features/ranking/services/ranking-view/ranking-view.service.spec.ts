import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { RankingViewService } from './ranking-view.service';

describe('RankingViewService', () => {
  it("parte dall'elenco", () => {
    expect(TestBed.inject(RankingViewService).view()).toBe('list');
  });

  it("ricorda la vista scelta finché l'app è aperta", () => {
    TestBed.inject(RankingViewService).setView('cards');
    expect(TestBed.inject(RankingViewService).view()).toBe('cards');
  });

  it("riparte dall'elenco in una nuova sessione dell'app", () => {
    TestBed.inject(RankingViewService).setView('cards');
    TestBed.resetTestingModule();
    expect(TestBed.inject(RankingViewService).view()).toBe('list');
  });
});
