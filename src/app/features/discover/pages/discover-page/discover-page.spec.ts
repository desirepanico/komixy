import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '@shared/models/user-role.model';
import { SessionService } from '@shared/services/session/session.service';
import { ToastService } from '@shared/services/toast/toast.service';
=======
import { beforeEach, describe, expect, it } from 'vitest';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
import { DiscoverPage } from './discover-page';

describe('DiscoverPage', () => {
  let html: HTMLElement;
  let fixture: ComponentFixture<DiscoverPage>;

  const segnalibri = () =>
<<<<<<< HEAD
    Array.from(html.querySelectorAll('app-comic-card button[aria-pressed]')) as HTMLButtonElement[];

  const crea = async (ruolo: UserRole = UserRole.User) => {
    TestBed.inject(SessionService).start({ id: 'utente', role: ruolo });
=======
    Array.from(
      html.querySelectorAll('app-comic-card button[aria-pressed]'),
    ) as HTMLButtonElement[];

  const crea = async (iscritto = true) => {
    TestBed.inject(SessionService).setAuthenticated(iscritto);
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
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

<<<<<<< HEAD
  it('mostra la busta della settimana al posto dell’elenco della classifica', async () => {
    await crea();
    expect(html.querySelector('app-weekly-pack')).not.toBeNull();
    expect(html.querySelector('app-comic-rank-card')).toBeNull();
  });

=======
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

>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  it('mostra i manga da scoprire in una lista orizzontale', async () => {
    await crea();
    const lista = html.querySelector('app-horizontal-scroller');
    expect(lista?.querySelectorAll('app-comic-card')).toHaveLength(4);
  });

<<<<<<< HEAD
  it('un iscritto aggiunge più fumetti alla lista e li toglie al secondo tocco', async () => {
=======
  it('un iscritto può mettere in lista più fumetti', async () => {
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
    await crea();
    segnalibri()[0].click();
    segnalibri()[1].click();
    await fixture.whenStable();
    expect(segnalibri().map((b) => b.getAttribute('aria-pressed'))).toEqual([
      'true',
      'true',
<<<<<<< HEAD
      ...Array(5).fill('false'),
=======
      'false',
      'false',
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
    ]);
    expect(TestBed.inject(BookmarksService).savedCount()).toBe(2);

    segnalibri()[0].click();
    await fixture.whenStable();
    expect(segnalibri()[0].getAttribute('aria-pressed')).toBe('false');
<<<<<<< HEAD
    expect(segnalibri()[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('per l’ospite i segnalibri hanno il lucchetto e non salvano nulla', async () => {
    await crea(UserRole.Guest);
    const toast = TestBed.inject(ToastService);
    vi.spyOn(toast, 'info');
    expect(segnalibri().every((b) => b.getAttribute('aria-disabled') === 'true')).toBe(true);

    segnalibri()[0].click();
    await fixture.whenStable();
    expect(segnalibri()[0].getAttribute('aria-pressed')).toBe('false');
    expect(toast.info).toHaveBeenCalledWith(
      'bookmark.guestLocked.summaryInfo',
      'bookmark.guestLocked.detailInfo',
    );
=======
  });

  it('un ospite ha il lucchetto su tutte le card e non salva nulla', async () => {
    await crea(false);
    expect(segnalibri()).toHaveLength(0);
    const lucchetti = html.querySelectorAll('app-comic-card app-bookmark-button a[href="/login"]');
    expect(lucchetti).toHaveLength(4);
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  });
});
