import { Component, computed, inject, input, linkedSignal, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matAddOutline,
  matCheckOutline,
  matLockOutline,
} from '@ng-icons/material-symbols/outline';
import { RankingEntry } from '../../models/ranking-entry.model';
import { BookmarksService } from '../../services/bookmarks/bookmarks.service';
import { SessionService } from '../../services/session/session.service';
import { Button } from '../button/button';
import { PackCard } from '../pack-card/pack-card';

/**
 * Una carta in primo piano con i suoi comandi: «Vedi dettaglio» e «In lista».
 * Il testo sotto la carta (`caption`), ciò che sta subito sotto (`afterCard`, es. le carte già girate), ciò che sta
 * dietro (`behindCard`, es. il ventaglio) e il bottone principale si passano come contenuto:
 *   <app-card-spotlight [entry]="carta" [detailLink]="link">
 *     <span caption>Tocca per continuare</span>
 *     <button appButton severity="accent">Prossima carta</button>
 *   </app-card-spotlight>
 * Con `interactive` la carta è un bottone (si gira o si passa alla prossima).
 */
@Component({
  selector: 'app-card-spotlight',
  imports: [PackCard, Button, RouterLink, TranslocoPipe, NgIcon],
  providers: [provideIcons({ matAddOutline, matCheckOutline, matLockOutline })],
  templateUrl: './card-spotlight.html',
  host: { class: 'flex flex-1 flex-col' },
})
export class CardSpotlight {
  protected readonly bookmarks = inject(BookmarksService);
  protected readonly session = inject(SessionService);

  public readonly entry = input.required<RankingEntry>();
  /** Percorso della pagina del fumetto */
  public readonly detailLink = input.required<readonly string[]>();
  /** false = si vede il dorso e i comandi restano nascosti finché la carta non è girata */
  public readonly faceUp = input<boolean>(true);
  /** true = sotto la carta c'è il riepilogo «#4 One Piece · Vol. 100» al posto del testo passato in `caption` */
  public readonly summary = input<boolean>(false);
  /** true = la carta è un bottone */
  public readonly interactive = input<boolean>(false);
  public readonly cardPress = output<void>();

  protected readonly saved = computed(() => this.bookmarks.isSaved(this.entry().comic.id));

  /** Cambiando carta l'invito a iscriversi (solo ospiti) sparisce */
  protected readonly inviteShown = linkedSignal<RankingEntry, boolean>({
    source: this.entry,
    computation: () => false,
  });

  protected onInList(): void {
    if (this.bookmarks.canSave()) {
      this.bookmarks.toggle(this.entry().comic.id);
    } else {
      this.inviteShown.set(true);
    }
  }
}
