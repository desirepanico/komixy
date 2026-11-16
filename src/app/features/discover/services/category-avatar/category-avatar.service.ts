import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Avatar, Style } from '@dicebear/core';
import adventurer from '@dicebear/styles/adventurer.json' with { type: 'json' };
import {
  DISCOVER_AVATAR_BADGE,
  DISCOVER_AVATAR_EXTRA,
  DISCOVER_AVATAR_SKY,
  DISCOVER_AVATAR_STARS,
  DISCOVER_AVATARS,
} from '@shared/constants/ui.const';

/** Il personaggio spaziale di una categoria dei manga: la faccia è DiceBear (Adventurer, CC BY 4.0), il resto è disegnato qui. */
@Injectable({ providedIn: 'root' })
export class CategoryAvatarService {
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _style = new Style(adventurer);
  private readonly _cache = new Map<string, SafeHtml | null>();

  public avatar(category: string): SafeHtml | null {
    if (!this._cache.has(category)) this._cache.set(category, this._build(category));
    return this._cache.get(category) ?? null;
  }

  private _build(category: string): SafeHtml | null {
    const character = DISCOVER_AVATARS[category];
    if (!character) return null;
    const face = new Avatar(this._style, {
      idRandomization: true,
      earringsProbability: 0,
      glassesProbability: 0,
      detailsProbability: 0,
      hairProbability: 100,
      ...character.face,
    })
      .toString()
      // Il credito della licenza sta nella documentazione, non dentro l'immagine
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
      .replace(/<title[\s\S]*?<\/title>/g, '')
      .replace('<svg ', '<svg x="22" y="30" width="156" height="156" ');
    // Gli id dentro l'SVG devono essere diversi tra un personaggio e l'altro: basta la posizione nella cache
    const n = this._cache.size;
    const svg =
      `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>` +
      `<radialGradient id="n${n}" cx="30%" cy="22%" r="95%"><stop offset="0" stop-color="${character.bg[0]}"/><stop offset="1" stop-color="${character.bg[1]}"/></radialGradient>` +
      `<linearGradient id="h${n}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient>` +
      `<clipPath id="c${n}"><circle cx="100" cy="100" r="92"/></clipPath></defs>` +
      `<g clip-path="url(#c${n})"><rect width="200" height="200" fill="url(#n${n})"/>${DISCOVER_AVATAR_STARS}${DISCOVER_AVATAR_SKY[character.sky]}${face}${character.extra ? DISCOVER_AVATAR_EXTRA[character.extra] : ''}` +
      `<path d="M26 206c8-26 38-36 74-36s66 10 74 36z" fill="#e4e4f0"/><circle cx="100" cy="188" r="12" fill="${character.suit}"/>${DISCOVER_AVATAR_BADGE[character.badge]}</g>` +
      `<circle cx="100" cy="100" r="92" fill="url(#h${n})"/>` +
      `<circle cx="100" cy="100" r="92" fill="none" stroke="#f1e9ff" stroke-width="7"/><circle cx="100" cy="100" r="98" fill="none" stroke="${character.suit}" stroke-width="3" stroke-opacity=".9"/>` +
      `<path d="M46 60A64 64 0 0 1 98 32" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="8" stroke-linecap="round"/><circle cx="62" cy="48" r="4" fill="#fff" fill-opacity=".9"/></svg>`;
    // L'SVG nasce da seed fissi nel codice, non da dati dell'utente: si può mostrare senza sanitizzare
    return this._sanitizer.bypassSecurityTrustHtml(svg);
  }
}
