export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastMessage {
  id: number;
  severity: ToastSeverity;
  /** Chiave Transloco del messaggio */
  key: string;
  params?: Readonly<Record<string, unknown>>;
}
