import { describe, expect, it } from 'vitest';
import { PackFlow } from './pack-flow';

const finoAlMazzo = (flow: PackFlow) => {
  flow.introDone();
  flow.tear();
  flow.tearDone();
  flow.deckReady();
};

describe('PackFlow', () => {
  it("nel rito parte dall'introduzione, senza carte girate", () => {
    const flow = new PackFlow(3, 'open');
    expect(flow.snapshot()).toEqual({ phase: 'intro', revealed: 0, focus: null });
  });

  it('in revisione parte dalla raccolta completa', () => {
    const flow = new PackFlow(3, 'review');
    expect(flow.snapshot()).toEqual({ phase: 'collection', revealed: 3, focus: null });
  });

  it('non si strappa la busta prima della fine dell’introduzione', () => {
    const flow = new PackFlow(3, 'open');
    expect(flow.tear()).toBe(false);
    flow.introDone();
    expect(flow.tear()).toBe(true);
    expect(flow.phase).toBe('tearing');
  });

  it('non si gira una carta prima che la busta sia aperta', () => {
    const flow = new PackFlow(3, 'open');
    flow.introDone();
    flow.tear();
    expect(flow.flip()).toBe(false);
  });

  it('girando una carta questa va in primo piano', () => {
    const flow = new PackFlow(3, 'open');
    finoAlMazzo(flow);
    expect(flow.flip()).toBe(true);
    expect(flow.focusIndex).toBe(0);
    expect(flow.shown()).toBe(true);
    expect(flow.phase).toBe('shown');
  });

  it('una carta non si mette da parte se non è stata girata', () => {
    const flow = new PackFlow(3, 'open');
    finoAlMazzo(flow);
    expect(flow.collect()).toBe(false);
  });

  it('dopo ogni carta si torna al mazzo e la prossima è quella dopo', () => {
    const flow = new PackFlow(3, 'open');
    finoAlMazzo(flow);
    flow.flip();
    flow.shown();
    flow.collect();
    expect(flow.collected()).toBe(true);
    expect(flow.phase).toBe('deck');
    expect(flow.nextIndex).toBe(1);
    expect(flow.focusIndex).toBeNull();
  });

  it('dopo l’ultima carta arriva il ventaglio e poi la raccolta', () => {
    const flow = new PackFlow(2, 'open');
    finoAlMazzo(flow);
    for (let i = 0; i < 2; i++) {
      flow.flip();
      flow.shown();
      flow.collect();
      flow.collected();
    }
    expect(flow.phase).toBe('finale');
    expect(flow.snapshot().revealed).toBe(2);
    expect(flow.finaleDone()).toBe(true);
    expect(flow.phase).toBe('collection');
  });

  it('nella raccolta si può scegliere una carta e tornare indietro', () => {
    const flow = new PackFlow(5, 'review');
    expect(flow.inspect(3)).toBe(true);
    expect(flow.phase).toBe('inspecting');
    expect(flow.focusIndex).toBe(3);
    expect(flow.closeInspect()).toBe(true);
    expect(flow.phase).toBe('collection');
    expect(flow.focusIndex).toBeNull();
  });

  it('non si sceglie una carta che non esiste', () => {
    const flow = new PackFlow(5, 'review');
    expect(flow.inspect(-1)).toBe(false);
    expect(flow.inspect(5)).toBe(false);
  });

  it('non si sceglie una carta mentre si gira il mazzo', () => {
    const flow = new PackFlow(5, 'open');
    finoAlMazzo(flow);
    expect(flow.inspect(0)).toBe(false);
  });

  it('reset riporta al punto di partenza della modalità', () => {
    const flow = new PackFlow(5, 'open');
    finoAlMazzo(flow);
    flow.flip();
    flow.reset();
    expect(flow.snapshot()).toEqual({ phase: 'intro', revealed: 0, focus: null });
  });
});
