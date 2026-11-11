import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SelectButtonOption } from '../../models/select-button.model';
import { SelectButton } from './select-button';

type Vista = 'list' | 'cards' | 'table';

@Component({
  imports: [SelectButton],
  template: `<app-select-button label="x.gruppo" [options]="voci()" [(value)]="vista" />`,
})
class Host {
  readonly vista = signal<Vista>('list');
  readonly voci = signal<readonly SelectButtonOption<Vista>[]>([
    { value: 'list', label: 'x.elenco' },
    { value: 'cards', label: 'x.carte' },
  ]);
}

describe('SelectButton', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const bottoni = () => Array.from(html.querySelectorAll('button'));

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
    expect(bottoni().map((b) => b.textContent?.trim())).toEqual(['x.elenco', 'x.carte']);
    expect(bottoni().map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
  });

  it('è un gruppo con un nome', () => {
    expect(html.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('x.gruppo');
  });

  it('scegliendo una voce cambia il valore del genitore', async () => {
    bottoni()[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.vista()).toBe('cards');
    expect(bottoni().map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true']);

    bottoni()[0].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.vista()).toBe('list');
  });

  it('funziona con un numero qualsiasi di voci', async () => {
    fixture.componentInstance.voci.set([
      { value: 'list', label: 'x.elenco' },
      { value: 'cards', label: 'x.carte' },
      { value: 'table', label: 'x.tabella' },
    ]);
    await fixture.whenStable();
    expect(bottoni()).toHaveLength(3);
  });
});
