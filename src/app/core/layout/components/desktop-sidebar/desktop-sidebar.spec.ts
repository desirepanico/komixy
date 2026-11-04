import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { beforeEach, describe, expect, it } from 'vitest';
import { DesktopSidebar } from './desktop-sidebar';

describe('DesktopSidebar', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<DesktopSidebar>>;
  let html: HTMLElement;

  const titoli = () => Array.from(html.querySelectorAll('section button')) as HTMLButtonElement[];
  const link = () => Array.from(html.querySelectorAll('nav a')) as HTMLAnchorElement[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { it: {} },
          translocoConfig: { availableLangs: ['it'], defaultLang: 'it' },
        }),
      ],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(DesktopSidebar);
    html = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('mostra i gruppi di menu con i loro link', () => {
    expect(titoli().map((b) => b.textContent?.trim())).toEqual(['menu.main', 'menu.library']);
    expect(link().map((a) => a.getAttribute('href'))).toEqual([
      '/discover',
      '/releases',
      '/library',
    ]);
  });

  it('ha un link al logo che porta alla home', () => {
    expect(html.querySelector('a[aria-label="Komixy"]')?.getAttribute('href')).toBe('/');
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
