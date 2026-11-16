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
  let fixture: ComponentFixture<unknown>;
  let harness: RouterTestingHarness | undefined;

  const bookmarks = () =>
    Array.from(html.querySelectorAll('app-comic-card button[aria-pressed]')) as HTMLButtonElement[];
  const rowTitles = () =>
    Array.from(html.querySelectorAll('app-discover-row h2')).map((h) => h.textContent?.trim());
  const tab = (n: number) =>
    html.querySelectorAll<HTMLButtonElement>(
      'app-discover-tabs [role="group"] button[aria-pressed]',
    )[n];

  const create = async (options: { isMember?: boolean; url?: string } = {}) => {
    TestBed.inject(SessionService).setAuthenticated(options.isMember ?? true);
    harness ??= await RouterTestingHarness.create();
    await harness.navigateByUrl(options.url ?? '/discover', DiscoverPage);
    fixture = harness.fixture;
    html = harness.routeNativeElement as HTMLElement;
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    harness = undefined;
    await TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'discover', component: DiscoverPage }])],
    }).compileComponents();
  });

  it('viene creata', async () => {
    await create();
    expect(html.querySelector('app-discover-tabs')).not.toBeNull();
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

  it('senza filtri mostra le righe: da dove iniziare, nuove uscite, manga da scoprire', async () => {
    await create();
    expect(rowTitles()).toEqual([
      'discover.rows.starter.title',
      'discover.rows.releases.title',
      'discoverManga.title',
    ]);
  });

  it('la scheda Manga è quella attiva di default', async () => {
    await create();
    expect(tab(0).getAttribute('aria-pressed')).toBe('true');
    expect(tab(1).getAttribute('aria-pressed')).toBe('false');
  });

  it("scegliere Fumetti mette la scheda nell'indirizzo senza aggiungere una voce alla cronologia", async () => {
    await create();
    tab(1).click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/discover?tab=comic');
    expect(tab(1).getAttribute('aria-pressed')).toBe('true');
  });

  it("apre la scheda e i filtri scritti nell'indirizzo", async () => {
    await create({ url: '/discover?tab=comic&cat=noir' });
    expect(tab(1).getAttribute('aria-pressed')).toBe('true');
    expect(html.querySelector('app-discover-active-chips')?.textContent).toContain(
      'discover.options.categories.noir',
    );
    expect(rowTitles()).toEqual(['discover.results.title']);
  });

  it('con una ricerca mostra i risultati in griglia e non le righe', async () => {
    await create({ url: '/discover?q=maus' });
    expect(html.querySelectorAll('app-comic-card')).toHaveLength(0);
    await create({ url: '/discover?tab=comic&q=maus' });
    expect(html.querySelectorAll('app-comic-card')).toHaveLength(1);
  });

  it('senza risultati propone di azzerare i filtri', async () => {
    await create({ url: '/discover?q=zzzz' });
    expect(html.textContent).toContain('discover.empty.title');
    const reset = Array.from(html.querySelectorAll<HTMLButtonElement>('button')).find((b) =>
      b.textContent?.includes('discover.empty.reset'),
    )!;
    reset.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/discover');
  });

  it("ignora i valori sconosciuti dell'indirizzo", async () => {
    await create({ url: '/discover?tab=boh&cat=boh&era=boh' });
    expect(rowTitles()).toHaveLength(3);
  });

  it('un isMember può mettere in lista più fumetti', async () => {
    await create();
    bookmarks()[0].click();
    bookmarks()[1].click();
    await fixture.whenStable();
    expect(bookmarks()[0].getAttribute('aria-pressed')).toBe('true');
    expect(bookmarks()[1].getAttribute('aria-pressed')).toBe('true');
    expect(TestBed.inject(BookmarksService).savedCount()).toBe(2);

    bookmarks()[0].click();
    await fixture.whenStable();
    expect(bookmarks()[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('un ospite ha il lucchetto su tutte le card e non salva nulla', async () => {
    await create({ isMember: false });
    expect(bookmarks()).toHaveLength(0);
    const locks = html.querySelectorAll('app-comic-card app-bookmark-button a[href="/login"]');
    expect(locks.length).toBe(html.querySelectorAll('app-comic-card').length);
  });

  it('con una ricerca la riga dei risultati dice per cosa si è cercato', async () => {
    await create({ url: '/discover?tab=comic&q=maus' });
    expect(html.querySelector('[role="status"]')?.textContent).toContain(
      'discover.results.forQuery',
    );
  });

  it('«Cancella» nella riga dei risultati toglie ricerca e filtri', async () => {
    await create({ url: '/discover?q=maus&cat=shonen' });
    const clear = Array.from(
      html.querySelectorAll<HTMLButtonElement>('[role="status"] button'),
    ).find((b) => b.textContent?.includes('discover.results.clear'))!;
    clear.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/discover');
  });
});
