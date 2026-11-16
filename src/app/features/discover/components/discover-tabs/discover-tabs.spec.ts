import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CatalogComic, ComicKind } from '@shared/models/comic.model';
import { DiscoverTabs } from './discover-tabs';

const comic = (id: string, kind: ComicKind, coverUrl: string): CatalogComic => ({
  id,
  kind,
  title: id,
  author: 'Autore',
  volume: 1,
  totalVolumes: null,
  isSingleVolume: true,
  editionType: null,
  coverUrl,
  categories: [],
  themes: [],
  format: 'series',
  year: 2000,
  status: 'completed',
  adult: false,
});

@Component({
  imports: [DiscoverTabs],
  template: `<app-discover-tabs
    [kind]="kind()"
    [comics]="comics"
    [mangaCount]="12"
    [comicCount]="3"
    (kindChange)="kind.set($event)"
  />`,
})
class Host {
  public readonly kind = signal<ComicKind>('manga');
  public readonly comics = [comic('a', 'manga', '/a.webp'), comic('b', 'comic', '')];
}

describe('DiscoverTabs', () => {
  let fixture: ComponentFixture<Host>;
  let html: HTMLElement;
  const tabs = () => Array.from(html.querySelectorAll<HTMLButtonElement>('[role="tab"]'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra le due sezioni con il numero dei titoli', () => {
    expect(tabs().map((t) => t.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'discoverFilters.kind.manga 12 discoverFilters.titles',
      'discoverFilters.kind.comic 3 discoverFilters.titles',
    ]);
  });

  it('solo la sezione scelta è raggiungibile con Tab', () => {
    expect(tabs().map((t) => [t.getAttribute('aria-selected'), t.tabIndex])).toEqual([
      ['true', 0],
      ['false', -1],
    ]);
  });

  it('un clic sceglie la sezione', async () => {
    tabs()[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.kind()).toBe('comic');
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
  });

  it('le frecce cambiano sezione e portano il focus sul tab', async () => {
    tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.kind()).toBe('comic');
    expect(document.activeElement).toBe(tabs()[1]);
  });

  it('Home e Fine vanno alla prima e all’ultima sezione', async () => {
    tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.kind()).toBe('comic');
    tabs()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.kind()).toBe('manga');
  });
});
