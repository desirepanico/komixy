import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WeeklyTop } from './weekly-top';

describe('WeeklyTop', () => {
  let fixture: ComponentFixture<WeeklyTop>;
  let html: HTMLElement;
  let measure: (larghezza: number) => void;

  const link = () => Array.from(html.querySelectorAll('ul a')) as HTMLAnchorElement[];

  beforeEach(async () => {
    // Il ResizeObserver finto permette di decidere la larghezza che il pannello «misura»
    vi.stubGlobal(
      'ResizeObserver',
      class {
        public constructor(callback: ResizeObserverCallback) {
          measure = (larghezza) =>
            callback(
              [{ contentRect: { width: larghezza } } as ResizeObserverEntry],
              this as unknown as ResizeObserver,
            );
        }
        public observe(): void {}
        public unobserve(): void {}
        public disconnect(): void {}
      },
    );
    await TestBed.configureTestingModule({
      imports: [WeeklyTop],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(WeeklyTop);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra il titolo del pannello', () => {
    expect(html.querySelector('h2')?.textContent).toContain('weeklyPack.topTitle');
  });

  it('prima di misurare la larghezza mostra le prime tre carte', () => {
    expect(link()).toHaveLength(3);
  });

  it('mostra tante carte quante ne stanno intere, dalla 1ª in poi', async () => {
    // 96 px a carta e 12 px tra l'una e l'altra: in 420 px ne stanno 4
    measure(420);
    await fixture.whenStable();
    expect(link()).toHaveLength(4);
    expect(link().map((a) => a.getAttribute('aria-label'))).toEqual(
      [1, 2, 3, 4].map(() => expect.stringContaining('weeklyPack.cardLabel')),
    );
  });

  it('con molto spazio mostra tutte e dieci le carte, ognuna con il link al suo dettaglio', async () => {
    measure(2000);
    await fixture.whenStable();
    expect(link()).toHaveLength(10);
    expect(link().every((a) => a.getAttribute('href')?.startsWith('/comic/'))).toBe(true);
    expect(link().every((a) => a.getAttribute('title'))).toBe(true);
  });

  it('non va sotto una carta, anche con pochissimo spazio', async () => {
    measure(50);
    await fixture.whenStable();
    expect(link()).toHaveLength(1);
  });

  it('non è più largo di quanto serve per tutte le carte', () => {
    // 10 carte da 96 px, 9 spazi da 12 px e 34 px di bordo e spaziatura
    expect(html.style.maxWidth).toBe('1102px');
  });

  it("non ripete il link alla classifica: c'è già «Rivedi la settimana» nella striscia", () => {
    expect(html.querySelector('a[href="/discover/ranking"]')).toBeNull();
  });
});
