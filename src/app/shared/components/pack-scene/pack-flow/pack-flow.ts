import { PackPhase, PackSceneMode, PackSceneState } from '../../../models/pack.model';

/** Le regole del rito: quale passo può seguire quale. Gli indici seguono l'ordine in cui si girano le carte */
export class PackFlow {
  private current: PackPhase;
  private next: number;
  private focus: number | null = null;

  public constructor(
    public readonly count: number,
    private readonly mode: PackSceneMode,
  ) {
    this.current = this.startPhase();
    this.next = this.startNext();
  }

  public get phase(): PackPhase {
    return this.current;
  }

  /** Indice della prossima carta da girare (uguale a `count` quando le ha girate tutte) */
  public get nextIndex(): number {
    return this.next;
  }

  public get focusIndex(): number | null {
    return this.focus;
  }

  public snapshot(): PackSceneState {
    return { phase: this.current, revealed: this.next, focus: this.focus };
  }

  public reset(): void {
    this.current = this.startPhase();
    this.next = this.startNext();
    this.focus = null;
  }

  public introDone(): boolean {
    return this.move('intro', 'closed');
  }

  public tear(): boolean {
    return this.move('closed', 'tearing');
  }

  public tearDone(): boolean {
    return this.move('tearing', 'opening');
  }

  public deckReady(): boolean {
    return this.move('opening', 'deck');
  }

  public flip(): boolean {
    if (!this.move('deck', 'flipping')) return false;
    this.focus = this.next;
    return true;
  }

  public shown(): boolean {
    return this.move('flipping', 'shown');
  }

  public collect(): boolean {
    return this.move('shown', 'moving');
  }

  /** Dopo l'ultima carta passa al ventaglio finale, altrimenti torna al mazzo */
  public collected(): boolean {
    if (!this.move('moving', 'deck')) return false;
    this.next += 1;
    this.focus = null;
    if (this.next >= this.count) this.current = 'finale';
    return true;
  }

  public finaleDone(): boolean {
    return this.move('finale', 'collection');
  }

  public inspect(index: number): boolean {
    if (index < 0 || index >= this.count) return false;
    if (!this.move('collection', 'inspecting')) return false;
    this.focus = index;
    return true;
  }

  public closeInspect(): boolean {
    if (!this.move('inspecting', 'collection')) return false;
    this.focus = null;
    return true;
  }

  private move(from: PackPhase, to: PackPhase): boolean {
    if (this.current !== from) return false;
    this.current = to;
    return true;
  }

  private startPhase(): PackPhase {
    return this.mode === 'review' ? 'collection' : 'intro';
  }

  private startNext(): number {
    return this.mode === 'review' ? this.count : 0;
  }
}
