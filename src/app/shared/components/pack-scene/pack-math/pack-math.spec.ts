import { describe, expect, it } from 'vitest';
import { PACK_LAYOUT, PACK_TEAR } from '../../../constants/ui.const';
import {
  cameraFit,
  clamp01,
  deckPose,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  fanPose,
  flapPose,
  flatPose,
  inspectPose,
  lerpPose,
  packPose,
  packSurfaceZ,
  slotPose,
  smoothstep,
  stackedCardPose,
  tearFromDrag,
} from './pack-math';

describe('clamp01 e smoothstep', () => {
  it('clamp01 tiene i valori tra 0 e 1', () => {
    expect([clamp01(-3), clamp01(0.4), clamp01(9)]).toEqual([0, 0.4, 1]);
  });

  it('smoothstep vale 0 prima, 1 dopo e 0.5 a metà', () => {
    expect(smoothstep(2, 4, 1)).toBe(0);
    expect(smoothstep(2, 4, 5)).toBe(1);
    expect(smoothstep(2, 4, 3)).toBe(0.5);
  });
});

describe('easing', () => {
  it('partono da 0 e arrivano a 1', () => {
    for (const ease of [easeOutCubic, easeInCubic, easeInOutCubic, easeOutBack]) {
      expect(ease(0)).toBeCloseTo(0, 5);
      expect(ease(1)).toBeCloseTo(1, 5);
    }
  });

  it('easeOutBack supera 1 prima di fermarsi', () => {
    expect(easeOutBack(0.8)).toBeGreaterThan(1);
  });

  it('easeInOutCubic è simmetrica rispetto al centro', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 5);
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1, 5);
  });
});

describe('lerpPose', () => {
  it('a metà strada ogni valore è la media', () => {
    const a = { ...flatPose(), x: 0, scale: 1 };
    const b = { ...flatPose(), x: 4, scale: 3 };
    expect(lerpPose(a, b, 0.5)).toMatchObject({ x: 2, scale: 2 });
  });
});

describe('posizioni delle carte', () => {
  it('nel mazzo la prima carta sta sopra le altre e tutte sono coperte', () => {
    expect(deckPose(0, 10).z).toBeGreaterThan(deckPose(9, 10).z);
    expect(deckPose(3, 10).rotY).toBeCloseTo(Math.PI, 5);
  });

  it('la fila in basso è simmetrica e ordinata da sinistra a destra', () => {
    expect(slotPose(0, 10).x).toBeCloseTo(-slotPose(9, 10).x, 5);
    expect(slotPose(1, 10).x).toBeGreaterThan(slotPose(0, 10).x);
    expect(slotPose(0, 10).y).toBe(PACK_LAYOUT.slotY);
  });

  it('il ventaglio è simmetrico, la carta centrale è la più alta e quelle a destra stanno sopra', () => {
    const sinistra = fanPose(0, 10, 1);
    const destra = fanPose(9, 10, 1);
    expect(sinistra.x).toBeCloseTo(-destra.x, 5);
    expect(sinistra.rotZ).toBeCloseTo(-destra.rotZ, 5);
    expect(fanPose(4, 10, 1).y).toBeGreaterThan(sinistra.y);
    expect(destra.z).toBeGreaterThan(sinistra.z);
  });

  it('il ventaglio si stringe con il fattore di adattamento', () => {
    expect(fanPose(9, 10, 0.5).x).toBeCloseTo(fanPose(9, 10, 1).x / 2, 5);
    expect(fanPose(9, 10, 0.5).scale).toBe(0.5);
  });

  it('la carta scelta sta davanti a tutte', () => {
    expect(inspectPose().z).toBeGreaterThan(deckPose(0, 10).z);
    expect(inspectPose().rotY).toBe(0);
  });
});

