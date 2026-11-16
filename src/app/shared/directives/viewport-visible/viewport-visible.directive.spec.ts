import { ApplicationRef, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ViewportVisible } from './viewport-visible.directive';

@Component({
  imports: [ViewportVisible],
  template: `<div appViewportVisible (viewportVisibleChange)="visible.set($event)">barra</div>`,
})
class Host {
  public readonly visible = signal<boolean | null>(null);
}

describe('ViewportVisible', () => {
  let fixture: ComponentFixture<Host>;
  let callback: (entries: { isIntersecting: boolean }[]) => void;

  beforeEach(async () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: typeof callback) {
          callback = cb;
        }
        observe(): void {}
        disconnect(): void {}
      },
    );
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    // Un solo giro di rendering, sincrono: fa partire l'`afterNextRender` della direttiva senza aspettare la stabilità
    TestBed.inject(ApplicationRef).tick();
  });

  it("dice quando l'elemento esce dallo schermo e quando rientra", () => {
    callback([{ isIntersecting: false }]);
    expect(fixture.componentInstance.visible()).toBe(false);
    callback([{ isIntersecting: true }]);
    expect(fixture.componentInstance.visible()).toBe(true);
  });
});
