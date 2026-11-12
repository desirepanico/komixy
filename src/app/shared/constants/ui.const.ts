import { MessageSeverity } from '@shared/models/message.model';
import { ToastSeverity } from '@shared/models/toast.model';
import { ButtonSeverity, ButtonSize, ButtonVariant } from '../models/button.model';

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

/** Stile di un messaggio fisso (`app-message`): icona predefinita, bordo e sfondo al 10%, colore dell'icona */
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

/** Dove si ricorda la settimana della busta già aperta (TODO: lo registra il server per utente o ospite) */
export const WEEKLY_PACK_STORAGE_KEY = 'komixy.weeklyPack';

/** La settimana della busta comincia il lunedì, ora italiana */
export const WEEKLY_PACK_TIME_ZONE = 'Europe/Rome';

/** Quanto bisogna trascinare la busta verso destra per strapparla */
export const PACK_TEAR_DISTANCE_PX = 140;

/** Misure di una carta a grandezza naturale: si scala con `scale` di `app-pack-card` */
export const PACK_CARD_WIDTH_PX = 192;
export const PACK_CARD_HEIGHT_PX = 320;
/** Spazio tra la carta in primo piano e ciò che sta sotto, e scala minima a cui si rimpicciolisce per non scrollare */
export const SPOTLIGHT_GAP_PX = 20;
export const SPOTLIGHT_MIN_SCALE = 0.6;
/** Da questa larghezza (tablet e desktop) la carta in primo piano può crescere fino a `SPOTLIGHT_MAX_SCALE` */
export const SPOTLIGHT_GROW_FROM_PX = 640;
export const SPOTLIGHT_MAX_SCALE = 1.3;
/** Sotto questa scala i testi della carta non si leggono: si mostrano la copertina e un numero di posizione grande */
export const PACK_CARD_COMPACT_BELOW = 0.7;

/** Apertura totale del ventaglio, dalla carta più a sinistra a quella più a destra */
export const CARD_FAN_SPREAD_DEG = 100;
/** Il ventaglio a grandezza base (telefono) misura 384×224 px con carte a scala 0,42; cresce con la larghezza fino a 2,2 volte */
export const CARD_FAN_BASE_SCALE = 0.42;
export const CARD_FAN_BASE_WIDTH_PX = 384;
export const CARD_FAN_BASE_HEIGHT_PX = 224;
export const CARD_FAN_BASE_TOP_PX = 24;
export const CARD_FAN_MAX_GROWTH = 2.2;
/** Il ventaglio si rimpicciolisce con la larghezza del suo contenitore, fino a questa scala */
export const CARD_FAN_MIN_GROWTH = 0.5;
/** Sotto questa larghezza del contenitore il ventaglio si rimpicciolisce; sopra, sui telefoni, resta alla grandezza base */
export const CARD_FAN_SHRINK_BELOW_PX = 320;
/** Larghezza del contenitore da cui il ventaglio comincia a crescere: sotto, resta a grandezza base */
export const CARD_FAN_GROW_FROM_PX = 430;

/** Pannello «Top» accanto alla busta aperta in Scopri: le carte della classifica (al massimo 10) che stanno intere nella larghezza */
export const WEEKLY_TOP_COUNT = 10;
/** Scala delle carte nel pannello (96×160 px) e distanza tra loro */
export const WEEKLY_TOP_CARD_SCALE = 0.5;
/** Larghezza di una carta del pannello, già ridotta dalla scala */
export const WEEKLY_TOP_CARD_WIDTH_PX = PACK_CARD_WIDTH_PX * WEEKLY_TOP_CARD_SCALE;
export const WEEKLY_TOP_GAP_PX = 12;
/** Carte mostrate finché la larghezza del pannello non è stata misurata */
export const WEEKLY_TOP_INITIAL_COUNT = 3;
/** Bordo e spaziatura interna del pannello, per calcolarne la larghezza massima */
export const WEEKLY_TOP_FRAME_PX = 34;

/** Logo di Komixy, sul dorso delle carte */
export const LOGO_URL = '/img/logo/komixy-logo.png';

export const PACK_IMAGE_URL = '/img/pack/booster.webp';

/** Il lembo che si strappa è l'11% in alto dell'immagine della busta */
export const PACK_STRIP_RATIO = 0.11;

/** Bordi a dente di sega della busta strappata: del corpo (in alto) e del lembo (in basso) */
export const PACK_BODY_CLIP =
  'polygon(0.0% 0%,3.57% 1.6%,7.14% 0%,10.71% 1.6%,14.29% 0%,17.86% 1.6%,21.43% 0%,25.0% 1.6%,28.57% 0%,32.14% 1.6%,35.71% 0%,39.29% 1.6%,42.86% 0%,46.43% 1.6%,50.0% 0%,53.57% 1.6%,57.14% 0%,60.71% 1.6%,64.29% 0%,67.86% 1.6%,71.43% 0%,75.0% 1.6%,78.57% 0%,82.14% 1.6%,85.71% 0%,89.29% 1.6%,92.86% 0%,96.43% 1.6%,100.0% 0%,100% 100%,0 100%)';
export const PACK_STRIP_CLIP =
  'polygon(0 0,100% 0,100.0% 100%,96.43% 88%,92.86% 100%,89.29% 88%,85.71% 100%,82.14% 88%,78.57% 100%,75.0% 88%,71.43% 100%,67.86% 88%,64.29% 100%,60.71% 88%,57.14% 100%,53.57% 88%,50.0% 100%,46.43% 88%,42.86% 100%,39.29% 88%,35.71% 100%,32.14% 88%,28.57% 100%,25.0% 88%,21.43% 100%,17.86% 88%,14.29% 100%,10.71% 88%,7.14% 100%,3.57% 88%,0.0% 100%)';

/** Quanto dura l'animazione dello strappo prima di passare alle carte */
export const PACK_TEAR_ANIMATION_MS = 800;
