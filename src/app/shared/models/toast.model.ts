export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

/** Valori da inserire nei testi (es. `{ title }` per «{{ title }}») */
export type ToastParams = Readonly<Record<string, unknown>>;

export interface ToastMessage {
  id: number;
  severity: ToastSeverity;
  /** Titolo e dettaglio, già tradotti */
  summary: string;
  detail: string;
}
