import {
  matBookOutline,
  matCalendarMonthOutline,
  matCoffeeOutline,
  matFavoriteOutline,
  matFilterNoneOutline,
  matFlagOutline,
  matGridViewOutline,
  matHelpOutline,
  matHistoryEduOutline,
  matInfoOutline,
  matLayersOutline,
  matLibraryBooksOutline,
  matManageSearchOutline,
  matMenuBookOutline,
  matMoodOutline,
  matAutoStoriesOutline,
  matPersonSearchOutline,
  matPublicOutline,
  matRocketLaunchOutline,
  matScheduleOutline,
  matSellOutline,
  matSentimentSatisfiedOutline,
  matShieldOutline,
  matSkullOutline,
  matSmartToyOutline,
  matSportsBaseballOutline,
  matStarsOutline,
  matSwordsOutline,
} from '@ng-icons/material-symbols/outline';
import {
  ComicCategory,
  ComicFormat,
  ComicKind,
  ComicStatus,
  ComicTheme,
} from '@shared/models/catalog-item.model';
import { DiscoverAvatar, VolumeBucket, YearEra } from '@shared/models/catalog-filter.model';
import { MessageSeverity } from '@shared/models/message.model';
import { ToastSeverity } from '@shared/models/toast.model';
import { ButtonSeverity, ButtonSize, ButtonVariant } from '../models/button.model';

// ─── Bottoni ─────────────────────────────────────────────────────────────────

// Colori presi dai set Severity, Outlined e Text del file Figma "Manga App"
const FILLED_TEXT = 'text-surface-800';
export const BUTTON_COLORS: Readonly<
  Record<ButtonSeverity, Readonly<Record<ButtonVariant, string>>>
