import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { RankingLocked } from './ranking-locked';

describe('RankingLocked', () => {
  let fixture: ComponentFixture<RankingLocked>;
  let html: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RankingLocked],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(RankingLocked);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('spiega che la classifica si svela aprendo la busta', () => {
    expect(html.textContent).toContain('ranking.lockedTitle');
    expect(html.textContent).toContain('ranking.lockedText');
  });

  it('«Apri la busta» porta alla sua apertura', () => {
    const link = html.querySelector('a[href="/discover/pack"]');
    expect(link?.textContent).toContain('weeklyPack.open');
  });

  it("«Salta l'animazione» apre la busta senza lasciare la pagina", async () => {
    (html.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(TestBed.inject(WeeklyPackService).isOpened()).toBe(true);
  });
});
