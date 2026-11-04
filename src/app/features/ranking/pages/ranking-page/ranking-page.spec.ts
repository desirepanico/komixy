import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { beforeEach, describe, expect, it } from 'vitest';
import { RankingPage } from './ranking-page';

describe('RankingPage', () => {
  let html: HTMLElement;
  let fixture: ReturnType<typeof TestBed.createComponent<RankingPage>>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { it: {} },
          translocoConfig: { availableLangs: ['it'], defaultLang: 'it' },
        }),
      ],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(RankingPage);
    html = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
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
