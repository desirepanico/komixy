export const FAKE_API_DELAY_MS = 800;

export const DEMO_CREDENTIALS: Readonly<{ email: string; password: string }> = {
  email: 'demo@example.com',
  password: 'password1',
};

/** Lunghezza minima della password al login */
export const PASSWORD_MIN_LENGTH = 6;

/** Chiave di traduzione del messaggio per ogni tipo (`kind`) di errore di validazione */
export const VALIDATION_MESSAGES: Readonly<Record<string, string>> = {
  required: 'validation.required',
  email: 'validation.email',
  minLength: 'validation.minLength',
};

/** Messaggio per i tipi di errore che non sono in `VALIDATION_MESSAGES` */
export const VALIDATION_FALLBACK_MESSAGE = 'validation.invalid';
