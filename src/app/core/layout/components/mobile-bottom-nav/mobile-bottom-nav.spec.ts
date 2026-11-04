import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { describe, expect, it } from 'vitest';
import { MobileBottomNav } from './mobile-bottom-nav';

describe('MobileBottomNav', () => {
  const crea = () => {
    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { it: {} },
          translocoConfig: { availableLangs: ['it'], defaultLang: 'it' },
        }),
      ],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(MobileBottomNav);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('mostra le quattro pagine principali e il pulsante Scan al centro', () => {
    const link = Array.from(crea().querySelectorAll('a'));
    expect(link.map((a) => a.getAttribute('href'))).toEqual([
      '/discover',
      '/releases',
      '/scan',
      '/library',
      '/profile',
    ]);
  });

  it('traduce le etichette del menu', () => {
    const testo = crea().textContent;
    expect(testo).toContain('menu.discover');
    expect(testo).toContain('menu.scan');
    expect(testo).toContain('menu.profile');
  });
});
