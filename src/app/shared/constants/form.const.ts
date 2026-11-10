export const PASSWORD_MIN_LENGTH = 6;

export const FAKE_API_DELAY_MS = 800;

export const DEMO_CREDENTIALS: Readonly<{ email: string; password: string }> = {
  email: 'demo@example.com',
  password: 'password1',
};

export const VALIDATION_MESSAGES: Readonly<Record<string, string>> = {
  required: 'validation.required',
  email: 'validation.email',
  minLength: 'validation.minLength',
};

export const VALIDATION_FALLBACK_MESSAGE = 'validation.invalid';
