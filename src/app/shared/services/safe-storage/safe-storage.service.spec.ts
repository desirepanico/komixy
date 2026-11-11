import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SafeStorage } from './safe-storage.service';

describe('SafeStorage', () => {
  let service: SafeStorage;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(SafeStorage);
  });

  it('legge ciò che ha scritto', () => {
    service.write('chiave', 'valore');
    expect(service.read('chiave')).toBe('valore');
  });

  it('una chiave mai scritta vale null', () => {
    expect(service.read('assente')).toBeNull();
  });

  it("se l'archivio è bloccato legge null senza lanciare", () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloccato');
    });
    expect(service.read('chiave')).toBeNull();
  });

  it("se l'archivio è bloccato scrive senza lanciare", () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('pieno');
    });
    expect(() => service.write('chiave', 'valore')).not.toThrow();
  });
});
