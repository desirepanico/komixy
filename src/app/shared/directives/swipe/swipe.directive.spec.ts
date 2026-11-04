import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Swipe } from './swipe.directive';

@Component({
  imports: [Swipe],
  template: `
    <div appSwipe (swipeLeft)="sinistra = sinistra + 1" (swipeRight)="destra = destra + 1">
      <span id="testo">testo</span>
      <button id="bottone" type="button">ok</button>
      <div id="escluso" data-no-swipe>scorre</div>
    </div>
  `,
})
class Host {
  sinistra = 0;
  destra = 0;
}

function gesto(el: Element, da: [number, number], a: [number, number], pointerType = 'touch') {
  const evento = (type: string, [x, y]: [number, number]) => {
    const e = new Event(type, { bubbles: true }) as PointerEvent;
    Object.assign(e, { clientX: x, clientY: y, pointerType });
    return e;
  };
  el.dispatchEvent(evento('pointerdown', da));
  el.dispatchEvent(evento('pointerup', a));
}

describe('Swipe', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('emette swipeLeft con un gesto verso sinistra', () => {
    gesto(el('testo'), [300, 100], [100, 105]);
    expect(host.sinistra).toBe(1);
    expect(host.destra).toBe(0);
  });

  it('emette swipeRight con un gesto verso destra', () => {
    gesto(el('testo'), [100, 100], [300, 95]);
    expect(host.destra).toBe(1);
  });

  it('ignora i gesti troppo corti o troppo verticali', () => {
    gesto(el('testo'), [100, 100], [130, 100]);
    gesto(el('testo'), [100, 100], [200, 400]);
    expect(host.sinistra + host.destra).toBe(0);
  });

  it('ignora il mouse', () => {
    gesto(el('testo'), [300, 100], [100, 100], 'mouse');
    expect(host.sinistra).toBe(0);
  });

  it('ignora i gesti su bottoni e zone con data-no-swipe', () => {
    gesto(el('bottone'), [300, 100], [100, 100]);
    gesto(el('escluso'), [300, 100], [100, 100]);
    expect(host.sinistra).toBe(0);
  });
});
