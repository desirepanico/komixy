import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CatalogComic } from '@shared/models/comic.model';
import { RecentSearchesService } from '../../services/recent-searches/recent-searches.service';
import { DiscoverSearch } from './discover-search';

const comic = (id: string, title: string, author: string): CatalogComic => ({
  id,
  kind: 'manga',
  title,
  author,
  volume: 1,
  totalVolumes: null,
  isSingleVolume: true,
  editionType: null,
  coverUrl: '',
  categories: [],
  themes: [],
  format: 'series',
  year: 2000,
  status: 'completed',
  adult: false,
});

@Component({
  imports: [DiscoverSearch],
  template: `<app-discover-search
    [value]="value()"
    kind="manga"
    [comics]="comics"
    (searchChange)="value.set($event)"
  />`,
})
class Host {
  public readonly value = signal<string>('');
  public readonly comics = [
    comic('a', 'One Piece', 'Eiichiro Oda'),
    comic('b', 'Berserk', 'Kentaro Miura'),
    comic('c', 'Vagabond', 'Takehiko Inoue, Eiichiro Oda'),
  ];
}

describe('DiscoverSearch', () => {
  let fixture: ComponentFixture<Host>;
  let html: HTMLElement;
  const input = () => html.querySelector<HTMLInputElement>('input')!;
  const options = () => Array.from(html.querySelectorAll('[role="option"]'));
  const key = async (name: string) => {
    input().dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }));
    await fixture.whenStable();
  };
  const type = async (text: string) => {
    input().value = text;
    input().dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('è un combobox chiuso finché non si entra nel campo', () => {
    expect(input().getAttribute('role')).toBe('combobox');
    expect(input().getAttribute('aria-expanded')).toBe('false');
    expect(options()).toHaveLength(0);
  });

  it('al focus propone i volumi più amati', async () => {
    input().dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    expect(input().getAttribute('aria-expanded')).toBe('true');
    expect(options()).toHaveLength(3);
  });

  it('scrivendo propone titoli e autori e avvisa la pagina', async () => {
    await type('oda');
    expect(fixture.componentInstance.value()).toBe('oda');
    expect(options().map((o) => o.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Eiichiro Oda discoverFilters.search.volumesCount',
    ]);
  });

  it('le frecce scelgono un suggerimento e Invio lo applica e lo ricorda', async () => {
    await type('b');
    await key('ArrowDown');
    expect(input().getAttribute('aria-activedescendant')).toBe('discover-search-option-0');
    await key('Enter');
    expect(fixture.componentInstance.value()).toBe('Berserk');
    expect(TestBed.inject(RecentSearchesService).items()).toEqual(['Berserk']);
    expect(input().getAttribute('aria-expanded')).toBe('false');
  });

  it('Esc chiude i suggerimenti e poi svuota la ricerca', async () => {
    await type('one');
    await key('Escape');
    expect(input().getAttribute('aria-expanded')).toBe('false');
    await key('Escape');
    expect(fixture.componentInstance.value()).toBe('');
  });

  it('Canc toglie una ricerca recente scelta con le frecce', async () => {
    TestBed.inject(RecentSearchesService).add('Maus');
    input().dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    await key('ArrowDown');
    await key('Delete');
    expect(TestBed.inject(RecentSearchesService).items()).toEqual([]);
  });

  it('Ctrl K porta il focus sulla ricerca', async () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(input());
  });

  it('il pulsante svuota la ricerca', async () => {
    await type('one');
    html
      .querySelector<HTMLButtonElement>('button[aria-label="discoverFilters.search.clear"]')!
      .click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe('');
  });
});
