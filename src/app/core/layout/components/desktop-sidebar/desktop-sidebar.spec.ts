import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { DesktopSidebar } from './desktop-sidebar';

describe('DesktopSidebar', () => {
  let fixture: ComponentFixture<DesktopSidebar>;
  let html: HTMLElement;

  const titoli = () => Array.from(html.querySelectorAll('section button')) as HTMLButtonElement[];
  const link = () => Array.from(html.querySelectorAll('nav a')) as HTMLAnchorElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopSidebar],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(DesktopSidebar);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra i gruppi di menu con i loro link', () => {
    expect(titoli().map((b) => b.textContent?.trim())).toEqual(['menu.main', 'common.library']);
    expect(link().map((a) => a.getAttribute('href'))).toEqual([
      '/discover',
      '/releases',
      '/library',
    ]);
  });

  it('ha un link al logo che porta alla home', () => {
    expect(html.querySelector('a[aria-label="Komixy"]')?.getAttribute('href')).toBe('/');
  });

  it('traduce il riquadro del profilo', () => {
    expect(html.textContent).toContain('menu.myProfile');
    expect(html.textContent).toContain('menu.viewProfile');
  });

  it('il riquadro del profilo è un link alla pagina del profilo', () => {
    const profilo = html.querySelector('aside > div:last-child a') as HTMLAnchorElement;
    expect(profilo.getAttribute('href')).toBe('/profile');
  });

  it('evidenzia il riquadro del profilo solo quando la pagina è aperta', async () => {
    const profilo = () => html.querySelector('aside > div:last-child a') as HTMLAnchorElement;
    expect(profilo().getAttribute('aria-current')).toBeNull();

    const router = TestBed.inject(Router);
    router.resetConfig([{ path: 'profile', children: [] }]);
    await router.navigateByUrl('/profile');
    await fixture.whenStable();

    expect(profilo().getAttribute('aria-current')).toBe('page');
    expect(profilo().classList).toContain('bg-primary-500/15');
  });

  it('chiude e riapre un gruppo, aggiornando aria-expanded', async () => {
    const gruppo = () => titoli()[0];
    expect(gruppo().getAttribute('aria-expanded')).toBe('true');

    gruppo().click();
    await fixture.whenStable();
    expect(gruppo().getAttribute('aria-expanded')).toBe('false');
    expect(link()).toHaveLength(1);

    gruppo().click();
    await fixture.whenStable();
    expect(gruppo().getAttribute('aria-expanded')).toBe('true');
    expect(link()).toHaveLength(3);
  });

  it('chiudere un gruppo non tocca gli altri', async () => {
    titoli()[0].click();
    await fixture.whenStable();
    expect(titoli()[1].getAttribute('aria-expanded')).toBe('true');
  });
});
