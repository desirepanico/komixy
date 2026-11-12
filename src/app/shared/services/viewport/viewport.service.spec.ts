import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewportService } from './viewport.service';

describe('ViewportService', () => {
  const initialWidth = window.innerWidth;

  const set = (larghezza: number) => {
    Object.defineProperty(window, 'innerWidth', { value: larghezza, configurable: true });
    window.dispatchEvent(new Event('resize'));
  };

  let service: ViewportService;

  beforeEach(() => {
    service = TestBed.inject(ViewportService);
  });

  afterEach(() => set(initialWidth));

  it('riconosce il telefono sotto i 768px', () => {
    set(500);
    expect(service.isMobile()).toBe(true);
    expect(service.isTablet()).toBe(false);
    expect(service.isDesktop()).toBe(false);
    expect(service.isMobileOrTablet()).toBe(true);
  });

  it('riconosce il tablet tra 768px e 1023px', () => {
    set(800);
    expect(service.isTablet()).toBe(true);
    expect(service.isMobile()).toBe(false);
    expect(service.isMobileOrTablet()).toBe(true);
  });

  it('riconosce il desktop da 1024px in su', () => {
    set(1024);
    expect(service.isDesktop()).toBe(true);
    expect(service.isMobileOrTablet()).toBe(false);
  });
});
