import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  PACK_CARD_HEIGHT_PX,
  SPOTLIGHT_GAP_PX,
  SPOTLIGHT_GROW_FROM_PX,
  SPOTLIGHT_MAX_SCALE,
  SPOTLIGHT_MIN_SCALE,
} from '../../constants/pack.const';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matAddOutline, matCheckOutline, matLockOutline } from '@ng-icons/material-symbols/outline';
import { RankingEntry } from '../../models/ranking-entry.model';
import { BookmarksService } from '../../services/bookmarks/bookmarks.service';
import { SessionService } from '../../services/session/session.service';
import { Button } from '../button/button';
import { Message } from '../message/message';
import { PackCard } from '../pack-card/pack-card';
import { packCardRadius } from '../../utils/pack-card-radius/pack-card-radius';

/**
 * Carta in primo piano con «Vedi dettaglio» e «In lista». Si compone con contenuto proiettato:
 * `caption` (testo sotto la carta), `afterCard`, `behindCard` (es. il ventaglio) e il bottone principale.
 *   <app-card-spotlight [entry]="entry" [detailLink]="link"><span caption>Tocca</span></app-card-spotlight>
 */
@Component({
  selector: 'app-card-spotlight',
  imports: [PackCard, Button, Message, RouterLink, TranslocoPipe, NgIcon],
  providers: [provideIcons({ matAddOutline, matCheckOutline, matLockOutline })],
  templateUrl: './card-spotlight.html',
  host: { class: 'flex min-h-0 flex-1 flex-col' },
})
export class CardSpotlight {
  protected readonly bookmarks = inject(BookmarksService);
  protected readonly session = inject(SessionService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly after = viewChild.required<ElementRef<HTMLElement>>('after');

  public readonly entry = input.required<RankingEntry>();
  /** Percorso della pagina del fumetto */
  public readonly detailLink = input.required<readonly string[]>();
  /** false = dorso, comandi nascosti finché la carta non è girata */
  public readonly faceUp = input<boolean>(true);
  /** true = sotto la carta c'è il riepilogo («#4 One Piece · Vol. 100») al posto di `caption` */
  public readonly summary = input<boolean>(false);
  /** true = la carta è un bottone */
  public readonly interactive = input<boolean>(false);
  public readonly cardPress = output<void>();

  private readonly stageHeight = signal<number>(0);
  private readonly stageWidth = signal<number>(0);
  private readonly afterHeight = signal<number>(0);
  /** Si rimpicciolisce se lo spazio non basta, così la pagina non scrolla; su tablet e desktop cresce */
  protected readonly cardScale = computed(() => {
    const stage = this.stageHeight();
    if (stage === 0) return 1;
    const available = stage - this.afterHeight() - SPOTLIGHT_GAP_PX;
    const max = this.stageWidth() >= SPOTLIGHT_GROW_FROM_PX ? SPOTLIGHT_MAX_SCALE : 1;
    return Math.min(max, Math.max(SPOTLIGHT_MIN_SCALE, available / PACK_CARD_HEIGHT_PX));
  });
  protected readonly cardRadius = computed(() => packCardRadius(this.cardScale()));
  protected readonly saved = computed(() => this.bookmarks.isSaved(this.entry().comic.id));
  /** Cambiando carta l'invito a iscriversi (solo ospiti) sparisce */
  protected readonly inviteShown = linkedSignal<RankingEntry, boolean>({
    source: this.entry,
    computation: () => false,
  });

  public constructor() {
    afterNextRender(() => {
      const stage = this.stage().nativeElement;
      const after = this.after().nativeElement;
      const observer = new ResizeObserver(() => {
        this.stageHeight.set(stage.clientHeight);
        this.stageWidth.set(stage.clientWidth);
        this.afterHeight.set(after.offsetHeight);
      });
      observer.observe(stage);
      observer.observe(after);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected onInList(): void {
    if (this.bookmarks.canSave()) {
      this.bookmarks.toggle(this.entry().comic.id);
    } else {
      this.inviteShown.set(true);
    }
  }
}
