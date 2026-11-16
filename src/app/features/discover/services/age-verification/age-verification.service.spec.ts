import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AgeVerificationService } from './age-verification.service';

describe('AgeVerificationService', () => {
  let service: AgeVerificationService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 16));
    service = TestBed.inject(AgeVerificationService);
  });

  it('parte non verificato', () => {
    expect(service.verified()).toBe(false);
  });

  it('un maggiorenne è verificato', () => {
    expect(service.check(16, 11, 2008)).toBe('adult');
    expect(service.verified()).toBe(true);
  });

  it('chi compie 18 anni domani è ancora minorenne', () => {
    expect(service.check(17, 11, 2008)).toBe('minor');
    expect(service.verified()).toBe(false);
  });

  it('una data che non esiste o nel futuro non è valida', () => {
    expect(service.check(31, 2, 2000)).toBe('invalid');
    expect(service.check(1, 1, 2030)).toBe('invalid');
    expect(service.check(1, 1, 1800)).toBe('invalid');
  });
});
