import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { DiscoverPage } from './discover-page';

describe('DiscoverPage', () => {
  let html: HTMLElement;
  let fixture: ComponentFixture<DiscoverPage>;

  const segnalibri = (selettore: string) =>
    Array.from(html.querySelectorAll(`${selettore} button[aria-pressed]`)) as HTMLButtonElement[];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(DiscoverPage);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('mostra le prime sei posizioni della classifica', () => {
    expect(html.querySelectorAll('app-comic-rank-card')).toHaveLength(6);
  });

  it('mostra i manga da scoprire in una lista orizzontale', () => {
    const lista = html.querySelector('app-horizontal-scroller');
    expect(lista?.querySelectorAll('app-comic-card')).toHaveLength(7);
  });

  it('i link "vedi tutta la classifica" portano a /discover/ranking', () => {
    const link = html.querySelector('a[href="/discover/ranking"]');
    expect(link).not.toBeNull();
  });

  it('seleziona un solo fumetto alla volta tra i segnalibri e lo deseleziona al secondo clic', async () => {
    const carte = () => segnalibri('app-comic-card');
    carte()[0].click();
    await fixture.whenStable();
    expect(carte().map((b) => b.getAttribute('aria-pressed'))).toEqual([
      'true',
      ...Array(6).fill('false'),
    ]);

    carte()[1].click();
    await fixture.whenStable();
    expect(carte()[0].getAttribute('aria-pressed')).toBe('false');
    expect(carte()[1].getAttribute('aria-pressed')).toBe('true');

    carte()[1].click();
    await fixture.whenStable();
    expect(carte().every((b) => b.getAttribute('aria-pressed') === 'false')).toBe(true);
  });
});
