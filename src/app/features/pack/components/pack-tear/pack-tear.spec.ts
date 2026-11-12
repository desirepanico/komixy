import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PACK_TEAR_DISTANCE_PX } from '@shared/constants/pack.const';
import { PackTear } from './pack-tear';

@Component({
  imports: [PackTear],
  template: `<app-pack-tear [torn]="torn()" (tearRequest)="onTear()" />`,
})
class Host {
  readonly torn = signal(false);
  onTear = vi.fn();
}

describe('PackTear', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const handle = () => html.querySelector('.cursor-grab') as HTMLElement;
  const flap = () => html.querySelector('[style*="transform"]') as HTMLElement;

  const event = (tipo: string, x: number) =>
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
    expect(flap().style.transform).toContain('translateX(0px)');
  });

  it('trascinando il lembo compaiono i bordi strappati e se si lascia di nuovo la busta si richiude', async () => {
    handle().dispatchEvent(event('pointerdown', 10));
    handle().dispatchEvent(event('pointermove', 40));
    await fixture.whenStable();
    expect(html.querySelectorAll('[style*="clip-path"]').length).toBe(2);

    handle().dispatchEvent(event('pointerup', 40));
    await fixture.whenStable();
    expect(html.querySelectorAll('[style*="clip-path"]').length).toBe(0);
  });

  it('trascinando abbastanza il lembo chiede di strappare la busta', async () => {
    handle().dispatchEvent(event('pointerdown', 10));
    handle().dispatchEvent(event('pointermove', 10 + PACK_TEAR_DISTANCE_PX + 5));
    await fixture.whenStable();
    expect(flap().style.transform).toContain(`translateX(${PACK_TEAR_DISTANCE_PX + 5}px)`);

    handle().dispatchEvent(event('pointerup', 10 + PACK_TEAR_DISTANCE_PX + 5));
    expect(fixture.componentInstance.onTear).toHaveBeenCalledOnce();
  });

  it('trascinando poco il lembo torna a posto e la busta resta chiusa', async () => {
    handle().dispatchEvent(event('pointerdown', 10));
    handle().dispatchEvent(event('pointermove', 60));
    handle().dispatchEvent(event('pointerup', 60));
    await fixture.whenStable();
    expect(fixture.componentInstance.onTear).not.toHaveBeenCalled();
    expect(flap().style.transform).toContain('translateX(0px)');
  });

  it('trascinando verso sinistra il lembo non si muove', async () => {
    handle().dispatchEvent(event('pointerdown', 100));
    handle().dispatchEvent(event('pointermove', 20));
    await fixture.whenStable();
    expect(flap().style.transform).toContain('translateX(0px)');
  });

  it('strappata, il lembo vola via e non si può più trascinare', async () => {
    fixture.componentInstance.torn.set(true);
    await fixture.whenStable();
    expect(flap().style.transform).toContain('rotate(38deg)');

    handle().dispatchEvent(event('pointerdown', 0));
    handle().dispatchEvent(event('pointermove', 500));
    handle().dispatchEvent(event('pointerup', 500));
    expect(fixture.componentInstance.onTear).not.toHaveBeenCalled();
  });
});
