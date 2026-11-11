import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
<<<<<<< HEAD
import { UserRole } from '../../models/user-role.model';
=======
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    service = TestBed.inject(SessionService);
  });

<<<<<<< HEAD
  it('parte senza utente e senza essere ospite', () => {
    expect(service.user()).toBeNull();
    expect(service.isGuest()).toBe(false);
  });

  it("riconosce l'ospite dal ruolo", () => {
    service.start({ id: 'guest', role: UserRole.Guest });
    expect(service.isGuest()).toBe(true);
  });

  it('un utente iscritto non è ospite', () => {
    service.start({ id: 'a@b.it', role: UserRole.User });
    expect(service.user()?.id).toBe('a@b.it');
    expect(service.isGuest()).toBe(false);
  });

  it('a fine sessione non resta nessun utente', () => {
    service.start({ id: 'guest', role: UserRole.Guest });
    service.end();
    expect(service.user()).toBeNull();
    expect(service.isGuest()).toBe(false);
=======
  it('all\'inizio è un ospite', () => {
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
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  });
});
