import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicKind } from '@shared/models/catalog-item.model';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { DiscoverTab } from '../../models/discover-filters.model';
import { DiscoverDock } from './discover-dock';

@Component({
  imports: [DiscoverDock],
  template: `<app-discover-dock
    [visible]="visible()"
    [tabs]="tabs"
    query=""
    [items]="items"
    [searchIn]="items"
    [activeCount]="2"
    [(kind)]="kind"
    (openFilters)="opened.set(opened() + 1)"
  />`,
})
class Host {
  public readonly tabs: DiscoverTab[] = [
    { kind: 'manga', covers: ['/a.webp'] },
    { kind: 'comic', covers: ['/b.webp'] },
  ];
  public readonly items = TestBed.inject(ComicCatalogService).items();
  public readonly visible = signal<boolean>(false);
  public readonly kind = signal<ComicKind>('manga');
  public readonly opened = signal<number>(0);
}

describe('DiscoverDock', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  const toolbar = () => fixture.nativeElement.querySelector('[role="toolbar"]') as HTMLElement;

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('nascosta non si raggiunge da tastiera (inert)', () => {
    expect(toolbar().hasAttribute('inert')).toBe(true);
  });

  it('visibile si può usare', async () => {
    fixture.componentInstance.visible.set(true);
    await fixture.whenStable();
    expect(toolbar().hasAttribute('inert')).toBe(false);
  });

  it('ha schede, ricerca e filtri, con il numero dei filtri attivi', () => {
    expect(toolbar().querySelectorAll('[aria-pressed]').length).toBe(2);
    expect(toolbar().querySelector('input[role="combobox"]')).toBeTruthy();
    expect(toolbar().textContent).toContain('2');
  });

  it('cambia scheda dalla pillola', async () => {
    toolbar().querySelectorAll<HTMLButtonElement>('[aria-pressed]')[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.kind()).toBe('comic');
  });

  it('apre i filtri', async () => {
    toolbar().querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')?.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.opened()).toBe(1);
  });
});
