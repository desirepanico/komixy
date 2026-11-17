import { Service, signal } from '@angular/core';
import { DISCOVER_ADULT_AGE } from '@shared/constants/ui.const';

export type AgeCheck = 'adult' | 'minor' | 'invalid';

/** Se l'utente ha dichiarato di essere maggiorenne. Non conserva la data di nascita, solo il risultato. */
@Service()
export class AgeVerificationService {
  // TODO(api): l'età verificata sta sul profilo dell'iscritto, non in memoria
  private readonly _verified = signal<boolean>(false);

  public readonly verified = this._verified.asReadonly();

  public check(day: number, month: number, year: number): AgeCheck {
    const birth = new Date(year, month - 1, day);
    const real =
      birth.getFullYear() === year && birth.getMonth() === month - 1 && birth.getDate() === day;
    if (!real || year < 1900 || birth.getTime() > Date.now()) return 'invalid';
    const today = new Date();
    const adultFrom = new Date(year + DISCOVER_ADULT_AGE, month - 1, day);
    if (adultFrom.getTime() > today.getTime()) return 'minor';
    this._verified.set(true);
    return 'adult';
  }
}
