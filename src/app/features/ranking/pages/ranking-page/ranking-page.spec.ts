import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { RankingPage } from './ranking-page';

describe('RankingPage', () => {
  let html: HTMLElement;
  let fixture: ComponentFixture<RankingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingPage],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(RankingPage);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra il titolo e tutta la classifica in ordine', () => {
    expect(html.querySelector('h1')?.textContent).toContain('weeklyManga.title');
    const righe = Array.from(html.querySelectorAll('app-comic-rank-card'));
    expect(righe).toHaveLength(10);
    expect(righe[0].textContent).toContain('1');
  });

  it('ha un pulsante per tornare a Scopri', () => {
    const indietro = html.querySelector('a[href="/discover"]');
    expect(indietro?.getAttribute('aria-label')).toBe('common.back');
  });

  it('seleziona e deseleziona il segnalibro di una riga', async () => {
    const primo = () => html.querySelector('button[aria-pressed]') as HTMLButtonElement;
    primo().click();
    await fixture.whenStable();
    expect(primo().getAttribute('aria-pressed')).toBe('true');

    primo().click();
    await fixture.whenStable();
    expect(primo().getAttribute('aria-pressed')).toBe('false');
  });
});
