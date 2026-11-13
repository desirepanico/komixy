import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AUTH_TOKEN_STORAGE_KEY,
  GUEST_ID_STORAGE_KEY,
  SESSION_STORAGE_KEY,
} from '../../constants/form.const';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(SessionService);
  });

  it("all'inizio è un ospite", () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.isGuest()).toBe(true);
  });

  it('dopo setAuthenticated(true) è un iscritto', () => {
    service.setAuthenticated(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.isGuest()).toBe(false);
  });

  it('invita a iscriversi dalla pagina di login', () => {
    expect(service.signUpLink).toEqual(['/', 'login']);
  });

  it('un iscritto resta tale dopo un refresh', () => {
    service.setAuthenticated(true);
    TestBed.resetTestingModule();
    expect(TestBed.inject(SessionService).isAuthenticated()).toBe(true);
  });

  it('dopo il logout un refresh riparte da ospite', () => {
    service.setAuthenticated(true);
    service.setAuthenticated(false);
    TestBed.resetTestingModule();
    expect(TestBed.inject(SessionService).isGuest()).toBe(true);
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it('senza storage disponibile funziona comunque, fino al refresh', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage bloccato');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage bloccato');
    });
    TestBed.resetTestingModule();
    const fresh = TestBed.inject(SessionService);
    expect(fresh.isGuest()).toBe(true);
    fresh.setAuthenticated(true);
    expect(fresh.isAuthenticated()).toBe(true);
  });

  describe('token', () => {
    it('all’inizio non c’è', () => {
      expect(service.token()).toBeNull();
    });

    it('setToken lo tiene e lo salva nello storage', () => {
      service.setToken('abc');
      expect(service.token()).toBe('abc');
      expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe('abc');
    });

    it('un token salvato si ritrova dopo un refresh', () => {
      service.setToken('abc');
      TestBed.resetTestingModule();
      expect(TestBed.inject(SessionService).token()).toBe('abc');
    });

    it('uscire (setAuthenticated(false)) toglie il token', () => {
      service.setAuthenticated(true);
      service.setToken('abc');
      service.setAuthenticated(false);
      expect(service.token()).toBeNull();
      expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull();
    });

    it('con lo storage non disponibile parte senza token e non si rompe', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage bloccato');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('storage bloccato');
      });
      TestBed.resetTestingModule();
      const fresh = TestBed.inject(SessionService);
      expect(fresh.token()).toBeNull();
      fresh.setToken('abc');
      expect(fresh.token()).toBe('abc');
    });
  });

  describe('guestId', () => {
    it('viene creato la prima volta e salvato nello storage', () => {
      expect(service.guestId()).toMatch(/^[0-9a-f-]{36}$/);
      expect(localStorage.getItem(GUEST_ID_STORAGE_KEY)).toBe(service.guestId());
    });

    it('dopo un refresh resta lo stesso', () => {
      const first = service.guestId();
      TestBed.resetTestingModule();
      expect(TestBed.inject(SessionService).guestId()).toBe(first);
    });

    it('resta lo stesso anche dopo l’uscita di un iscritto', () => {
      const first = service.guestId();
      service.setAuthenticated(true);
      service.setAuthenticated(false);
      expect(service.guestId()).toBe(first);
    });

    it('con lo storage non disponibile ne crea uno che vale finché l’app è aperta', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage bloccato');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('storage bloccato');
      });
      TestBed.resetTestingModule();
      expect(TestBed.inject(SessionService).guestId()).toMatch(/^[0-9a-f-]{36}$/);
    });
  });
});
