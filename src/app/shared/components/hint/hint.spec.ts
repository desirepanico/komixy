import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Hint } from './hint';

@Component({
  imports: [Hint],
  template: `<app-hint>tocca una carta per vederla</app-hint>`,
})
class Host {}

describe('Hint', () => {
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(html.querySelector('app-hint')).not.toBeNull();
  });

  it('mostra il testo ricevuto come contenuto', () => {
    expect(html.querySelector('app-hint')?.textContent).toContain('tocca una carta per vederla');
  });

  it("ha sempre l'icona del tocco, nascosta agli screen reader", () => {
    const icona = html.querySelector('app-hint ng-icon');
    expect(icona?.getAttribute('name')).toBe('matTouchAppOutline');
    expect(icona?.getAttribute('aria-hidden')).toBe('true');
  });

  it('ha la stessa grandezza e lo stesso colore in ogni punto', () => {
    const classi = html.querySelector('app-hint')?.className ?? '';
    expect(classi).toContain('text-sm');
    expect(classi).toContain('text-surface-300');
  });
});
