import { EditionType, ComicItem } from './comic.model';

export type PackStatus = 'sealed' | 'opened';

export interface PackCard {
  rank: number;
  comic: ComicItem;
  detailLink: readonly string[];
}

/** `open`: rito di apertura con lo strappo; `review`: parte già dalla raccolta completa */
export type PackSceneMode = 'open' | 'review';

export type PackPhase =
  | 'intro'
  | 'closed'
  | 'tearing'
  | 'opening'
  | 'deck'
  | 'flipping'
  | 'shown'
  | 'moving'
  | 'finale'
  | 'collection'
  | 'inspecting';

export interface PackSceneState {
  phase: PackPhase;
  /** Carte già girate e messe da parte */
  revealed: number;
  /** Posizione (0 = prima in classifica) della carta in primo piano, se ce n'è una */
  focus: number | null;
}

/** Testi disegnati sulle texture: arrivano già tradotti */
export interface PackSceneLabels {
  volume: string;
  singleVolume: string;
  tagline: string;
  editions: Readonly<Record<EditionType, string>>;
}

export interface PackPalette {
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;
  primary700: string;
  primary800: string;
  primary900: string;
  primary950: string;
  surface50: string;
  surface200: string;
  surface400: string;
  surface500: string;
  surface700: string;
  surface900: string;
  surface950: string;
}

export interface PackPose {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
}

export interface PackRendererOptions {
  canvas: HTMLCanvasElement;
  mode: PackSceneMode;
  /** Quante carte contiene la busta */
  count: number;
  labels: PackSceneLabels;
  logo: HTMLImageElement | null;
  wordmark: HTMLImageElement | null;
  onState: (state: PackSceneState) => void;
  /** Lo strappo è completo: è il momento di chiedere l'apertura al server */
  onTearComplete: () => void;
}

/** Ciò che serve sapere della scena 3D senza importare three */
export interface PackSceneApi {
  start(): void;
  setCards(cards: readonly PackCard[]): void;
  tearOpen(): void;
  flip(): void;
  next(): void;
  inspect(rankIndex: number): void;
  closeInspect(): void;
  dispose(): void;
}
