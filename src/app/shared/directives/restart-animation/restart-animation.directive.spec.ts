import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RestartAnimation } from './restart-animation.directive';

@Component({
  imports: [RestartAnimation],
  template: `<b [appRestartAnimation]="count()">{{ count() }}</b>`,
})
class Host {
  public readonly count = signal<number>(1);
}

describe('RestartAnimation', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  const create = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture;
  };

  it("imposta l'attributo alla prima comparsa", async () => {
    const fixture = await create();
    expect(fixture.nativeElement.querySelector('b').hasAttribute('data-restart')).toBe(true);
  });

  it("a ogni cambio toglie e rimette l'attributo, sullo stesso elemento", async () => {
    const fixture = await create();
    const element: HTMLElement = fixture.nativeElement.querySelector('b');
    const remove = vi.spyOn(element, 'removeAttribute');
    fixture.componentInstance.count.set(2);
    await fixture.whenStable();
    expect(remove).toHaveBeenCalledWith('data-restart');
    expect(element.hasAttribute('data-restart')).toBe(true);
    expect(fixture.nativeElement.querySelector('b')).toBe(element);
    expect(element.textContent).toBe('2');
  });

  it('non ricrea il DOM e non genera NG0956', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fixture = await create();
    for (const n of [2, 3, 4]) {
      fixture.componentInstance.count.set(n);
      await fixture.whenStable();
    }
    const logged = [...warn.mock.calls, ...error.mock.calls].flat().join(' ');
    expect(logged).not.toContain('NG0956');
  });
});
