import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
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
});
