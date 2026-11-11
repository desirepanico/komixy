import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { DiscoverPage } from './discover-page';

describe('DiscoverPage', () => {
  let html: HTMLElement;
  let fixture: ComponentFixture<DiscoverPage>;

  const segnalibri = () =>
    Array.from(
      html.querySelectorAll('app-comic-card button[aria-pressed]'),
    ) as HTMLButtonElement[];

  const crea = async (iscritto = true) => {
    TestBed.inject(SessionService).setAuthenticated(iscritto);
    fixture = TestBed.createComponent(DiscoverPage);
    html = fixture.nativeElement;
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DiscoverPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('viene creata', async () => {
    await crea();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('al posto della classifica mostra la busta della settimana', async () => {
    await crea();
    expect(html.querySelector('app-weekly-pack-banner')).not.toBeNull();
    expect(html.querySelector('app-comic-rank-card')).toBeNull();
    expect(html.querySelector('a[href="/discover/pack"]')).not.toBeNull();
  });

  it('a busta aperta resta un solo pulsante, «Rivedi la settimana»', async () => {
    TestBed.inject(WeeklyPackService).open();
    await crea();
    expect(html.querySelector('a[href="/discover/pack"]')).toBeNull();
    expect(html.querySelector('app-weekly-pack-banner a[href="/discover/ranking"]')).not.toBeNull();
  });

  it('mostra i manga da scoprire in una lista orizzontale', async () => {
    await crea();
    const lista = html.querySelector('app-horizontal-scroller');
    expect(lista?.querySelectorAll('app-comic-card')).toHaveLength(4);
  });

  it('un iscritto può mettere in lista più fumetti', async () => {
    await crea();
    segnalibri()[0].click();
    segnalibri()[1].click();
    await fixture.whenStable();
    expect(segnalibri().map((b) => b.getAttribute('aria-pressed'))).toEqual([
      'true',
      'true',
      'false',
      'false',
    ]);
    expect(TestBed.inject(BookmarksService).savedCount()).toBe(2);

    segnalibri()[0].click();
    await fixture.whenStable();
    expect(segnalibri()[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('un ospite ha il lucchetto su tutte le card e non salva nulla', async () => {
    await crea(false);
    expect(segnalibri()).toHaveLength(0);
    const lucchetti = html.querySelectorAll('app-comic-card app-bookmark-button a[href="/login"]');
    expect(lucchetti).toHaveLength(4);
  });
});
