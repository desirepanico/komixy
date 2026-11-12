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
    const icon = html.querySelector('app-hint ng-icon');
    expect(icon?.getAttribute('name')).toBe('matTouchAppOutline');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('ha la stessa grandezza e lo stesso colore in ogni punto', () => {
    const classes = html.querySelector('app-hint')?.className ?? '';
    expect(classes).toContain('text-sm');
    expect(classes).toContain('text-surface-300');
  });
});
