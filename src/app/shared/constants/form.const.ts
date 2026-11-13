// TODO(api): la sessione la manterrà il server (cookie o token), non il browser
/** Chiave dello storage con lo stato «iscritto» (letta da `SessionService`) */
export const SESSION_STORAGE_KEY = 'komixy.session';

/** Chiave dello storage con l'utente iscritto (letta da `AuthService`) */
export const AUTH_USER_STORAGE_KEY = 'komixy.user';

// TODO(api): il token andrà in un cookie httpOnly impostato dal server, non nello storage del browser
/** Chiave dello storage con il token di accesso (letta da `SessionService`) */
export const AUTH_TOKEN_STORAGE_KEY = 'komixy.token';

/** Chiave dello storage con l'identificativo anonimo dell'ospite (letta da `SessionService`) */
export const GUEST_ID_STORAGE_KEY = 'komixy.guestId';

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
