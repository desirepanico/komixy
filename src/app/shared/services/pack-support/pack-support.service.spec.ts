import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { PackSupportService } from './pack-support.service';

const conMovimentoRidotto = (ridotto: boolean) =>
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: ridotto && query.includes('reduce'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));

describe('PackSupportService', () => {
  it('senza WebGL (come in jsdom) il 3D non è supportato', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    expect(TestBed.inject(PackSupportService).supports3d).toBe(false);
  });

  it('con WebGL e movimento normale il 3D è supportato', () => {
    conMovimentoRidotto(false);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as RenderingContext);
    expect(TestBed.inject(PackSupportService).supports3d).toBe(true);
  });

  it('con "riduci movimento" il 3D non si usa, anche se WebGL c\'è', () => {
    conMovimentoRidotto(true);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as RenderingContext);
    expect(TestBed.inject(PackSupportService).supports3d).toBe(false);
  });
});
