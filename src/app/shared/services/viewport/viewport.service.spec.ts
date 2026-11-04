import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewportService } from './viewport.service';

describe('ViewportService', () => {
  const larghezzaIniziale = window.innerWidth;

  const imposta = (larghezza: number) => {
    Object.defineProperty(window, 'innerWidth', { value: larghezza, configurable: true });
    window.dispatchEvent(new Event('resize'));
  };

  let service: ViewportService;

  beforeEach(() => {
    service = TestBed.inject(ViewportService);
  });

  afterEach(() => imposta(larghezzaIniziale));

  it('riconosce il telefono sotto i 768px', () => {
    imposta(500);
    expect(service.isMobile()).toBe(true);
    expect(service.isTablet()).toBe(false);
    expect(service.isDesktop()).toBe(false);
    expect(service.isMobileOrTablet()).toBe(true);
  });

  it('riconosce il tablet tra 768px e 1023px', () => {
    imposta(800);
    expect(service.isTablet()).toBe(true);
    expect(service.isMobile()).toBe(false);
    expect(service.isMobileOrTablet()).toBe(true);
  });

  it('riconosce il desktop da 1024px in su', () => {
    imposta(1024);
    expect(service.isDesktop()).toBe(true);
    expect(service.isMobileOrTablet()).toBe(false);
  });
});
