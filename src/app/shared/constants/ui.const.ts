import {
  ComicCategory,
  ComicFormat,
  ComicKind,
  ComicStatus,
  ComicTheme,
} from '@shared/models/catalog-item.model';
import { VolumeBucket, YearEra } from '@shared/models/catalog-filter.model';
import { MessageSeverity } from '@shared/models/message.model';
import { ToastSeverity } from '@shared/models/toast.model';
import { ButtonSeverity, ButtonSize, ButtonVariant } from '../models/button.model';

// ─── Bottoni ─────────────────────────────────────────────────────────────────

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
  // Viola pieno con testo chiaro (primary-600): è il bottone principale del flusso della busta
  accent: {
    filled: 'bg-primary-600 text-surface-50 hover:bg-primary-700',
    outlined: 'border border-primary-400/55 text-primary-300 hover:bg-primary-400/15',
    text: 'text-primary-300 hover:bg-primary-400/15',
  },
};

export const BUTTON_SIZES: Readonly<Record<ButtonSize, string>> = {
  md: 'h-11 px-4 text-base',
  sm: 'h-9 px-4 text-sm',
};

// ─── Avvio ───────────────────────────────────────────────────────────────────

/** Se la prima navigazione non finisce mai, lo skeleton non deve restare per sempre */
export const BOOT_SKELETON_TIMEOUT_MS = 10_000;

// ─── Toast ───────────────────────────────────────────────────────────────────

export const TOAST_MAX_VISIBLE = 3;

/** Gli avvisi che chiedono un'azione restano più a lungo dei messaggi di conferma */
export const TOAST_DURATION_MS: Readonly<Record<ToastSeverity, number>> = {
  success: 4000,
  info: 5000,
  warn: 7000,
  error: 8000,
};

// Sfondo al 10% del colore della severity; bordo, titolo e icona dello stesso colore
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

// ─── Messaggi fissi ──────────────────────────────────────────────────────────

/** Icona predefinita, bordo, sfondo e colore dell'icona di `app-message` */
export const MESSAGE_STYLES: Readonly<
  Record<MessageSeverity, { icon: string; container: string; iconColor: string }>
> = {
  primary: {
    icon: 'matInfoOutline',
    container: 'border-primary-400/30 bg-primary-500/10',
    iconColor: 'text-primary-300',
  },
  info: {
    icon: 'matInfoOutline',
    container: 'border-blue-500/40 bg-blue-500/10',
    iconColor: 'text-blue-400',
  },
  success: {
    icon: 'matCheckCircleOutline',
    container: 'border-green-500/40 bg-green-500/10',
    iconColor: 'text-green-400',
  },
  warn: {
    icon: 'matWarningOutline',
    container: 'border-amber-500/40 bg-amber-500/10',
    iconColor: 'text-amber-400',
  },
  error: {
    icon: 'matErrorOutline',
    container: 'border-red-500/40 bg-red-500/10',
    iconColor: 'text-red-400',
  },
};

// ─── Filtri di Scopri ────────────────────────────────────────────────────────

/** Categorie dei manga e generi dei fumetti, nell'ordine in cui compaiono nel pannello */
export const CATEGORY_OPTIONS: Readonly<Record<ComicKind, readonly ComicCategory[]>> = {
  manga: ['shonen', 'kodomo', 'shojo', 'seinen', 'josei'],
  comic: ['superheroes', 'scifi', 'fantasy', 'horror', 'noir', 'historical', 'humor'],
};

export const FORMAT_OPTIONS: Readonly<Record<ComicKind, readonly ComicFormat[]>> = {
  manga: ['series', 'oneShot'],
  comic: ['series', 'graphicNovel', 'omnibus'],
};

/** Solo i manga hanno il tema narrativo */
export const THEME_OPTIONS: readonly ComicTheme[] = [
  'action',
  'romance',
  'fantasy',
  'scifiMecha',
  'horror',
  'mystery',
  'comedy',
  'sport',
  'sliceOfLife',
  'isekai',
];

export const STATUS_OPTIONS: readonly ComicStatus[] = ['completed', 'ongoing'];

export const VOLUME_OPTIONS: Readonly<Record<ComicKind, readonly VolumeBucket[]>> = {
  manga: ['oneToFive', 'sixToTwenty', 'overTwenty'],
  comic: ['single', 'twoToFive', 'sixToTwenty', 'overTwenty'],
};

export const ERA_OPTIONS: readonly YearEra[] = [
  'all',
  'before1990',
  'nineties',
  'noughties',
  'tens',
  'since2020',
];

/** Anni di uscita compresi (estremi inclusi) di ogni periodo */
export const ERA_RANGES: Readonly<Record<YearEra, readonly [number, number]>> = {
  all: [0, 9999],
  before1990: [0, 1989],
  nineties: [1990, 1999],
  noughties: [2000, 2009],
  tens: [2010, 2019],
  since2020: [2020, 9999],
};

/** Titoli di ogni riga di Scopri (Da dove iniziare, Nuove uscite) e suggerimenti della ricerca */
export const DISCOVER_ROW_SIZE = 8;
export const SEARCH_SUGGESTION_LIMIT = 4;
export const RECENT_SEARCH_LIMIT = 5;

/** Fino a quanti volumi una serie è «da dove iniziare» */
export const STARTER_MAX_VOLUMES = 10;

/** Copertina che si usa finché un titolo non ne ha una vera */
export const COVER_PLACEHOLDER = '/img/covers/placeholder.svg';
