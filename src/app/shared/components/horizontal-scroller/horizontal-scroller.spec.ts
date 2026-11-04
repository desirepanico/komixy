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
  let lista: HTMLElement;
  let scrollBy: ReturnType<typeof vi.fn>;

  const frecce = () =>
    Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];

  // Simula una lista larga 1000px in una finestra di 300px, scrollata di `x`
  const scrolla = async (x: number) => {
    Object.defineProperty(lista, 'scrollWidth', { value: 1000, configurable: true });
    Object.defineProperty(lista, 'clientWidth', { value: 300, configurable: true });
    lista.scrollLeft = x;
    lista.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    lista = fixture.nativeElement.querySelector('[role="region"]');
    scrollBy = vi.fn();
    lista.scrollBy = scrollBy as unknown as typeof lista.scrollBy;
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("è una regione con l'etichetta per i lettori di schermo e il contenuto passato", () => {
    expect(lista.getAttribute('aria-label')).toBe('Lista di prova');
    expect(lista.textContent).toContain('uno');
    expect(lista.hasAttribute('data-no-swipe')).toBe(true);
  });

  it('parte con le frecce disattivate se non c’è niente da scorrere', () => {
    const [indietro, avanti] = frecce();
    expect(indietro.disabled).toBe(true);
    expect(avanti.disabled).toBe(true);
  });

  it("attiva la freccia avanti all'inizio della lista e quella indietro dopo aver scorso", async () => {
    await scrolla(0);
    let [indietro, avanti] = frecce();
    expect(indietro.disabled).toBe(true);
    expect(avanti.disabled).toBe(false);

    await scrolla(100);
    [indietro, avanti] = frecce();
    expect(indietro.disabled).toBe(false);
    expect(avanti.disabled).toBe(false);
  });

  it('disattiva la freccia avanti in fondo alla lista', async () => {
    await scrolla(700);
    expect(frecce()[1].disabled).toBe(true);
  });

  it('scorre di una larghezza visibile con le frecce e i tasti freccia', async () => {
    await scrolla(100);
    const [indietro, avanti] = frecce();

    avanti.click();
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 300, behavior: 'smooth' });

    indietro.click();
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -300, behavior: 'smooth' });

    lista.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 300, behavior: 'smooth' });
  });

  it('non anima lo scroll se l’utente ha chiesto di ridurre il movimento', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    await scrolla(100);
    frecce()[1].click();
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 300, behavior: 'auto' });
  });
});
