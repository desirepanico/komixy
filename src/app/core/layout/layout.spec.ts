import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MobileSwipeService } from '@shared/services/mobile-swipe/mobile-swipe.service';
import { ViewportService } from '@shared/services/viewport/viewport.service';
import { Layout } from './layout';

describe('Layout', () => {
  const desktop = signal(true);
  const navigate = vi.fn();

  const crea = async () => {
    const fixture = TestBed.createComponent(Layout);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(() => {
    navigate.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ViewportService, useValue: { isDesktop: desktop } },
        { provide: MobileSwipeService, useValue: { navigate } },
      ],
    });
  });

  it('da desktop mostra la sidebar e non la barra in basso', async () => {
    desktop.set(true);
    const html = await crea();
    expect(html.querySelector('app-desktop-sidebar')).not.toBeNull();
    expect(html.querySelector('app-mobile-bottom-nav')).toBeNull();
  });

  it('da mobile o tablet mostra la barra in basso e non la sidebar', async () => {
    desktop.set(false);
    const html = await crea();
    expect(html.querySelector('app-mobile-bottom-nav')).not.toBeNull();
    expect(html.querySelector('app-desktop-sidebar')).toBeNull();
  });

  it('da mobile lo swipe cambia pagina nella direzione del gesto', async () => {
    desktop.set(false);
    const main = (await crea()).querySelector('main') as HTMLElement;
    const tocca = (type: string, x: number) => {
      const e = new Event(type, { bubbles: true }) as PointerEvent;
      Object.assign(e, { clientX: x, clientY: 100, pointerType: 'touch' });
      main.dispatchEvent(e);
    };

    tocca('pointerdown', 300);
    tocca('pointerup', 100);
    expect(navigate).toHaveBeenLastCalledWith('left');

    tocca('pointerdown', 100);
    tocca('pointerup', 300);
    expect(navigate).toHaveBeenLastCalledWith('right');
  });
});
