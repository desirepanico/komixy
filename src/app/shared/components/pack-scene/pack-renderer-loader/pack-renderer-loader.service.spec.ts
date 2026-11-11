import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PackRendererLoader } from './pack-renderer-loader.service';

describe('PackRendererLoader', () => {
  let loader: PackRendererLoader;

  beforeEach(() => {
    loader = TestBed.inject(PackRendererLoader);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  });

  it('senza WebGL (come in jsdom) la creazione della scena fallisce', async () => {
    const opzioni = {
      canvas: document.createElement('canvas'),
      mode: 'open' as const,
      count: 3,
      labels: {
        volume: 'Vol.',
        singleVolume: 'Volume Unico',
        tagline: 'BOOSTER',
        editions: { variant: 'a', deluxe: 'b', limited: 'c' },
      },
      logo: null,
      wordmark: null,
      onState: () => {},
      onTearComplete: () => {},
    };
    await expect(loader.create(opzioni)).rejects.toThrow();
  });
});
