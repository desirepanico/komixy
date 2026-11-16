import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicKind } from '@shared/models/catalog-item.model';
import { DiscoverTab } from '../../models/discover-filters.model';
import { DiscoverTabs } from './discover-tabs';

const TABS: DiscoverTab[] = [
  { kind: 'manga', covers: ['/a.webp', '/b.webp', '/c.webp'] },
  { kind: 'comic', covers: ['/d.webp', '/e.webp'] },
];

@Component({
  imports: [DiscoverTabs],
  template: `<app-discover-tabs [tabs]="tabs" [compact]="compact()" [(kind)]="kind" />`,
})
class Host {
  public readonly tabs = TABS;
  public readonly compact = signal<boolean>(false);
  public readonly kind = signal<ComicKind>('manga');
}

describe('DiscoverTabs', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  const buttons = () =>
    Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'));

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra due bottoni e quello della scheda attiva è premuto', () => {
    expect(buttons().map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
  });

  it('cambia scheda al clic', async () => {
    buttons()[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.kind()).toBe('comic');
    expect(buttons()[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('nella versione compatta ha gli stessi bottoni', async () => {
    fixture.componentInstance.compact.set(true);
    await fixture.whenStable();
    expect(buttons().length).toBe(2);
  });
});
