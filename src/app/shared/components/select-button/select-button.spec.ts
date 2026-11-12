import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SelectButtonOption } from '../../models/select-button.model';
import { SelectButton } from './select-button';

type Vista = 'list' | 'cards' | 'table';

@Component({
  imports: [SelectButton],
  template: `<app-select-button label="x.gruppo" [options]="items()" [(value)]="view" />`,
})
class Host {
  readonly view = signal<Vista>('list');
  readonly items = signal<readonly SelectButtonOption<Vista>[]>([
    { value: 'list', label: 'x.elenco' },
    { value: 'cards', label: 'x.carte' },
  ]);
}

describe('SelectButton', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const buttons = () => Array.from(html.querySelectorAll('button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('ha una voce per opzione, col suo testo, e il valore attuale premuto', () => {
    expect(buttons().map((b) => b.textContent?.trim())).toEqual(['x.elenco', 'x.carte']);
    expect(buttons().map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
  });

  it('è un gruppo con un nome', () => {
    expect(html.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('x.gruppo');
  });

  it('scegliendo una voce cambia il valore del genitore', async () => {
    buttons()[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.view()).toBe('cards');
    expect(buttons().map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true']);

    buttons()[0].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.view()).toBe('list');
  });

  it('funziona con un numero qualsiasi di voci', async () => {
    fixture.componentInstance.items.set([
      { value: 'list', label: 'x.elenco' },
      { value: 'cards', label: 'x.carte' },
      { value: 'table', label: 'x.tabella' },
    ]);
    await fixture.whenStable();
    expect(buttons()).toHaveLength(3);
  });

  describe('da tastiera', () => {
    it('ogni voce è un bottone nativo, raggiungibile con Tab', () => {
      for (const button of buttons()) {
        expect(button.tagName).toBe('BUTTON');
        expect(button.getAttribute('type')).toBe('button');
        expect(button.hasAttribute('tabindex')).toBe(false);
        expect(button.disabled).toBe(false);
      }
    });

    it('ogni voce può avere il focus', () => {
      for (const button of buttons()) {
        button.focus();
        expect(document.activeElement).toBe(button);
      }
    });

    it('il focus resta sulla voce scelta dopo il cambio', async () => {
      buttons()[1].focus();
      buttons()[1].click();
      await fixture.whenStable();
      expect(document.activeElement).toBe(buttons()[1]);
    });
  });
});
