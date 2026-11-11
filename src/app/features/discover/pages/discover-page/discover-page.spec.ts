import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '@shared/models/user-role.model';
import { SessionService } from '@shared/services/session/session.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { DiscoverPage } from './discover-page';

describe('DiscoverPage', () => {
  let html: HTMLElement;
  let fixture: ComponentFixture<DiscoverPage>;

  const segnalibri = () =>
    Array.from(html.querySelectorAll('app-comic-card button[aria-pressed]')) as HTMLButtonElement[];

  const crea = async (ruolo: UserRole = UserRole.User) => {
    TestBed.inject(SessionService).start({ id: 'utente', role: ruolo });
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

  it('mostra la busta della settimana al posto dell’elenco della classifica', async () => {
    await crea();
    expect(html.querySelector('app-weekly-pack')).not.toBeNull();
    expect(html.querySelector('app-comic-rank-card')).toBeNull();
  });

  it('mostra i manga da scoprire in una lista orizzontale', async () => {
    await crea();
    const lista = html.querySelector('app-horizontal-scroller');
    expect(lista?.querySelectorAll('app-comic-card')).toHaveLength(7);
  });

  it('un iscritto aggiunge più fumetti alla lista e li toglie al secondo tocco', async () => {
    await crea();
    segnalibri()[0].click();
    segnalibri()[1].click();
    await fixture.whenStable();
    expect(segnalibri().map((b) => b.getAttribute('aria-pressed'))).toEqual([
      'true',
      'true',
      ...Array(5).fill('false'),
    ]);

    segnalibri()[0].click();
    await fixture.whenStable();
    expect(segnalibri()[0].getAttribute('aria-pressed')).toBe('false');
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
  });
});
