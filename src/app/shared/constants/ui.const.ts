import {
  matStarsOutline,
  matAutoStoriesOutline,
  matBookOutline,
  matCalendarTodayOutline,
  matCheckOutline,
  matCloseOutline,
  matFavoriteOutline,
  matFlagOutline,
  matGridViewOutline,
  matHelpOutline,
  matHourglassTopOutline,
  matLayersOutline,
  matLibraryBooksOutline,
  matLocalCafeOutline,
  matMenuBookOutline,
  matRocketLaunchOutline,
  matSearchInsightsOutline,
  matSellOutline,
  matSentimentSatisfiedOutline,
  matShieldOutline,
  matSkullOutline,
  matSmartToyOutline,
  matSportsBasketballOutline,
  matSwordsOutline,
  matTheaterComedyOutline,
  matTravelExploreOutline,
  matTuneOutline,
  matScheduleOutline,
  matRestartAltOutline,
} from '@ng-icons/material-symbols/outline';
import { MessageSeverity } from '@shared/models/message.model';
import { ToastSeverity } from '@shared/models/toast.model';
import { ComicKind } from '../models/comic.model';
import { DiscoverListKey } from '../models/discover-filters.model';
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

export const DISCOVER_YEAR_MIN = 1960;
export const DISCOVER_YEAR_MAX = 2026;

/** I periodi del pannello: «Tutti» è l'intervallo intero, cioè nessun filtro */
export const DISCOVER_ERAS: readonly { id: string; from: number; to: number }[] = [
  { id: 'all', from: DISCOVER_YEAR_MIN, to: DISCOVER_YEAR_MAX },
  { id: 'before1990', from: DISCOVER_YEAR_MIN, to: 1989 },
  { id: 'y1990', from: 1990, to: 1999 },
  { id: 'y2000', from: 2000, to: 2009 },
  { id: 'y2010', from: 2010, to: 2019 },
  { id: 'from2020', from: 2020, to: DISCOVER_YEAR_MAX },
];

// I fumetti non hanno tema narrativo né contenuti per adulti (docs/filtri-fonti-dati.md)
export const DISCOVER_FILTER_OPTIONS: Readonly<
  Record<ComicKind, Readonly<Record<DiscoverListKey, readonly string[]>>>
> = {
  manga: {
    category: ['shonen', 'kodomo', 'shojo', 'seinen', 'josei'],
    format: ['series', 'oneShot'],
    status: ['completed', 'ongoing'],
    volumes: ['v1to5', 'v6to20', 'v21plus'],
    theme: [
      'action',
      'romance',
      'fantasy',
      'sciFi',
      'horror',
      'mystery',
      'comedy',
      'sport',
      'sliceOfLife',
      'isekai',
    ],
  },
  comic: {
    category: ['superheroes', 'sciFi', 'fantasy', 'horror', 'noir', 'historical', 'humor'],
    format: ['series', 'graphicNovel', 'omnibus'],
    status: ['completed', 'ongoing'],
    volumes: ['single', 'v2to5', 'v6to20', 'v21plus'],
    theme: [],
  },
};

/** Icone dei valori: `genre` sono le categorie dei fumetti */
export const DISCOVER_OPTION_ICONS: Readonly<
  Record<'format' | 'status' | 'theme' | 'genre', Readonly<Record<string, string>>>
> = {
  format: {
    series: 'matLibraryBooksOutline',
    oneShot: 'matBookOutline',
    graphicNovel: 'matMenuBookOutline',
    omnibus: 'matLayersOutline',
  },
  status: { completed: 'matFlagOutline', ongoing: 'matAutoStoriesOutline' },
  theme: {
    action: 'matSwordsOutline',
    romance: 'matFavoriteOutline',
    fantasy: 'matStarsOutline',
    sciFi: 'matSmartToyOutline',
    horror: 'matSkullOutline',
    mystery: 'matSearchInsightsOutline',
    comedy: 'matSentimentSatisfiedOutline',
    sport: 'matSportsBasketballOutline',
    sliceOfLife: 'matLocalCafeOutline',
    isekai: 'matTravelExploreOutline',
  },
  genre: {
    superheroes: 'matShieldOutline',
    sciFi: 'matRocketLaunchOutline',
    fantasy: 'matStarsOutline',
    horror: 'matSkullOutline',
    noir: 'matSearchInsightsOutline',
    historical: 'matHourglassTopOutline',
    humor: 'matTheaterComedyOutline',
  },
};

export const DISCOVER_LIST_KEYS: readonly DiscoverListKey[] = [
  'category',
  'format',
  'status',
  'volumes',
  'theme',
];

export const DISCOVER_SEARCH_MAX_RECENTS = 5;
export const DISCOVER_SEARCH_MAX_TITLES = 4;
export const DISCOVER_SEARCH_MAX_AUTHORS = 3;
export const DISCOVER_SEARCH_FEATURED = 4;

/** Le icone usate da Scopri (chip, pannello, schede): un componente le registra con `provideIcons(DISCOVER_ICON_SET)` */
export const DISCOVER_ICON_SET = {
  matStarsOutline,
  matAutoStoriesOutline,
  matBookOutline,
  matCalendarTodayOutline,
  matCheckOutline,
  matCloseOutline,
  matFavoriteOutline,
  matFlagOutline,
  matGridViewOutline,
  matHelpOutline,
  matHourglassTopOutline,
  matLayersOutline,
  matLibraryBooksOutline,
  matLocalCafeOutline,
  matMenuBookOutline,
  matRocketLaunchOutline,
  matSearchInsightsOutline,
  matSellOutline,
  matSentimentSatisfiedOutline,
  matShieldOutline,
  matSkullOutline,
  matSmartToyOutline,
  matSportsBasketballOutline,
  matSwordsOutline,
  matTheaterComedyOutline,
  matTravelExploreOutline,
  matTuneOutline,
  matScheduleOutline,
  matRestartAltOutline,
};

export const DISCOVER_SECTION_ICONS: Readonly<Record<string, string>> = {
  category: 'matMenuBookOutline',
  format: 'matGridViewOutline',
  year: 'matCalendarTodayOutline',
  volumes: 'matLayersOutline',
  status: 'matScheduleOutline',
  theme: 'matSellOutline',
};
