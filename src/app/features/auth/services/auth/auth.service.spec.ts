import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '@shared/models/app-routes.model';
import { LoggedUser } from '../../models/auth.model';
import { UserRole } from '@shared/models/user-role.model';
import { SessionService } from '@shared/services/session/session.service';
import { AUTH_USER_STORAGE_KEY } from '@shared/constants/form.const';
import { ApiError, AuthService } from './auth.service';

const user: LoggedUser = { id: '1', email: 'a@b.it', userRole: UserRole.User };

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
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
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
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
    const credentials = { email: 'a@b.it', password: 'password1' };
    const body = (result: unknown) => ({ error: { code: '', message: '' }, result });

    it('invia le credenziali, restituisce il result e registra l’utente', async () => {
      const http = TestBed.inject(HttpTestingController);
      const response = firstValueFrom(service.authenticate(credentials));
      const request = http.expectOne('/auth/login');
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(credentials);
      expect(service.isAuthenticated()).toBe(false);
      request.flush(body(user));
      expect(await response).toEqual(user);
      expect(service.isAuthenticated()).toBe(true);
      http.verify();
    });

    it('con un 401 risponde ApiError con lo stato e non registra nessuno', async () => {
      const http = TestBed.inject(HttpTestingController);
      const response = firstValueFrom(service.authenticate(credentials)).catch((e: unknown) => e);
      http.expectOne('/auth/login').flush(
        { error: { code: 'E401', message: 'Credenziali non valide' }, result: null },
        {
          status: 401,
          statusText: 'Unauthorized',
        },
      );
      const error = await response;
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(401);
      expect((error as ApiError).message).toBe('Credenziali non valide');
      expect(service.isAuthenticated()).toBe(false);
    });

    it('con un errore di rete usa il messaggio di HttpClient', async () => {
      const http = TestBed.inject(HttpTestingController);
      const response = firstValueFrom(service.authenticate(credentials)).catch((e: unknown) => e);
      http.expectOne('/auth/login').error(new ProgressEvent('error'));
      const error = await response;
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(0);
      expect(error).not.toBeInstanceOf(HttpErrorResponse);
    });
  });
});
