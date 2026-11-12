import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InView } from './in-view.directive';

@Component({
  imports: [InView],
  template: `<span appInView [inViewThreshold]="0.5">animato</span>`,
})
class Host {}

describe('InView', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  const create = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('span') as HTMLElement;
  };

  it('viene creata', async () => {
    expect(await create()).toBeTruthy();
  });

  it("mostra subito l'elemento se il browser non ha IntersectionObserver", async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const span = await create();
    expect(span.hasAttribute('data-in-view')).toBe(true);
  });

  it("aggiunge data-in-view solo quando l'elemento entra nello schermo, una volta sola", async () => {
    let callback: IntersectionObserverCallback = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb;
        }
        observe = vi.fn();
        disconnect = disconnect;
      },
    );

    const span = await create();
    expect(span.hasAttribute('data-in-view')).toBe(false);

    callback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(span.hasAttribute('data-in-view')).toBe(false);

    callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    TestBed.tick();
    expect(span.hasAttribute('data-in-view')).toBe(true);
    expect(disconnect).toHaveBeenCalled();
  });
});
