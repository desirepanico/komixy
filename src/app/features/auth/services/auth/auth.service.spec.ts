import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '@shared/models/app-routes.model';
import { LoggedUser } from '../../models/auth.model';
import { UserRole } from '@shared/models/user-role.model';
import { SessionService } from '@shared/services/session/session.service';
import {
  AUTH_USER_STORAGE_KEY,
  DEMO_CREDENTIALS,
  FAKE_API_DELAY_MS,
} from '@shared/constants/form.const';
import { ApiError, AuthService } from './auth.service';

const user: LoggedUser = { id: '1', email: 'a@b.it', userRole: UserRole.User };

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('parte senza utente autenticato', () => {
    expect(service.loggedUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it("dopo il login espone l'utente", () => {
    service.login(user);
    expect(service.loggedUser()).toEqual(user);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('dopo il login la sessione condivisa non è più di un ospite', () => {
    service.login(user);
    expect(TestBed.inject(SessionService).isGuest()).toBe(false);
  });

  it('come ospite non c’è un utente e la sessione condivisa è di un ospite', () => {
    service.login(user);
    service.enterAsGuest();
    expect(service.loggedUser()).toBeNull();
    expect(TestBed.inject(SessionService).isGuest()).toBe(true);
  });

  it('dopo il logout la sessione condivisa torna di un ospite', () => {
    service.login(user);
    service.logout();
    expect(TestBed.inject(SessionService).isGuest()).toBe(true);
  });

  it("dopo il logout cancella l'utente e va al login", () => {
    service.login(user);
    service.logout();
    expect(service.loggedUser()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/', AppRoutes.Login]);
  });

  describe('dopo un refresh', () => {
    const refresh = () => {
      TestBed.resetTestingModule();
      vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      return TestBed.inject(AuthService);
    };

    it("l'iscritto resta tale, con i suoi dati", () => {
      service.login(user);
      const fresh = refresh();
      expect(fresh.loggedUser()).toEqual(user);
      expect(fresh.isAuthenticated()).toBe(true);
      expect(TestBed.inject(SessionService).isGuest()).toBe(false);
    });

    it("l'ospite resta ospite", () => {
      service.enterAsGuest();
      const fresh = refresh();
      expect(fresh.loggedUser()).toBeNull();
      expect(fresh.isAuthenticated()).toBe(false);
    });

    it('dopo il logout riparte da ospite e lo storage è pulito', () => {
      service.login(user);
      service.logout();
      const fresh = refresh();
      expect(fresh.loggedUser()).toBeNull();
      expect(fresh.isAuthenticated()).toBe(false);
      expect(localStorage.getItem(AUTH_USER_STORAGE_KEY)).toBeNull();
    });

    it('un utente salvato rovinato viene ignorato', () => {
      service.login(user);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, '{non json');
      expect(refresh().loggedUser()).toBeNull();
    });
  });

  describe('authenticate', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('con le credenziali demo risponde dopo la latenza e registra l’utente', async () => {
      const response = firstValueFrom(service.authenticate(DEMO_CREDENTIALS));
      expect(service.isAuthenticated()).toBe(false);
      await vi.advanceTimersByTimeAsync(FAKE_API_DELAY_MS);
      expect(await response).toEqual({
        id: DEMO_CREDENTIALS.email,
        email: DEMO_CREDENTIALS.email,
        userRole: UserRole.User,
      });
      expect(service.isAuthenticated()).toBe(true);
    });

    it('ignora maiuscole e spazi nell’email', async () => {
      const response = firstValueFrom(
        service.authenticate({ email: ' Demo@Example.com ', password: DEMO_CREDENTIALS.password }),
      );
      await vi.advanceTimersByTimeAsync(FAKE_API_DELAY_MS);
      expect((await response).email).toBe(DEMO_CREDENTIALS.email);
    });

    it('con credenziali sbagliate risponde 401 e non registra nessuno', async () => {
      const response = firstValueFrom(
        service.authenticate({ email: DEMO_CREDENTIALS.email, password: 'sbagliata' }),
      ).catch((e: unknown) => e);
      await vi.advanceTimersByTimeAsync(FAKE_API_DELAY_MS);
      const error = await response;
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(401);
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
