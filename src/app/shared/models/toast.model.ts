export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastMessage {
  id: number;
  severity: ToastSeverity;
  /** Titolo e dettaglio, già tradotti */
  summary: string;
  detail: string;
}
