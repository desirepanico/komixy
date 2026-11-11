import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicCatalogService } from './comic-catalog.service';

describe('ComicCatalogService', () => {
  let service: ComicCatalogService;

  beforeEach(() => {
    service = TestBed.inject(ComicCatalogService);
  });

  it('ha i manga da scoprire con id diversi', () => {
    const ids = service.toDiscover().map((comic) => comic.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('trova un fumetto da scoprire', () => {
    expect(service.find('d1')?.title).toBe('One Piece');
  });

  it('trova un fumetto della classifica', () => {
    expect(service.find('w3')?.title).toBe('Watchmen');
  });

  it('non trova un id sconosciuto', () => {
    expect(service.find('non-esiste')).toBeUndefined();
  });
});
