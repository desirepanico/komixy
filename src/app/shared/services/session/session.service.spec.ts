import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SESSION_STORAGE_KEY } from '../../constants/form.const';
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
});
