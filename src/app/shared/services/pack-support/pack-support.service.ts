import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PackSupportService {
  /** Vero se il browser disegna in 3D (three richiede WebGL 2) e l'utente non ha chiesto meno movimento */
  public readonly supports3d: boolean = this.detect();

  private detect(): boolean {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  }
}
