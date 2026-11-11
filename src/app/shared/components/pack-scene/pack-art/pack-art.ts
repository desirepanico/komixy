import {
  PACK_FALLBACK_PALETTE,
  PACK_GEOMETRY,
  PACK_TEXTURE,
  PACK_THEME_TOKENS,
} from '../../../constants/ui.const';
import { PackCard, PackPalette, PackSceneLabels } from '../../../models/pack.model';

type Ctx = CanvasRenderingContext2D;
type Image = HTMLImageElement | null;

/** Colori dei token del tema: la scena segue il tema invece di ripetere i valori */
export function readPalette(root: Element): PackPalette {
  const styles = getComputedStyle(root);
  const keys = Object.keys(PACK_THEME_TOKENS) as (keyof PackPalette)[];
  const entries = keys.map((key) => [
    key,
    styles.getPropertyValue(PACK_THEME_TOKENS[key]).trim() || PACK_FALLBACK_PALETTE[key],
  ]);
  return Object.fromEntries(entries) as unknown as PackPalette;
}

const mix = (color: string, percent: number): string =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

const roundedRect = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

// Taglia il testo con i puntini se non sta nella larghezza
function fit(ctx: Ctx, text: string, max: number): string {
  let shown = text;
  while (shown.length > 1 && ctx.measureText(shown).width > max) shown = shown.slice(0, -1);
  return shown === text ? text : `${shown}…`;
}

export function drawPackFront(ctx: Ctx, wordmark: Image, labels: PackSceneLabels, p: PackPalette): void {
  const { packWidth: w, packHeight: h } = PACK_TEXTURE;
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, p.primary700);
  gradient.addColorStop(0.55, p.primary800);
  gradient.addColorStop(1, p.primary950);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  // Le fasce delle due saldature sono più scure
  ctx.fillStyle = mix(p.surface950, 30);
  ctx.fillRect(0, 0, w, 150);
  ctx.fillRect(0, h - 150, w, 150);
  if (wordmark) {
    const width = 740;
    const height = (width * wordmark.height) / wordmark.width;
    ctx.save();
    ctx.shadowColor = mix(p.primary950, 70);
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 18;
    ctx.drawImage(wordmark, w / 2 - width / 2, 830 - height / 2, width, height);
    ctx.restore();
  }
  ctx.fillStyle = p.primary300;
  ctx.font = '800 38px Mulish, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '10px';
  ctx.fillText(labels.tagline, w / 2 + 5, 1010);
}

export function drawCardFront(
  ctx: Ctx,
  card: PackCard,
  cover: Image,
  labels: PackSceneLabels,
  p: PackPalette,
): void {
  const { cardWidth: w, cardHeight: h } = PACK_TEXTURE;
  const { comic, rank } = card;
  const rare = comic.editionType !== null;
  roundedRect(ctx, 0, 0, w, h, 28);
  ctx.fillStyle = p.surface900;
  ctx.fill();
  if (rare) {
    const border = ctx.createLinearGradient(0, 0, w, h);
    border.addColorStop(0, p.primary300);
    border.addColorStop(1, p.primary700);
    ctx.strokeStyle = border;
    ctx.lineWidth = 8;
  } else {
    ctx.strokeStyle = mix(p.primary400, 28);
    ctx.lineWidth = 4;
  }
  roundedRect(ctx, 4, 4, w - 8, h - 8, 26);
  ctx.stroke();

  const ax = 24;
  const ay = 24;
  const aw = w - 48;
  const ah = 585;
  ctx.save();
  roundedRect(ctx, ax, ay, aw, ah, 16);
  ctx.clip();
  if (cover) {
    const scale = Math.max(aw / cover.width, ah / cover.height);
    ctx.drawImage(
      cover,
      ax + (aw - cover.width * scale) / 2,
      ay + (ah - cover.height * scale) / 2,
      cover.width * scale,
      cover.height * scale,
    );
  } else {
    const placeholder = ctx.createLinearGradient(ax, ay, ax, ay + ah);
    placeholder.addColorStop(0, p.primary800);
    placeholder.addColorStop(1, p.surface900);
    ctx.fillStyle = placeholder;
    ctx.fillRect(ax, ay, aw, ah);
  }
  ctx.restore();

  // Posizione in classifica, come nella card di ranking
  roundedRect(ctx, ax + 12, ay + 12, 132, 86, 18);
  ctx.fillStyle = mix(p.surface950, 76);
  ctx.fill();
  const tone = ctx.createLinearGradient(0, ay + 12, 0, ay + 98);
  tone.addColorStop(0, rank <= 3 ? p.primary200 : p.surface200);
  tone.addColorStop(1, rank <= 3 ? p.primary500 : p.surface500);
  ctx.fillStyle = tone;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = '0px';
  ctx.font = '800 30px Mulish, sans-serif';
  ctx.fillText('#', ax + 26, ay + 68);
  ctx.font = '900 62px Mulish, sans-serif';
  ctx.fillText(String(rank), ax + 54, ay + 80);

  ctx.fillStyle = p.surface50;
  ctx.font = '800 33px Mulish, sans-serif';
  ctx.fillText(fit(ctx, comic.title, aw), ax, ay + ah + 46);
  ctx.fillStyle = p.surface400;
  ctx.font = '600 24px Mulish, sans-serif';
  ctx.fillText(fit(ctx, comic.author, aw), ax, ay + ah + 80);

  const baseline = ay + ah + 122;
  let x = ax;
  if (comic.isSingleVolume) {
    ctx.fillStyle = p.primary400;
    ctx.font = '700 26px Mulish, sans-serif';
    ctx.fillText(labels.singleVolume, x, baseline);
  } else {
    ctx.fillStyle = p.primary400;
    ctx.font = '600 26px Mulish, sans-serif';
    const label = `${labels.volume} `;
    ctx.fillText(label, x, baseline);
    x += ctx.measureText(label).width;
    ctx.fillStyle = p.primary300;
    ctx.font = '800 34px Mulish, sans-serif';
    const volume = String(comic.volume);
    ctx.fillText(volume, x, baseline);
    x += ctx.measureText(volume).width;
    if (comic.totalVolumes) {
      ctx.fillStyle = p.surface400;
      ctx.font = '600 26px Mulish, sans-serif';
      ctx.fillText(` / ${comic.totalVolumes}`, x, baseline);
    }
  }
  if (comic.editionType) {
    const text = labels.editions[comic.editionType];
    ctx.font = '700 21px Mulish, sans-serif';
    const width = ctx.measureText(text).width + 28;
    const left = ax + aw - width;
    roundedRect(ctx, left, baseline - 27, width, 38, 10);
    ctx.fillStyle = mix(p.primary500, 22);
    ctx.fill();
    ctx.strokeStyle = mix(p.primary400, 50);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = p.primary300;
    ctx.textAlign = 'center';
    ctx.fillText(text, left + width / 2, baseline);
  }
}

