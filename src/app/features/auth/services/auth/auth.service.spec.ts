import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '@shared/models/app-routes.model';
import { LoggedUser } from '../../models/auth.model';
import { UserRole } from '@shared/models/user-role.model';
import { SessionService } from '@shared/services/session/session.service';
<<<<<<< HEAD
import { DEMO_CREDENTIALS, FAKE_API_DELAY_MS } from '@shared/constants/form.const';
import { ApiError, AuthService } from './auth.service';
=======
import { AuthService } from './auth.service';
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7

const utente: LoggedUser = { id: '1', email: 'a@b.it', userRole: UserRole.User };

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('parte senza utente autenticato', () => {
    expect(service.loggedUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it("dopo il login espone l'utente", () => {
    service.login(utente);
    expect(service.loggedUser()).toEqual(utente);
    expect(service.isAuthenticated()).toBe(true);
  });

<<<<<<< HEAD
  it('dopo il login la sessione condivisa conosce utente e ruolo', () => {
    service.login({ id: 'guest', email: '', userRole: UserRole.Guest });
    const sessione = TestBed.inject(SessionService);
    expect(sessione.user()).toEqual({ id: 'guest', role: UserRole.Guest });
    expect(sessione.isGuest()).toBe(true);
  });

  it('dopo il logout la sessione condivisa si svuota', () => {
    service.login(utente);
    service.logout();
    expect(TestBed.inject(SessionService).user()).toBeNull();
  });

=======
  it("dopo il login e il logout lo stato condiviso con le altre feature si aggiorna", () => {
    const sessione = TestBed.inject(SessionService);
    service.login(utente);
    expect(sessione.isAuthenticated()).toBe(true);
    service.logout();
    expect(sessione.isGuest()).toBe(true);
  });

>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  it("dopo il logout cancella l'utente e va al login", () => {
    service.login(utente);
    service.logout();
    expect(service.loggedUser()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/', AppRoutes.Login]);
  });

  describe('authenticate', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('con le credenziali demo risponde dopo la latenza e registra l’utente', async () => {
      const risposta = firstValueFrom(service.authenticate(DEMO_CREDENTIALS));
      expect(service.isAuthenticated()).toBe(false);
      await vi.advanceTimersByTimeAsync(FAKE_API_DELAY_MS);
      expect(await risposta).toEqual({
        id: DEMO_CREDENTIALS.email,
        email: DEMO_CREDENTIALS.email,
        userRole: UserRole.User,
      });
      expect(service.isAuthenticated()).toBe(true);
    });

    it('ignora maiuscole e spazi nell’email', async () => {
      const risposta = firstValueFrom(
        service.authenticate({ email: ' Demo@Example.com ', password: DEMO_CREDENTIALS.password }),
      );
      await vi.advanceTimersByTimeAsync(FAKE_API_DELAY_MS);
      expect((await risposta).email).toBe(DEMO_CREDENTIALS.email);
    });

    it('con credenziali sbagliate risponde 401 e non registra nessuno', async () => {
      const risposta = firstValueFrom(
        service.authenticate({ email: DEMO_CREDENTIALS.email, password: 'sbagliata' }),
      ).catch((e: unknown) => e);
      await vi.advanceTimersByTimeAsync(FAKE_API_DELAY_MS);
      const errore = await risposta;
      expect(errore).toBeInstanceOf(ApiError);
      expect((errore as ApiError).status).toBe(401);
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