> = {
  // Viola pieno (primary-500) con testo scuro, per il contrasto: l'azione principale di una schermata
  primary: {
    filled: 'bg-primary-500 text-primary-950 hover:bg-primary-400',
    outlined: 'border border-primary-400/55 text-primary-300 hover:bg-primary-400/15',
    text: 'text-primary-300 hover:bg-primary-400/15',
  },
  secondary: {
    filled:
      'border border-surface-700 bg-surface-800 text-surface-100 hover:border-surface-600 hover:bg-surface-700',
    outlined:
      'border border-surface-500 text-surface-300 hover:bg-surface-500/25 hover:text-surface-100',
    text: 'text-surface-300 hover:bg-surface-500/25 hover:text-surface-100',
  },
  success: {
    filled: `bg-green-400 ${FILLED_TEXT} hover:bg-green-300`,
    outlined: 'border border-green-400 text-green-300 hover:bg-green-400/15',
    text: 'text-green-300 hover:bg-green-400/15',
  },
  info: {
    filled: `bg-blue-400 ${FILLED_TEXT} hover:bg-blue-300`,
    outlined: 'border border-blue-400 text-blue-300 hover:bg-blue-400/15',
    text: 'text-blue-300 hover:bg-blue-400/15',
  },
  warn: {
    filled: `bg-orange-400 ${FILLED_TEXT} hover:bg-orange-300`,
    outlined: 'border border-orange-400 text-orange-300 hover:bg-orange-400/15',
    text: 'text-orange-300 hover:bg-orange-400/15',
  },
  danger: {
    filled: `bg-rose-400 ${FILLED_TEXT} hover:bg-rose-300`,
    outlined: 'border border-rose-400 text-rose-300 hover:bg-rose-400/15',
    text: 'text-rose-300 hover:bg-rose-400/15',
  },
  contrast: {
    filled: `bg-surface-100 ${FILLED_TEXT} hover:bg-surface-300`,
    outlined: 'border border-surface-100 text-surface-100 hover:bg-surface-100/15',
    text: 'text-surface-100 hover:bg-surface-100/15',
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

/** Durata dell'ingresso della guida (`guide-slide` in tailwind.css): lo scorrimento parte dopo */
export const GUIDE_SLIDE_MS = 450;

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
export const SEARCH_AUTHOR_LIMIT = 3;
export const RECENT_SEARCH_LIMIT = 5;
/** Ricerche di esempio all'avvio, finché la cronologia vera non arriva dal backend */
export const RECENT_SEARCH_SAMPLES: readonly string[] = ['Berserk', 'Alan Moore'];

/** Fino a quanti volumi una serie è «da dove iniziare» */
export const STARTER_MAX_VOLUMES = 10;

/** Copertina che si usa finché un titolo non ne ha una vera */
export const COVER_PLACEHOLDER = '/img/covers/placeholder.svg';

// ─── Personaggi delle categorie (DiceBear, stile Adventurer) ─────────────────

export const DISCOVER_AVATARS: Readonly<Record<string, DiscoverAvatar>> = {
  shonen: {
    face: {
      seed: 'Shonen0',
      hairVariant: 'short05',
      hairColor: '#ffd37a',
      skinColor: '#763900',
      eyesVariant: 'variant12',
      mouthVariant: 'variant05',
      eyebrowsVariant: 'variant03',
    },
    bg: ['#7a3fe0', '#1f004d'],
    suit: '#b89bff',
    sky: 'comet',
    badge: 'star',
  },
  kodomo: {
    face: {
      seed: 'Kodomo0',
      hairProbability: 0,
      skinColor: '#b89bff',
      eyesVariant: 'variant02',
      mouthVariant: 'variant02',
      eyebrowsVariant: 'variant09',
      detailsVariant: 'blush',
      detailsProbability: 100,
    },
    bg: ['#5b3fe0', '#1f004d'],
    suit: '#b89bff',
    sky: 'ringed',
    badge: 'dots',
    extra: 'antennae',
  },
  shojo: {
    face: {
      seed: 'Shojo0',
      hairVariant: 'long10',
      hairColor: '#e9a3ff',
      skinColor: '#9e5622',
      eyesVariant: 'variant09',
      mouthVariant: 'variant04',
      eyebrowsVariant: 'variant09',
      detailsVariant: 'blush',
      detailsProbability: 100,
      earringsVariant: 'variant01',
      earringsProbability: 100,
    },
    bg: ['#d06be0', '#340080'],
    suit: '#e9a3ff',
    sky: 'hearts',
    badge: 'heart',
  },
  seinen: {
    face: {
      seed: 'Seinen1',
      hairVariant: 'short07',
      hairColor: '#afafaf',
      skinColor: '#9e5622',
      eyesVariant: 'variant14',
      mouthVariant: 'variant20',
      eyebrowsVariant: 'variant10',
      detailsVariant: 'mustache',
      detailsProbability: 100,
      glassesVariant: 'variant02',
      glassesProbability: 100,
    },
    bg: ['#3a1a8a', '#0e1017'],
    suit: '#b89bff',
    sky: 'planet',
    badge: 'bars',
  },
  josei: {
    face: {
      seed: 'Josei2',
      hairVariant: 'long20',
      hairColor: '#592454',
      skinColor: '#f2d3b1',
      eyesVariant: 'variant13',
      mouthVariant: 'variant02',
      eyebrowsVariant: 'variant02',
      earringsVariant: 'variant02',
      earringsProbability: 100,
    },
    bg: ['#8455e0', '#1f004d'],
    suit: '#e9a3ff',
    sky: 'sparkle',
    badge: 'cup',
    extra: 'mug',
  },
};

export const DISCOVER_AVATAR_STARS =
  '<circle cx="24" cy="86" r="2" fill="#fff"/><circle cx="176" cy="104" r="2.4" fill="#fff"/><circle cx="96" cy="14" r="2" fill="#fff"/><circle cx="62" cy="30" r="1.5" fill="#e7dbff"/><circle cx="140" cy="150" r="1.8" fill="#fff"/><circle cx="12" cy="120" r="1.5" fill="#e7dbff"/><circle cx="186" cy="62" r="1.5" fill="#fff"/>';

export const DISCOVER_AVATAR_SKY: Readonly<Record<string, string>> = {
  comet:
    '<path d="M176 24 120 74" stroke="#ffd37a" stroke-opacity=".45" stroke-width="10" stroke-linecap="round"/><circle cx="178" cy="22" r="11" fill="#fff4c4"/>',
  ringed:
    '<circle cx="42" cy="46" r="15" fill="#d0bcff"/><ellipse cx="42" cy="46" rx="27" ry="7" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3" transform="rotate(-20 42 46)"/>',
  hearts:
    '<path d="M44 44c-6-9-18-2-11 8l11 10 11-10c7-10-5-17-11-8z" fill="#ffd3ec" fill-opacity=".9"/><path d="M160 60c-4-6-12-1-7 5l7 6 7-6c5-6-3-11-7-5z" fill="#ffd3ec" fill-opacity=".8"/><path d="M168 126c-3-4-9-1-5 4l5 4 5-4c4-5-2-8-5-4z" fill="#ffd3ec" fill-opacity=".7"/>',
  planet:
    '<circle cx="30" cy="150" r="40" fill="#6730c2"/><ellipse cx="30" cy="150" rx="62" ry="12" fill="none" stroke="#d0bcff" stroke-opacity=".6" stroke-width="3" transform="rotate(-18 30 150)"/>',
  sparkle:
    '<path d="M160 30l4.5 12.5L177 47l-12.5 4.5L160 64l-4.5-12.5L143 47l12.5-4.5z" fill="#fff"/><path d="M40 52l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5z" fill="#e7dbff"/>',
};

export const DISCOVER_AVATAR_EXTRA: Readonly<Record<string, string>> = {
  antennae:
    '<path d="M78 66Q70 44 62 36M122 66Q130 44 138 36" fill="none" stroke="#b89bff" stroke-width="5" stroke-linecap="round"/><circle cx="62" cy="34" r="7" fill="#e7dbff"/><circle cx="138" cy="34" r="7" fill="#e7dbff"/>',
  mug: '<g transform="translate(128 140)"><path d="M0 0h26v18a9 9 0 0 1-9 9H9a9 9 0 0 1-9-9z" fill="#fff"/><path d="M26 6h4a5 5 0 0 1 0 10h-4" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M8-6q-3-5 0-9M17-6q-3-5 0-9" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2.5" stroke-linecap="round"/></g>',
};

export const DISCOVER_AVATAR_BADGE: Readonly<Record<string, string>> = {
  star: '<path d="M100 178l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill="#1f004d"/>',
  heart:
    '<path d="M100 192c-8-6-9-9-9-12a4.6 4.6 0 0 1 9-1 4.6 4.6 0 0 1 9 1c0 3-1 6-9 12z" fill="#7a0f4d"/>',
  bars: '<path d="M91 182h18M91 187h18M91 192h18" stroke="#1f004d" stroke-width="3" stroke-linecap="round"/>',
  dots: '<circle cx="93" cy="186" r="3" fill="#1f004d"/><circle cx="107" cy="186" r="3" fill="#1f004d"/><circle cx="100" cy="193" r="3" fill="#1f004d"/>',
  cup: '<path d="M91 182h18l-2 12h-14z" fill="#1f004d"/>',
};

export const DISCOVER_ADULT_AGE = 18;

// ─── Icone dei filtri di Scopri ──────────────────────────────────────────────

export const DISCOVER_ICON_SET = {
  matBookOutline,
  matCalendarMonthOutline,
  matCoffeeOutline,
  matFavoriteOutline,
  matFilterNoneOutline,
  matFlagOutline,
  matGridViewOutline,
  matHelpOutline,
  matHistoryEduOutline,
  matInfoOutline,
  matLayersOutline,
  matLibraryBooksOutline,
  matManageSearchOutline,
  matMenuBookOutline,
  matMoodOutline,
  matAutoStoriesOutline,
  matPersonSearchOutline,
  matPublicOutline,
  matRocketLaunchOutline,
  matScheduleOutline,
  matSellOutline,
  matSentimentSatisfiedOutline,
  matShieldOutline,
  matSkullOutline,
  matSmartToyOutline,
  matSportsBaseballOutline,
  matStarsOutline,
  matSwordsOutline,
};

/** L'icona di ogni gruppo di filtri, nell'intestazione del pannello e nei chip */
export const DISCOVER_FACET_ICONS: Readonly<Record<string, string>> = {
  categories: 'matMenuBookOutline',
  formats: 'matGridViewOutline',
  statuses: 'matScheduleOutline',
  era: 'matCalendarMonthOutline',
  volumes: 'matLayersOutline',
  themes: 'matSellOutline',
};

/** L'icona dei valori che ne hanno una (i generi dei fumetti, i formati, lo stato e i temi) */
export const DISCOVER_OPTION_ICONS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  categories: {
    superheroes: 'matShieldOutline',
    scifi: 'matRocketLaunchOutline',
    fantasy: 'matStarsOutline',
    horror: 'matSkullOutline',
    noir: 'matPersonSearchOutline',
    historical: 'matHistoryEduOutline',
    humor: 'matMoodOutline',
  },
  formats: {
    series: 'matFilterNoneOutline',
    oneShot: 'matBookOutline',
    graphicNovel: 'matMenuBookOutline',
    omnibus: 'matLibraryBooksOutline',
  },
  statuses: { completed: 'matFlagOutline', ongoing: 'matAutoStoriesOutline' },
  themes: {
    action: 'matSwordsOutline',
    romance: 'matFavoriteOutline',
    fantasy: 'matStarsOutline',
    scifiMecha: 'matSmartToyOutline',
    horror: 'matSkullOutline',
    mystery: 'matManageSearchOutline',
    comedy: 'matSentimentSatisfiedOutline',
    sport: 'matSportsBaseballOutline',
    sliceOfLife: 'matCoffeeOutline',
    isekai: 'matPublicOutline',
  },
};
