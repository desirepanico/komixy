import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HorizontalScroller } from './horizontal-scroller';

@Component({
  imports: [HorizontalScroller],
  template: `
    <app-horizontal-scroller ariaLabel="Lista di prova">
      <div class="w-40 shrink-0 snap-start">uno</div>
    </app-horizontal-scroller>
  `,
})
class Host {}

describe('HorizontalScroller', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  let fixture: ComponentFixture<Host>;
  let list: HTMLElement;
  let scrollBy: ReturnType<typeof vi.fn>;

  const arrows = () =>
    Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];

  // Simula una lista larga 1000px in una finestra di 300px, scrollata di `x`
  const scrolls = async (x: number) => {
    Object.defineProperty(list, 'scrollWidth', { value: 1000, configurable: true });
    Object.defineProperty(list, 'clientWidth', { value: 300, configurable: true });
    list.scrollLeft = x;
    list.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    list = fixture.nativeElement.querySelector('[role="region"]');
    scrollBy = vi.fn();
    list.scrollBy = scrollBy as unknown as typeof list.scrollBy;
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("è una regione con l'etichetta per i lettori di schermo e il contenuto passato", () => {
    expect(list.getAttribute('aria-label')).toBe('Lista di prova');
    expect(list.textContent).toContain('uno');
    expect(list.hasAttribute('data-no-swipe')).toBe(true);
  });

  it('lascia passare anche il pan verticale del dito, per scrollare la pagina', () => {
    expect(list.classList).toContain('touch-pan-x');
    expect(list.classList).toContain('touch-pan-y');
  });

  it('parte con le frecce disattivate se non c’è niente da scorrere', () => {
    const [back, avanti] = arrows();
    expect(back.disabled).toBe(true);
    expect(avanti.disabled).toBe(true);
  });

  it("attiva la freccia avanti all'inizio della lista e quella indietro dopo aver scorso", async () => {
    await scrolls(0);
    let [back, avanti] = arrows();
    expect(back.disabled).toBe(true);
    expect(avanti.disabled).toBe(false);

    await scrolls(100);
    [back, avanti] = arrows();
    expect(back.disabled).toBe(false);
    expect(avanti.disabled).toBe(false);
  });

  it('disattiva la freccia avanti in fondo alla lista', async () => {
    await scrolls(700);
    expect(arrows()[1].disabled).toBe(true);
  });

  it('scorre di una larghezza visibile con le frecce e i tasti freccia', async () => {
    await scrolls(100);
    const [back, avanti] = arrows();

    avanti.click();
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 300, behavior: 'smooth' });

    back.click();
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -300, behavior: 'smooth' });

    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 300, behavior: 'smooth' });
  });

  it('non anima lo scroll se l’utente ha chiesto di ridurre il movimento', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    await scrolls(100);
    arrows()[1].click();
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 300, behavior: 'auto' });
  });
});
