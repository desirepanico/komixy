import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '@core/models/app-routes';
import { LoggedUser, UserRole } from '../models/auth.model';
import { AuthService } from './auth.service';

const utente: LoggedUser = { id: '1', email: 'a@b.it', userRole: UserRole.User };

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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

  it("dopo il logout cancella l'utente e va al login", () => {
    service.login(utente);
    service.logout();
    expect(service.loggedUser()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith([AppRoutes.Login]);
  });
});
