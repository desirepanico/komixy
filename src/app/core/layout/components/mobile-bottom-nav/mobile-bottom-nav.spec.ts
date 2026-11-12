import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { MobileBottomNav } from './mobile-bottom-nav';

describe('MobileBottomNav', () => {
  const create = async () => {
    await TestBed.configureTestingModule({
      imports: [MobileBottomNav],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(MobileBottomNav);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('viene creata', async () => {
    expect(await create()).toBeTruthy();
  });

  it('mostra le quattro pagine principali e il pulsante Scan al centro', async () => {
    const link = Array.from((await create()).querySelectorAll('a'));
    expect(link.map((a) => a.getAttribute('href'))).toEqual([
      '/discover',
      '/releases',
      '/scan',
      '/library',
      '/profile',
    ]);
  });

  it('traduce le etichette del menu', async () => {
    const text = (await create()).textContent;
    expect(text).toContain('menu.discover');
    expect(text).toContain('menu.scan');
    expect(text).toContain('common.profile');
  });
});
