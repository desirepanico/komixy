import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matAddOutline,
  matCheckOutline,
  matLockOutline,
} from '@ng-icons/material-symbols/outline';
import { PACK_ASSETS } from '../../constants/ui.const';
import {
  PackCard,
  PackSceneApi,
  PackSceneLabels,
  PackSceneMode,
  PackSceneState,
} from '../../models/pack.model';
import { Button } from '../button/button';
import { loadImage } from './pack-art/pack-art';
import { PackRendererLoader } from './pack-renderer-loader/pack-renderer-loader.service';

/**
 * Scena 3D della busta con i suoi controlli. `three` si scarica solo quando la scena si crea.
 * `mode="open"`: strappo e giro delle carte; `mode="review"`: parte dalla raccolta completa.
 * Se il 3D non parte emette `failed`: chi la usa deve offrire un'alternativa.
 */
@Component({
  selector: 'app-pack-scene',
  imports: [Button, NgIcon, RouterLink, TranslocoPipe],
  providers: [provideIcons({ matAddOutline, matCheckOutline, matLockOutline })],
  templateUrl: './pack-scene.html',
  host: { class: 'flex h-full min-h-0 flex-col' },
})
export class PackScene {
  private readonly destroyRef = inject(DestroyRef);
  private readonly transloco = inject(TranslocoService);
  private readonly loader = inject(PackRendererLoader);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private renderer: PackSceneApi | null = null;

  /** In ordine di classifica (la prima è la numero 1). In `open` può arrivare dopo lo strappo */
  public readonly cards = input.required<readonly PackCard[]>();
  public readonly count = input.required<number>();
  public readonly mode = input<PackSceneMode>('open');
  public readonly bookmarkedIds = input<readonly string[]>([]);
  public readonly locked = input<boolean>(false);

  public readonly tearComplete = output<void>();
  public readonly finished = output<void>();
  public readonly failed = output<void>();
  public readonly bookmarkToggle = output<string>();

  protected readonly state = signal<PackSceneState>({ phase: 'intro', revealed: 0, focus: null });

  protected readonly focusCard = computed(() => {
    const focus = this.state().focus;
    return focus === null ? null : (this.cards()[focus] ?? null);
  });

  protected readonly focusBookmarked = computed(() => {
    const card = this.focusCard();
    return !!card && this.bookmarkedIds().includes(card.comic.id);
  });

  protected readonly bookmarkIcon = computed(() => {
    if (this.locked()) return 'matLockOutline';
    return this.focusBookmarked() ? 'matCheckOutline' : 'matAddOutline';
  });

  protected readonly showActions = computed(() => {
    const phase = this.state().phase;
    return !!this.focusCard() && (phase === 'shown' || phase === 'inspecting');
  });

  protected readonly showCounter = computed(() => {
    const phase = this.state().phase;
    return (
      this.mode() === 'open' &&
      ['deck', 'flipping', 'shown', 'moving', 'finale', 'collection'].includes(phase)
    );
  });

  protected readonly tappable = computed(() =>
    ['deck', 'shown', 'collection', 'inspecting'].includes(this.state().phase),
  );

  protected readonly hint = computed<{ key: string; params?: Record<string, unknown> } | null>(() => {
    const { phase } = this.state();
    const card = this.focusCard();
    switch (phase) {
      case 'closed':
        return { key: 'weeklyPack.hint.tear' };
      case 'tearing':
      case 'opening':
        return { key: 'weeklyPack.hint.opening' };
      case 'deck':
        return { key: this.cards().length ? 'weeklyPack.hint.deck' : 'weeklyPack.hint.opening' };
      case 'shown':
        return { key: card?.comic.editionType ? 'weeklyPack.hint.shownRare' : 'weeklyPack.hint.shown' };
      case 'collection':
        return { key: 'weeklyPack.hint.collection' };
      case 'inspecting':
        return card
          ? { key: 'weeklyPack.hint.inspecting', params: { rank: card.rank, title: card.comic.title } }
          : null;
      default:
        return null;
    }
  });

  protected readonly primaryLabel = computed<string | null>(() => {
    const { phase, revealed } = this.state();
    switch (phase) {
      case 'closed':
        return 'weeklyPack.action.tear';
      case 'deck':
        return 'weeklyPack.action.flip';
      case 'shown':
        return revealed >= this.count() - 1 ? 'weeklyPack.action.showAll' : 'weeklyPack.action.next';
      case 'collection':
        return this.mode() === 'open' ? 'weeklyPack.action.finish' : null;
      case 'inspecting':
        return 'weeklyPack.action.backToCollection';
      default:
        return null;
    }
  });

  protected readonly primaryDisabled = computed(
    () => this.state().phase === 'deck' && this.cards().length === 0,
  );

  public constructor() {
    afterNextRender(() => void this.init());
    this.destroyRef.onDestroy(() => this.renderer?.dispose());
    effect(() => {
      const cards = this.cards();
      untracked(() => {
        if (cards.length) this.renderer?.setCards(cards);
      });
    });
  }

  protected onPrimary(): void {
    switch (this.state().phase) {
      case 'closed':
        this.renderer?.tearOpen();
        break;
      case 'deck':
        this.renderer?.flip();
        break;
      case 'shown':
        this.renderer?.next();
        break;
      case 'collection':
        this.finished.emit();
        break;
      case 'inspecting':
        this.renderer?.closeInspect();
        break;
    }
  }

  protected inspect(rankIndex: number): void {
    this.renderer?.inspect(rankIndex);
  }

  private async init(): Promise<void> {
    try {
      const [logo, wordmark] = await Promise.all([
        loadImage(PACK_ASSETS.logo),
        loadImage(PACK_ASSETS.wordmark),
      ]);
      const renderer = await this.loader.create({
        canvas: this.canvas().nativeElement,
        mode: this.mode(),
        count: this.count(),
        labels: this.labels(),
        logo,
        wordmark,
        onState: (state) => this.state.set(state),
        onTearComplete: () => this.tearComplete.emit(),
      });
      this.renderer = renderer;
      renderer.start();
      if (this.cards().length) renderer.setCards(this.cards());
    } catch {
      this.failed.emit();
    }
  }

  private labels(): PackSceneLabels {
    const t = (key: string, params?: Record<string, unknown>) => this.transloco.translate(key, params);
    return {
      volume: t('mangaCard.volumeLabel'),
      singleVolume: t('mangaCard.singleVolume'),
      tagline: t('weeklyPack.tagline', { count: this.count() }),
      editions: {
        variant: t('mangaCard.editions.variant'),
        deluxe: t('mangaCard.editions.deluxe'),
        limited: t('mangaCard.editions.limited'),
      },
    };
  }
}
