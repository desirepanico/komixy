import { ToastSeverity } from '../models/toast.model';
import { ButtonSeverity, ButtonVariant } from '../models/button.model';
import { EditionType } from '../models/comic.model';

// Colori presi dai set Severity, Outlined e Text del file Figma "Manga App"
const FILLED_TEXT = 'text-surface-800';
export const BUTTON_COLORS: Readonly<
  Record<ButtonSeverity, Readonly<Record<ButtonVariant, string>>>
> = {
  primary: {
    filled: `bg-primary-300 ${FILLED_TEXT} hover:bg-primary-500`,
    outlined: 'border border-primary-400 text-primary-300 hover:bg-primary-400/15',
    text: 'text-primary-300 hover:bg-primary-400/15',
  },
  secondary: {
    filled:
      'border border-surface-700 bg-surface-800 text-primary-300 hover:border-surface-600 hover:bg-surface-700',
    outlined: 'border border-surface-600 text-surface-400 hover:bg-surface-600/15',
    text: 'text-surface-400 hover:bg-surface-600/15',
  },
  success: {
    filled: `bg-green-400 ${FILLED_TEXT} hover:bg-green-300`,
    outlined: 'border border-green-400 text-green-400 hover:bg-green-400/15',
    text: 'text-green-400 hover:bg-green-400/15',
  },
  info: {
    filled: `bg-blue-400 ${FILLED_TEXT} hover:bg-sky-300`,
    outlined: 'border border-blue-400 text-blue-400 hover:bg-blue-400/15',
    text: 'text-blue-400 hover:bg-blue-400/15',
  },
  warn: {
    filled: `bg-orange-400 ${FILLED_TEXT} hover:bg-orange-300`,
    outlined: 'border border-orange-300 text-orange-300 hover:bg-orange-300/15',
    text: 'text-orange-300 hover:bg-orange-300/15',
  },
  danger: {
    filled: `bg-rose-400 ${FILLED_TEXT} hover:bg-rose-300`,
    outlined: 'border border-rose-300 text-rose-300 hover:bg-rose-300/15',
    text: 'text-red-400 hover:bg-red-400/15',
  },
  contrast: {
    filled: `bg-surface-100 ${FILLED_TEXT} hover:bg-surface-300`,
    outlined: 'border border-surface-100 text-surface-100 hover:bg-surface-100/15',
    text: 'text-surface-100 hover:bg-surface-100/15',
  },
};

/** Se la prima navigazione non finisce mai, lo skeleton non deve restare per sempre */
export const BOOT_SKELETON_TIMEOUT_MS = 10_000;

export const TOAST_MAX_VISIBLE = 3;

/** Gli avvisi che chiedono un'azione restano più a lungo dei messaggi di conferma */
export const TOAST_DURATION_MS: Readonly<Record<ToastSeverity, number>> = {
  success: 4000,
  info: 5000,
  warn: 7000,
  error: 8000,
};

// Sfondo molto trasparente (10%) del colore della severity, con bordo, titolo, icona e chiusura dello stesso colore
export const TOAST_STYLES: Readonly<Record<ToastSeverity, { icon: string; container: string }>> = {
  success: {
    icon: 'matCheckCircleOutline',
    container: 'border-green-500/40 bg-green-500/10 text-green-400',
  },
  info: {
    icon: 'matInfoOutline',
    container: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  },
  warn: {
    icon: 'matWarningOutline',
    container: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  },
  error: {
    icon: 'matErrorOutline',
    container: 'border-red-500/40 bg-red-500/10 text-red-400',
  },
};

/** Solo l'edizione limitata si evidenzia in viola; deluxe, variant e nessuna edizione restano neutre */
export const EDITION_SEVERITY: Readonly<Record<EditionType | 'none', 'primary' | 'secondary'>> = {
  limited: 'primary',
  deluxe: 'secondary',
  variant: 'secondary',
  none: 'secondary',
};

