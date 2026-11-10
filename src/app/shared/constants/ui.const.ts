import { ToastSeverity } from '../models/toast.model';
import { ButtonSeverity, ButtonVariant } from '../models/button.model';

// Colori presi dai set Severity, Outlined e Text del file Figma "Manga App"
const FILLED_TEXT = 'text-surface-800';
export const BUTTON_COLORS: Readonly<
  Record<ButtonSeverity, Readonly<Record<ButtonVariant, string>>>
> = {
  primary: {
    filled: `bg-primary-300 ${FILLED_TEXT} hover:bg-primary-500`,
    outlined: 'border border-primary-400 text-primary-300 hover:bg-primary-400/15',
    text: 'text-primary-300 hover:bg-primary-400/15',
  },
  secondary: {
    filled:
      'border border-surface-700 bg-surface-800 text-primary-300 hover:border-surface-600 hover:bg-surface-700',
    outlined: 'border border-surface-600 text-surface-400 hover:bg-surface-600/15',
    text: 'text-surface-400 hover:bg-surface-600/15',
  },
  success: {
    filled: `bg-green-400 ${FILLED_TEXT} hover:bg-green-300`,
    outlined: 'border border-green-400 text-green-400 hover:bg-green-400/15',
    text: 'text-green-400 hover:bg-green-400/15',
  },
  info: {
    filled: `bg-blue-400 ${FILLED_TEXT} hover:bg-sky-300`,
    outlined: 'border border-blue-400 text-blue-400 hover:bg-blue-400/15',
    text: 'text-blue-400 hover:bg-blue-400/15',
  },
  warn: {
    filled: `bg-orange-400 ${FILLED_TEXT} hover:bg-orange-300`,
    outlined: 'border border-orange-300 text-orange-300 hover:bg-orange-300/15',
    text: 'text-orange-300 hover:bg-orange-300/15',
  },
  danger: {
    filled: `bg-rose-400 ${FILLED_TEXT} hover:bg-rose-300`,
    outlined: 'border border-rose-300 text-rose-300 hover:bg-rose-300/15',
    text: 'text-red-400 hover:bg-red-400/15',
  },
  contrast: {
    filled: `bg-surface-100 ${FILLED_TEXT} hover:bg-surface-300`,
    outlined: 'border border-surface-100 text-surface-100 hover:bg-surface-100/15',
    text: 'text-surface-100 hover:bg-surface-100/15',
  },
};

/** Se la prima navigazione non finisce mai, lo skeleton non deve restare per sempre */
export const BOOT_SKELETON_TIMEOUT_MS = 10_000;

export const TOAST_MAX_VISIBLE = 3;

/** Gli avvisi che chiedono un'azione restano più a lungo dei messaggi di conferma */
export const TOAST_DURATION_MS: Readonly<Record<ToastSeverity, number>> = {
  success: 4000,
  info: 5000,
  warn: 7000,
  error: 8000,
};

// Sfondo scuro con una punta del colore della severity: sul tema viola resta leggibile e distinguibile
export const TOAST_STYLES: Readonly<
  Record<ToastSeverity, { icon: string; iconColor: string; container: string }>
> = {
  success: {
    icon: 'matCheckCircleOutline',
    iconColor: 'text-green-400',
    container: 'border-green-400/60 bg-green-950',
  },
  info: {
    icon: 'matInfoOutline',
    iconColor: 'text-blue-400',
    container: 'border-blue-400/60 bg-blue-950',
  },
  warn: {
    icon: 'matWarningOutline',
    iconColor: 'text-orange-300',
    container: 'border-orange-300/60 bg-orange-950',
  },
  error: {
    icon: 'matErrorOutline',
    iconColor: 'text-red-400',
    container: 'border-red-400/60 bg-red-950',
  },
};
