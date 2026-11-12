import { Component, computed, input, output, signal } from '@angular/core';
import {
  PACK_BODY_CLIP,
  PACK_IMAGE_URL,
  PACK_STRIP_CLIP,
  PACK_STRIP_RATIO,
  PACK_TEAR_DISTANCE_PX,
} from '@shared/constants/pack.const';

/**
 * La busta con il lembo in alto che si strappa trascinandolo verso destra.
 * Il gesto è solo decorativo: chi non può trascinare apre la busta dal bottone della pagina,
 * che imposta `torn`.
 */
@Component({
  selector: 'app-pack-tear',
  templateUrl: './pack-tear.html',
  host: { class: 'block' },
})
export class PackTear {
  /** true = il lembo vola via e la busta si dissolve */
  public readonly torn = input<boolean>(false);
  /** Il lembo è stato trascinato abbastanza lontano */
  public readonly tearRequest = output<void>();

  protected readonly image = `url(${PACK_IMAGE_URL})`;
  protected readonly bodyClip = PACK_BODY_CLIP;
  protected readonly stripClip = PACK_STRIP_CLIP;
  protected readonly stripPercent = PACK_STRIP_RATIO * 100;
  protected readonly bodyPercent = 100 - PACK_STRIP_RATIO * 100;
  protected readonly stripBackgroundSize = `100% ${100 / PACK_STRIP_RATIO}%`;
  protected readonly bodyBackgroundSize = `100% ${100 / (1 - PACK_STRIP_RATIO)}%`;

  protected readonly dragX = signal<number>(0);
  protected readonly dragging = signal<boolean>(false);

  /** I denti di sega compaiono solo con la busta in strappo: a riposo corpo e lembo sono uniti e la busta è chiusa */
  protected readonly tearing = computed(() => this.dragging() || this.torn());

  private startX: number | null = null;

  protected readonly stripTransform = computed(() => {
    if (this.torn()) return 'translate(320px, -70px) rotate(38deg)';
    const dx = this.dragX();
    return `translateX(${dx}px) rotate(${dx * 0.06}deg)`;
  });

  protected onPointerDown(event: PointerEvent): void {
    if (this.torn()) return;
    this.startX = event.clientX;
    this.dragging.set(true);
    (event.currentTarget as Element).setPointerCapture?.(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (this.startX === null) return;
    this.dragX.set(Math.max(0, event.clientX - this.startX));
  }

  protected onPointerEnd(): void {
    if (this.startX === null) return;
    const reached = this.dragX() >= PACK_TEAR_DISTANCE_PX;
    this.startX = null;
    this.dragging.set(false);
    if (reached) {
      this.tearRequest.emit();
    } else {
      this.dragX.set(0);
    }
  }
}
