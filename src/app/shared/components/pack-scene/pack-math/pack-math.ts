import { PACK_CAMERA, PACK_GEOMETRY, PACK_LAYOUT, PACK_TEAR } from '../../../constants/ui.const';
import { PackPose } from '../../../models/pack.model';

export type Easing = (t: number) => number;

export const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));

export function smoothstep(from: number, to: number, x: number): number {
  const t = clamp01((x - from) / (to - from));
  return t * t * (3 - 2 * t);
}

export const easeLinear: Easing = (t) => t;
export const easeOutCubic: Easing = (t) => 1 - Math.pow(1 - t, 3);
export const easeInCubic: Easing = (t) => t * t * t;
export const easeInOutCubic: Easing = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutBack: Easing = (t) => {
  const overshoot = 1.70158;
  return 1 + (overshoot + 1) * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
};

export const flatPose = (): PackPose => ({ x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 });

export function lerpPose(from: PackPose, to: PackPose, t: number): PackPose {
  const mix = (a: number, b: number) => a + (b - a) * t;
  return {
    x: mix(from.x, to.x),
    y: mix(from.y, to.y),
    z: mix(from.z, to.z),
    rotX: mix(from.rotX, to.rotX),
    rotY: mix(from.rotY, to.rotY),
    rotZ: mix(from.rotZ, to.rotZ),
    scale: mix(from.scale, to.scale),
  };
}

/** Posizione di una carta nel mazzo coperto: la prima da girare sta sopra */
export function deckPose(index: number, count: number): PackPose {
  return {
    ...flatPose(),
    y: PACK_LAYOUT.deckY,
    z: 1 + (count - 1 - index) * PACK_LAYOUT.deckGap,
    rotY: Math.PI,
    scale: PACK_LAYOUT.deckScale,
  };
}

/** Fila in basso delle carte già girate */
export function slotPose(index: number, count: number): PackPose {
  const centered = index - (count - 1) / 2;
  return {
    ...flatPose(),
    x: centered * PACK_LAYOUT.slotSpacing,
    y: PACK_LAYOUT.slotY,
    z: 0.2 + index * 0.01,
    rotZ: centered * -0.03,
    scale: PACK_LAYOUT.slotScale,
  };
}

/** Ventaglio finale; `fit` rimpicciolisce tutto sugli schermi stretti */
export function fanPose(index: number, count: number, fit: number): PackPose {
  const angle = (index - (count - 1) / 2) * PACK_LAYOUT.fanStep;
  return {
    ...flatPose(),
    x: fit * PACK_LAYOUT.fanRadius * Math.sin(angle),
    y: PACK_LAYOUT.fanPivotY + PACK_LAYOUT.fanRadius * Math.cos(angle) + PACK_LAYOUT.fanLift,
    z: PACK_LAYOUT.fanZ + index * 0.03,
    rotZ: -angle,
    scale: fit,
  };
}

/** Carta scelta dalla raccolta: davanti a tutte, ingrandita */
export function inspectPose(): PackPose {
  return {
    ...flatPose(),
    y: PACK_LAYOUT.deckY,
    z: PACK_LAYOUT.inspectZ,
    scale: PACK_LAYOUT.inspectScale,
  };
}

/** Distanza della camera e riduzione del ventaglio per un dato rapporto larghezza/altezza */
export function cameraFit(aspect: number): { distance: number; fit: number } {
  const distance = PACK_CAMERA.distance / Math.min(1, aspect / PACK_CAMERA.portraitAspect);
  const visibleWidth = PACK_CAMERA.visibleWidthPerUnit * distance * aspect;
  return { distance, fit: Math.min(1, visibleWidth / PACK_CAMERA.fanWidth) };
}

export interface PackProgress {
  intro: number;
  tear: number;
  leave: number;
  clock: number;
}

export function packPose(progress: PackProgress): PackPose {
  const bounce = easeOutBack(progress.intro);
  return {
    x: 0,
    y: -0.15 + (1 - bounce) * -2.2 - progress.leave * 5 + Math.sin(progress.clock * 1.6) * 0.03 * (1 - progress.leave),
    z: 0,
    rotX: 0.08 * progress.intro + 0.22 * smoothstep(0.1, 0.7, progress.tear),
    rotY: (1 - easeOutCubic(progress.intro)) * 1.4,
    rotZ: 0,
    scale: (0.65 + 0.35 * bounce) * (1 - 0.3 * progress.leave),
  };
}

/** Lembo che si stacca: ruota attorno al suo lato destro, cade e svanisce */
export function flapPose(tear: number): { pose: PackPose; opacity: number } {
  const tearY = PACK_GEOMETRY.tearAt * PACK_GEOMETRY.halfHeight;
  return {
    pose: {
      x: PACK_GEOMETRY.halfWidth + 1.3 * tear,
      y: tearY - 3.2 * tear * tear,
      z: 0.3 * tear,
      rotX: 0.8 * tear,
      rotY: 0,
      rotZ: -1.7 * tear,
      scale: 1,
    },
    opacity: 1 - smoothstep(0.8, 1, tear),
  };
}

const wobble = (index: number): number => Math.sin(index * 12.9898) * 0.5;

/** Carta ancora nella busta (coordinate della busta): sale col mazzo, con una piccola imperfezione */
export function stackedCardPose(index: number, count: number, rise: number): PackPose {
  const k = clamp01(rise * 1.3 - index * 0.03);
  return {
    x: wobble(index) * 0.03 * (1 - k),
    y: 0.1 + 2.5 * k,
    z: ((count - 1) / 2 - index) * 0.022,
    rotX: 0,
    rotY: Math.PI,
    rotZ: wobble(index) * 0.02 * (1 - k),
    scale: 1,
  };
}

/** Quanto è aperto lo strappo, dalla distanza trascinata (0 = fermo, 1 = tutta la busta) */
export function tearFromDrag(drag: number): number {
  return (Math.min(drag, PACK_TEAR.threshold) / PACK_TEAR.threshold) * PACK_TEAR.hold;
}

/** Quanto la busta si gonfia in un punto: cuscino nel corpo, piatta alle saldature, con pieghe a fisarmonica nei raccordi */
export function packSurfaceZ(x: number, y: number): number {
  const u = x / PACK_GEOMETRY.halfWidth;
  const v = y / PACK_GEOMETRY.halfHeight;
  const edgeV = Math.abs(v);
  const body = 1 - smoothstep(0.8, 0.9, edgeV);
  let z = 0.34 * body * Math.pow(Math.max(0, 1 - u * u), 0.5) * (0.55 + 0.45 * (1 - v * v));
  const gusset = smoothstep(0.45, 0.78, edgeV) * (1 - smoothstep(0.84, 0.92, edgeV));
  z += gusset * 0.05 * Math.sin(u * 17 + Math.sign(v) * 1.2) * Math.min(1, 0.4 + Math.abs(u));
  z += smoothstep(0.55, 1, Math.abs(u)) * body * 0.018 * Math.sin(v * 26 + u * 5);
  if (edgeV > 0.89 && edgeV < 0.985) z += 0.011 * Math.sin(y * 85);
  return z;
}
