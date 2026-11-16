import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { CatalogItem } from '@shared/models/catalog-item.model';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { DiscoverRow } from './discover-row';

@Component({
  imports: [DiscoverRow],
  template: `<app-discover-row
    title="Titolo"
    subtitle="Sotto"
    [count]="count()"
    [items]="items"
    [grid]="grid()"
  />`,
})
class Host {
  public readonly items: CatalogItem[] = TestBed.inject(ComicCatalogService).items().slice(0, 3);
  public readonly grid = signal<boolean>(false);
  public readonly count = signal<number | null>(null);
}

describe('DiscoverRow', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('senza `count` non mostra il numero, con `count` lo mostra accanto al titolo', async () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2 span')).toBeNull();
    fixture.componentInstance.count.set(3);
    await fixture.whenStable();
    expect(el.querySelector('h2 span')?.textContent?.trim()).toBe('discover.rows.count');
  });

  it('mostra titolo, sottotitolo e una card per volume', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2')?.textContent?.trim()).toBe('Titolo');
    expect(el.textContent).toContain('Sotto');
    expect(el.querySelectorAll('app-comic-card').length).toBe(3);
  });

  it('in griglia usa una lista con nome', async () => {
    fixture.componentInstance.grid.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('ul')?.getAttribute('aria-label')).toBe('Titolo');
  });
});
