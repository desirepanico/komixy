import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PACK_TEAR_DISTANCE_PX } from '@shared/constants/ui.const';
import { PackTear } from './pack-tear';

@Component({
  imports: [PackTear],
  template: `<app-pack-tear [torn]="strappata()" (tearRequest)="strappo()" />`,
})
class Host {
  readonly strappata = signal(false);
  strappo = vi.fn();
}

describe('PackTear', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const maniglia = () => html.querySelector('.cursor-grab') as HTMLElement;
  const lembo = () => html.querySelector('[style*="transform"]') as HTMLElement;

  const evento = (tipo: string, x: number) =>
    new MouseEvent(tipo, { clientX: x, bubbles: true }) as unknown as PointerEvent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('è solo decorativa per i lettori di schermo', () => {
    expect(html.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(html.querySelector('button, a')).toBeNull();
  });

  it('a riposo la busta è chiusa: niente bordi a dente di sega tra lembo e corpo', () => {
    expect(html.querySelectorAll('[style*="clip-path"]').length).toBe(0);
  });

  it('a riposo il lembo non si anima: si muove solo quando lo si trascina o si apre la busta', () => {
    expect(html.querySelector('[class*="animate-"]')).toBeNull();
    expect(lembo().style.transform).toContain('translateX(0px)');
  });

  it('trascinando il lembo compaiono i bordi strappati e se si lascia di nuovo la busta si richiude', async () => {
    maniglia().dispatchEvent(evento('pointerdown', 10));
    maniglia().dispatchEvent(evento('pointermove', 40));
    await fixture.whenStable();
    expect(html.querySelectorAll('[style*="clip-path"]').length).toBe(2);

    maniglia().dispatchEvent(evento('pointerup', 40));
    await fixture.whenStable();
    expect(html.querySelectorAll('[style*="clip-path"]').length).toBe(0);
  });

  it('trascinando abbastanza il lembo chiede di strappare la busta', async () => {
    maniglia().dispatchEvent(evento('pointerdown', 10));
    maniglia().dispatchEvent(evento('pointermove', 10 + PACK_TEAR_DISTANCE_PX + 5));
    await fixture.whenStable();
    expect(lembo().style.transform).toContain(`translateX(${PACK_TEAR_DISTANCE_PX + 5}px)`);

    maniglia().dispatchEvent(evento('pointerup', 10 + PACK_TEAR_DISTANCE_PX + 5));
    expect(fixture.componentInstance.strappo).toHaveBeenCalledOnce();
  });

  it('trascinando poco il lembo torna a posto e la busta resta chiusa', async () => {
    maniglia().dispatchEvent(evento('pointerdown', 10));
    maniglia().dispatchEvent(evento('pointermove', 60));
    maniglia().dispatchEvent(evento('pointerup', 60));
    await fixture.whenStable();
    expect(fixture.componentInstance.strappo).not.toHaveBeenCalled();
    expect(lembo().style.transform).toContain('translateX(0px)');
  });

  it('trascinando verso sinistra il lembo non si muove', async () => {
    maniglia().dispatchEvent(evento('pointerdown', 100));
    maniglia().dispatchEvent(evento('pointermove', 20));
    await fixture.whenStable();
    expect(lembo().style.transform).toContain('translateX(0px)');
  });

  it('strappata, il lembo vola via e non si può più trascinare', async () => {
    fixture.componentInstance.strappata.set(true);
    await fixture.whenStable();
    expect(lembo().style.transform).toContain('rotate(38deg)');

    maniglia().dispatchEvent(evento('pointerdown', 0));
    maniglia().dispatchEvent(evento('pointermove', 500));
    maniglia().dispatchEvent(evento('pointerup', 500));
    expect(fixture.componentInstance.strappo).not.toHaveBeenCalled();
  });
});
