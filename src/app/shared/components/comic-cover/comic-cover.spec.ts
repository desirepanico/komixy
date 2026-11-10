import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicCover } from './comic-cover';

@Component({
  imports: [ComicCover],
  template: `<app-comic-cover src="/cover.jpg" title="One Piece" />`,
})
class Host {}

describe('ComicCover', () => {
  let fixture: ComponentFixture<Host>;
  const html = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('mostra lo skeleton finché l’immagine è in attesa', () => {
    expect(html().querySelector('app-skeleton')).not.toBeNull();
    expect(html().querySelector('img')).not.toBeNull();
  });

  it('toglie lo skeleton quando l’immagine è caricata', async () => {
    html().querySelector('img')?.dispatchEvent(new Event('load'));
    await fixture.whenStable();
    expect(html().querySelector('app-skeleton')).toBeNull();
    expect(html().querySelector('[role="img"]')).toBeNull();
  });

  it('mostra il segnaposto con il nome accessibile se l’immagine non carica', async () => {
    html().querySelector('img')?.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(html().querySelector('app-skeleton')).toBeNull();
    expect(html().querySelector('img')).toBeNull();
    expect(html().querySelector('[role="img"]')?.getAttribute('aria-label')).toBe(
      'mangaCard.coverUnavailable',
    );
  });
});