describe('cameraFit', () => {
  it('su schermo largo la camera sta alla distanza base e il ventaglio non si riduce', () => {
    expect(cameraFit(1.6)).toEqual({ distance: 12.5, fit: 1 });
  });

  it('su schermo stretto la camera si allontana e il ventaglio si riduce', () => {
    const stretto = cameraFit(0.5);
    expect(stretto.distance).toBeGreaterThan(12.5);
    expect(stretto.fit).toBeLessThan(1);
  });
});

describe('packPose', () => {
  const ferma = { intro: 1, tear: 0, leave: 0, clock: 0 };

  it('a introduzione finita la busta è a scala piena e dritta', () => {
    const posa = packPose(ferma);
    expect(posa.scale).toBeCloseTo(1, 5);
    expect(posa.rotY).toBeCloseTo(0, 5);
  });

  it('allo strappo la busta si inclina in avanti', () => {
    expect(packPose({ ...ferma, tear: 1 }).rotX).toBeGreaterThan(packPose(ferma).rotX);
  });

  it('uscendo scende e si rimpicciolisce', () => {
    const via = packPose({ ...ferma, leave: 1 });
    expect(via.y).toBeLessThan(packPose(ferma).y);
    expect(via.scale).toBeLessThan(1);
  });
});

describe('flapPose', () => {
  it('prima dello strappo il lembo è fermo e opaco', () => {
    const { pose, opacity } = flapPose(0);
    expect(pose.rotZ).toBeCloseTo(0, 5);
    expect(opacity).toBe(1);
  });

  it('a strappo finito il lembo è ruotato, caduto e invisibile', () => {
    const { pose, opacity } = flapPose(1);
    expect(pose.rotZ).toBeLessThan(-1);
    expect(opacity).toBe(0);
  });
});

describe('stackedCardPose', () => {
  it('dentro la busta le carte sono coperte e a riposo in basso', () => {
    const posa = stackedCardPose(0, 10, 0);
    expect(posa.rotY).toBeCloseTo(Math.PI, 5);
    expect(posa.y).toBeCloseTo(0.1, 5);
  });

  it('salendo, la prima carta parte prima delle altre', () => {
    expect(stackedCardPose(0, 10, 0.3).y).toBeGreaterThan(stackedCardPose(9, 10, 0.3).y);
  });

  it('a salita finita tutte le carte sono alla stessa altezza e senza imperfezioni', () => {
    const prima = stackedCardPose(0, 10, 1);
    const ultima = stackedCardPose(9, 10, 1);
    expect(prima.y).toBeCloseTo(ultima.y, 5);
    expect(prima.x).toBeCloseTo(0, 5);
  });
});

describe('tearFromDrag', () => {
  it('senza trascinare lo strappo è chiuso', () => {
    expect(tearFromDrag(0)).toBe(0);
  });

  it('alla soglia arriva al punto in cui lo strappo si completa da solo', () => {
    expect(tearFromDrag(PACK_TEAR.threshold)).toBeCloseTo(PACK_TEAR.hold, 5);
  });

  it('oltre la soglia non va più avanti', () => {
    expect(tearFromDrag(5)).toBeCloseTo(PACK_TEAR.hold, 5);
  });
});

describe('packSurfaceZ', () => {
  it('al centro del corpo la busta è gonfia', () => {
    expect(packSurfaceZ(0, 0)).toBeGreaterThan(0.25);
  });

  it('ai lati si appiattisce', () => {
    expect(Math.abs(packSurfaceZ(1, 0))).toBeLessThan(0.02);
    expect(Math.abs(packSurfaceZ(-1, 0))).toBeLessThan(0.02);
  });

  it('nelle saldature resta quasi piatta', () => {
    expect(Math.abs(packSurfaceZ(0, 1.78))).toBeLessThan(0.02);
    expect(Math.abs(packSurfaceZ(0, -1.78))).toBeLessThan(0.02);
  });

  it('è più gonfia al centro che a metà del corpo', () => {
    expect(packSurfaceZ(0, 0)).toBeGreaterThan(packSurfaceZ(0, 1.2));
  });
});