export function drawCardBack(ctx: Ctx, logo: Image, p: PackPalette): void {
  const { cardWidth: w, cardHeight: h } = PACK_TEXTURE;
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, p.primary900);
  gradient.addColorStop(0.5, p.primary950);
  gradient.addColorStop(1, p.surface950);
  roundedRect(ctx, 0, 0, w, h, 28);
  ctx.fillStyle = gradient;
  ctx.fill();
  const glow = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 280);
  glow.addColorStop(0, mix(p.primary500, 38));
  glow.addColorStop(1, mix(p.primary500, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = mix(p.primary400, 35);
  ctx.lineWidth = 4;
  roundedRect(ctx, 4, 4, w - 8, h - 8, 26);
  ctx.stroke();
  ctx.strokeStyle = mix(p.primary400, 18);
  ctx.lineWidth = 2;
  roundedRect(ctx, 30, 30, w - 60, h - 60, 16);
  ctx.stroke();
  if (logo) {
    const width = 350;
    const height = (width * logo.height) / logo.width;
    ctx.drawImage(logo, w / 2 - width / 2, h / 2 - height / 2, width, height);
  }
}

/** Maschera di trasparenza: bianco dove la carta c'è, nero dove no */
export function drawRoundedMask(ctx: Ctx, width: number, height: number): void {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  roundedRect(ctx, 0, 0, width, height, (15 / 240) * width);
  ctx.fill();
}

const tearJag = (x: number): number =>
  ((Math.sin(x * 0.37) + Math.sin(x * 1.13 + 2) + Math.sin(x * 2.7 + 1)) / 3) * 5;

/** Maschera del corpo o del lembo: bordi seghettati delle saldature e linea di strappo irregolare */
export function drawSealMask(ctx: Ctx, part: 'body' | 'flap'): void {
  const { maskWidth: w, maskHeight: h } = PACK_TEXTURE;
  const tearY = ((1 - PACK_GEOMETRY.tearAt) / 2) * h;
  const teeth = PACK_GEOMETRY.seamTeeth;
  const step = w / teeth;
  const depth = 20;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  if (part === 'flap') {
    ctx.moveTo(0, depth);
    for (let i = 0; i < teeth; i++) {
      ctx.lineTo((i + 0.5) * step, 0);
      ctx.lineTo((i + 1) * step, depth);
    }
    for (let x = w; x >= 0; x -= 4) ctx.lineTo(x, tearY + tearJag(x));
  } else {
    ctx.moveTo(0, tearY + tearJag(0));
    for (let x = 4; x <= w; x += 4) ctx.lineTo(x, tearY + tearJag(x));
    ctx.lineTo(w, h - depth);
    for (let i = teeth; i > 0; i--) {
      ctx.lineTo((i - 0.5) * step, h);
      ctx.lineTo((i - 1) * step, h - depth);
    }
  }
  ctx.closePath();
  ctx.fill();
}

/** Bagliore bianco che sfuma: il colore lo dà la scena */
export function drawGlow(ctx: Ctx): void {
  const size = PACK_TEXTURE.glowSize;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.35)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
}

/** Carica un'immagine; se non arriva (rete, CORS) restituisce null e la scena usa un segnaposto */
export function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
}
