import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { DiscoverPage } from './discover-page';

describe('DiscoverPage', () => {
  let html: HTMLElement;
  let fixture: ComponentFixture<DiscoverPage>;

  const bookmarks = () =>
    Array.from(html.querySelectorAll('app-comic-card button[aria-pressed]')) as HTMLButtonElement[];

  const create = async (isMember = true, url = '/discover') => {
    TestBed.inject(SessionService).setAuthenticated(isMember);
    const harness = await RouterTestingHarness.create(url);
    fixture = harness.fixture as unknown as ComponentFixture<DiscoverPage>;
    html = fixture.nativeElement;
    await fixture.whenStable();
  };
  const cards = () => html.querySelectorAll('app-comic-card');

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DiscoverPage],
      providers: [provideRouter([{ path: 'discover', component: DiscoverPage }])],
    }).compileComponents();
  });

  it('viene creata', async () => {
    await create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('al posto della classifica mostra la busta della settimana', async () => {
    await create();
    expect(html.querySelector('app-weekly-pack-banner')).not.toBeNull();
    expect(html.querySelector('app-comic-rank-card')).toBeNull();
    expect(html.querySelector('a[href="/discover/pack"]')).not.toBeNull();
  });

  it('a busta chiusa non mostra il pannello con la top della settimana', async () => {
    await create();
    expect(html.querySelector('app-weekly-top')).toBeNull();
  });

  it('a busta aperta mostra il pannello con la top della settimana', async () => {
    TestBed.inject(WeeklyPackService).open();
    await create();
    expect(html.querySelector('app-weekly-top')).not.toBeNull();
  });

  it('a busta aperta resta un solo pulsante, «Rivedi la settimana»', async () => {
    TestBed.inject(WeeklyPackService).open();
    await create();
    expect(html.querySelector('a[href="/discover/pack"]')).toBeNull();
    expect(html.querySelector('app-weekly-pack-banner a[href="/discover/ranking"]')).not.toBeNull();
  });

  it('mostra i manga da scoprire in una lista orizzontale', async () => {
    await create();
    const list = html.querySelector('app-horizontal-scroller');
    expect(list?.querySelectorAll('app-comic-card')).toHaveLength(14);
  });

  it('un isMember può mettere in lista più fumetti', async () => {
    await create();
    bookmarks()[0].click();
    bookmarks()[1].click();
    await fixture.whenStable();
    expect(
      bookmarks()
        .map((b) => b.getAttribute('aria-pressed'))
        .slice(0, 4),
    ).toEqual(['true', 'true', 'false', 'false']);
    expect(TestBed.inject(BookmarksService).savedCount()).toBe(2);

    bookmarks()[0].click();
    await fixture.whenStable();
    expect(bookmarks()[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('un ospite ha il lucchetto su tutte le card e non salva nulla', async () => {
    await create(false);
    expect(bookmarks()).toHaveLength(0);
    const locks = html.querySelectorAll('app-comic-card app-bookmark-button a[href="/login"]');
    expect(locks).toHaveLength(14);
  });

  describe('filtri', () => {
    const url = () => TestBed.inject(Router).url;

    it('senza filtri mostra la fila che scorre e nessun chip', async () => {
      await create();
      expect(html.querySelector('app-horizontal-scroller')).not.toBeNull();
      expect(html.querySelector('app-discover-chips ul')).toBeNull();
    });

    it('con un filtro nell’indirizzo mostra la griglia, il chip e il conteggio', async () => {
      await create(true, '/discover?type=manga&category=seinen');
      expect(html.querySelector('app-horizontal-scroller')).toBeNull();
      expect(html.querySelectorAll('app-discover-chips button')).toHaveLength(1);
      expect(cards().length).toBeGreaterThan(0);
      expect(cards().length).toBeLessThan(14);
    });

    it('la sezione Fumetti mostra solo i fumetti', async () => {
      await create(true, '/discover?type=comic');
      expect(cards()).toHaveLength(11);
    });

    it('scegliere Fumetti lo scrive nell’indirizzo', async () => {
      await create();
      html.querySelector<HTMLButtonElement>('#discover-tab-comic')!.click();
      await fixture.whenStable();
      expect(url()).toBe('/discover?type=comic');
    });

    it('togliere un chip toglie il filtro dall’indirizzo', async () => {
      await create(true, '/discover?type=manga&status=completed');
      html.querySelector<HTMLButtonElement>('app-discover-chips button')!.click();
      await fixture.whenStable();
      expect(url()).toBe('/discover?type=manga');
    });

    it('se non resta nulla propone quale filtro togliere', async () => {
      await create(true, '/discover?type=manga&q=zzzzz&status=completed');
      expect(cards()).toHaveLength(0);
      const buttons = Array.from(
        html.querySelectorAll<HTMLButtonElement>('#discover-results button'),
      );
      expect(buttons).toHaveLength(2);
      buttons[1].click();
      await fixture.whenStable();
      expect(url()).toBe('/discover?type=manga');
    });

    it('un valore sconosciuto nell’indirizzo viene ignorato', async () => {
      await create(true, '/discover?type=manga&category=noir');
      expect(html.querySelector('app-horizontal-scroller')).not.toBeNull();
    });
  });
});
