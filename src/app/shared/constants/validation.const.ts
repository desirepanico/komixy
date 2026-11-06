/** Chiave di traduzione del messaggio per ogni tipo (`kind`) di errore di validazione */
export const VALIDATION_MESSAGES: Readonly<Record<string, string>> = {
  required: 'validation.required',
  email: 'validation.email',
  minLength: 'validation.minLength',
};

/** Messaggio per i tipi di errore che non sono in `VALIDATION_MESSAGES` */
export const VALIDATION_FALLBACK_MESSAGE = 'validation.invalid';
