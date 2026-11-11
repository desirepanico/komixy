import { Injectable } from '@angular/core';

/** Accesso a `localStorage` che non lancia mai: può essere bloccato (navigazione privata) o pieno */
@Injectable({ providedIn: 'root' })
export class SafeStorage {
  public read(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  public write(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // senza archivio si perde solo il ricordo tra una visita e l'altra
    }
  }
}
