import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { MobileBottomNav } from './mobile-bottom-nav';

describe('MobileBottomNav', () => {
  const crea = async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(MobileBottomNav);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('mostra le quattro pagine principali e il pulsante Scan al centro', async () => {
    const link = Array.from((await crea()).querySelectorAll('a'));
    expect(link.map((a) => a.getAttribute('href'))).toEqual([
      '/discover',
      '/releases',
      '/scan',
      '/library',
      '/profile',
    ]);
  });

  it('traduce le etichette del menu', async () => {
    const testo = (await crea()).textContent;
    expect(testo).toContain('menu.discover');
    expect(testo).toContain('menu.scan');
    expect(testo).toContain('menu.profile');
  });
});