// Busta settimanale: la scena 3D usa unità della scena e secondi
export const PACK_GEOMETRY = {
  halfWidth: 1,
  halfHeight: 1.8,
  /** Altezza dello strappo, come frazione della mezza altezza */
  tearAt: 0.78,
  cardWidth: 1.4,
  cardHeight: 2.304,
  segmentsX: 90,
  segmentsY: 240,
  seamTeeth: 15,
} as const;

export const PACK_CAMERA = {
  fov: 32,
  distance: 12.5,
  /** Sotto questo rapporto larghezza/altezza la camera si allontana per far stare le carte */
  portraitAspect: 0.62,
  /** Larghezza visibile = questo valore × distanza × rapporto */
  visibleWidthPerUnit: 0.573,
  fanWidth: 7,
} as const;

export const PACK_TIMING = {
  intro: 1,
  tear: 0.6,
  tearFinish: 0.5,
  tearPause: 0.15,
  rise: 1.1,
  toDeck: 0.9,
  leave: 1,
  flip: 0.85,
  collect: 0.65,
  finale: 0.9,
  finaleStagger: 0.06,
  inspect: 0.5,
} as const;

export const PACK_LAYOUT = {
  deckY: 0.95,
  deckScale: 1.5,
  deckGap: 0.012,
  inspectZ: 2.2,
  inspectScale: 1.5,
  slotY: -1.5,
  slotSpacing: 0.4,
  slotScale: 0.3,
  fanStep: 0.17,
  fanRadius: 2.65,
  fanPivotY: -1.45,
  fanLift: 0.35,
  fanZ: 0.6,
} as const;

/** Quanto si trascina (in larghezze di busta) per completare lo strappo, e fino a dove arriva mentre si trascina */
export const PACK_TEAR = { threshold: 0.85, hold: 0.72 } as const;

/** Variabili CSS del tema da cui la scena prende i colori, così restano quelle dei token */
export const PACK_THEME_TOKENS = {
  primary200: '--color-primary-200',
  primary300: '--color-primary-300',
  primary400: '--color-primary-400',
  primary500: '--color-primary-500',
  primary700: '--color-primary-700',
  primary800: '--color-primary-800',
  primary900: '--color-primary-900',
  primary950: '--color-primary-950',
  surface50: '--color-surface-50',
  surface200: '--color-surface-200',
  surface400: '--color-surface-400',
  surface500: '--color-surface-500',
  surface700: '--color-surface-700',
  surface900: '--color-surface-900',
  surface950: '--color-surface-950',
} as const;

export const PACK_ASSETS = {
  logo: '/img/logo/komixy-logo.png',
  wordmark: '/img/logo/komixy-logo-wordmark.png',
  sealed: '/img/pack/pack-sealed.webp',
  opened: '/img/pack/pack-opened.webp',
} as const;

export const WEEKLY_PACK_STORAGE_KEY = 'komixy.weeklyPack';
export const RANKING_VIEW_STORAGE_KEY = 'komixy.rankingView';

/** Dimensioni in pixel delle texture disegnate su canvas */
export const PACK_TEXTURE = {
  packWidth: 1024,
  packHeight: 1843,
  cardWidth: 480,
  cardHeight: 790,
  maskWidth: 512,
  maskHeight: 922,
  glowSize: 256,
} as const;

/** Colori dei token, usati solo se la variabile CSS non è leggibile (es. nei test) */
export const PACK_FALLBACK_PALETTE = {
  primary200: '#e7dbff',
  primary300: '#d0bcff',
  primary400: '#b89bff',
  primary500: '#a078ff',
  primary700: '#6730c2',
  primary800: '#4d109e',
  primary900: '#340080',
  primary950: '#1f004d',
  surface50: '#fafafc',
  surface200: '#e9e9ee',
  surface400: '#b8b8c6',
  surface500: '#8e8fa3',
  surface700: '#494454',
  surface900: '#1b1f2d',
  surface950: '#0e1017',
} as const;
