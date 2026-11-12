// ─── Regole della settimana ──────────────────────────────────────────────────

/** Dove si ricorda la settimana della busta già aperta (TODO(api): lo registra il server per utente o ospite) */
export const WEEKLY_PACK_STORAGE_KEY = 'komixy.weeklyPack';

/** La settimana della busta comincia il lunedì, ora italiana */
export const WEEKLY_PACK_TIME_ZONE = 'Europe/Rome';

// ─── Busta e strappo ─────────────────────────────────────────────────────────

export const PACK_IMAGE_URL = '/img/pack/booster.webp';

/** Quanto bisogna trascinare la busta verso destra per strapparla */
export const PACK_TEAR_DISTANCE_PX = 140;

/** Quanto dura l'animazione dello strappo prima di passare alle carte */
export const PACK_TEAR_ANIMATION_MS = 800;

/** Il lembo che si strappa è l'11% in alto dell'immagine della busta */
export const PACK_STRIP_RATIO = 0.11;

/** Bordi a dente di sega della busta strappata: del corpo (in alto) e del lembo (in basso) */
export const PACK_BODY_CLIP =
  'polygon(0.0% 0%,3.57% 1.6%,7.14% 0%,10.71% 1.6%,14.29% 0%,17.86% 1.6%,21.43% 0%,25.0% 1.6%,28.57% 0%,32.14% 1.6%,35.71% 0%,39.29% 1.6%,42.86% 0%,46.43% 1.6%,50.0% 0%,53.57% 1.6%,57.14% 0%,60.71% 1.6%,64.29% 0%,67.86% 1.6%,71.43% 0%,75.0% 1.6%,78.57% 0%,82.14% 1.6%,85.71% 0%,89.29% 1.6%,92.86% 0%,96.43% 1.6%,100.0% 0%,100% 100%,0 100%)';
export const PACK_STRIP_CLIP =
  'polygon(0 0,100% 0,100.0% 100%,96.43% 88%,92.86% 100%,89.29% 88%,85.71% 100%,82.14% 88%,78.57% 100%,75.0% 88%,71.43% 100%,67.86% 88%,64.29% 100%,60.71% 88%,57.14% 100%,53.57% 88%,50.0% 100%,46.43% 88%,42.86% 100%,39.29% 88%,35.71% 100%,32.14% 88%,28.57% 100%,25.0% 88%,21.43% 100%,17.86% 88%,14.29% 100%,10.71% 88%,7.14% 100%,3.57% 88%,0.0% 100%)';

// ─── Carta ───────────────────────────────────────────────────────────────────

/** Logo di Komixy, sul dorso delle carte */
export const LOGO_URL = '/img/logo/komixy-logo.png';

/** Misure di una carta a grandezza naturale: si scala con `scale` di `app-pack-card` */
export const PACK_CARD_WIDTH_PX = 192;
export const PACK_CARD_HEIGHT_PX = 320;

/** Sotto questa scala i testi non si leggono: copertina e numero di posizione */
export const PACK_CARD_COMPACT_BELOW = 0.7;

/** Dalla scala del ventaglio (0,42) in su la carta rara ha il riflesso; le miniature (0,2) no */
export const PACK_CARD_SHEEN_FROM = 0.4;

// ─── Carta in primo piano (spotlight) ────────────────────────────────────────

/** Spazio tra la carta in primo piano e ciò che sta sotto */
export const SPOTLIGHT_GAP_PX = 20;

/** Scala minima a cui si rimpicciolisce per non far scrollare la pagina */
export const SPOTLIGHT_MIN_SCALE = 0.6;

/** Da questa larghezza (tablet e desktop) la carta può crescere fino a `SPOTLIGHT_MAX_SCALE` */
export const SPOTLIGHT_GROW_FROM_PX = 640;
export const SPOTLIGHT_MAX_SCALE = 1.3;

// ─── Ventaglio ───────────────────────────────────────────────────────────────

/** Apertura totale del ventaglio, dalla carta più a sinistra a quella più a destra */
export const CARD_FAN_SPREAD_DEG = 100;

/** Grandezza base (telefono): 384×224 px con le carte a scala 0,42 */
export const CARD_FAN_BASE_SCALE = 0.42;
export const CARD_FAN_BASE_WIDTH_PX = 384;
export const CARD_FAN_BASE_HEIGHT_PX = 224;
export const CARD_FAN_BASE_TOP_PX = 24;

/** Sotto `CARD_FAN_SHRINK_BELOW_PX` di contenitore si rimpicciolisce, fino a `CARD_FAN_MIN_GROWTH` */
export const CARD_FAN_SHRINK_BELOW_PX = 320;
export const CARD_FAN_MIN_GROWTH = 0.5;

/** Da questa larghezza cresce, fino a `CARD_FAN_MAX_GROWTH` volte la base */
export const CARD_FAN_GROW_FROM_PX = 430;
export const CARD_FAN_MAX_GROWTH = 2.2;

// ─── Pannello «Top» di Scopri ────────────────────────────────────────────────

/** Carte mostrate accanto alla busta aperta: al massimo 10, quelle che stanno intere */
export const WEEKLY_TOP_COUNT = 10;

/** Scala delle carte nel pannello (96×160 px) e distanza tra loro */
export const WEEKLY_TOP_CARD_SCALE = 0.5;
export const WEEKLY_TOP_CARD_WIDTH_PX = PACK_CARD_WIDTH_PX * WEEKLY_TOP_CARD_SCALE;
export const WEEKLY_TOP_GAP_PX = 12;

/** Carte mostrate finché la larghezza del pannello non è stata misurata */
export const WEEKLY_TOP_INITIAL_COUNT = 3;

/** Bordo e spaziatura interna del pannello, per calcolarne la larghezza massima */
export const WEEKLY_TOP_FRAME_PX = 34;
