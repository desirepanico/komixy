import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicKind } from '@shared/models/comic.model';
import { DiscoverDock } from './discover-dock';

@Component({
  imports: [DiscoverDock],
  template: `<app-discover-dock
    [on]="on()"
    [kind]="kind()"
    [comics]="[]"
    [kindComics]="[]"
    search=""
    [filterCount]="2"
    [progress]="0.5"
    (kindChange)="kind.set($event)"
    (openFilters)="opened.set(true)"
  />`,
})
class Host {
  public readonly on = signal<boolean>(false);
  public readonly kind = signal<ComicKind>('manga');
  public readonly opened = signal<boolean>(false);
}

describe('DiscoverDock', () => {
  let fixture: ComponentFixture<Host>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('nascosto non è raggiungibile (inert) e visibile sì', async () => {
    const dock = html.querySelector('[role="toolbar"]')!;
    expect(dock.hasAttribute('inert')).toBe(true);
    fixture.componentInstance.on.set(true);
    await fixture.whenStable();
    expect(dock.hasAttribute('inert')).toBe(false);
  });

  it('le sezioni sono bottoni con aria-pressed e cambiano la sezione', async () => {
    const buttons = Array.from(html.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'));
    expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
    buttons[1].click();
    expect(fixture.componentInstance.kind()).toBe('comic');
  });

  it('il pulsante Filtri ha il conteggio nell’etichetta e apre il pannello', () => {
    const button = html.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
    expect(button.getAttribute('aria-label')).toBe('discoverFilters.filtersApplied');
    button.click();
    expect(fixture.componentInstance.opened()).toBe(true);
  });
});
