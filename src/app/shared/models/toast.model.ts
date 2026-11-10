export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastMessage {
  id: number;
  severity: ToastSeverity;
  /** Chiavi Transloco del titolo e del dettaglio */
  summary: string;
  detail: string;
  params?: Readonly<Record<string, unknown>>;
}
