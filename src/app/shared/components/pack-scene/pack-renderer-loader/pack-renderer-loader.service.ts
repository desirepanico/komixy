import { Injectable } from '@angular/core';
import { PackRendererOptions, PackSceneApi } from '../../../models/pack.model';

/** Unico punto che importa la scena (e quindi three): si scarica alla prima busta, non prima */
@Injectable({ providedIn: 'root' })
export class PackRendererLoader {
  /** Lancia se il browser non riesce a disegnare in 3D */
  public async create(options: PackRendererOptions): Promise<PackSceneApi> {
    const { PackRenderer } = await import('../pack-renderer/pack-renderer');
    return new PackRenderer(options);
  }
}
