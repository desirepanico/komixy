import { ButtonSeverity, ButtonVariant } from '../models/button.model';

// Colori presi dai set Severity, Outlined e Text del file Figma "Manga App"
const FILLED_TEXT = 'text-surface-800';
export const BUTTON_COLORS: Record<ButtonSeverity, Record<ButtonVariant, string>> = {
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
