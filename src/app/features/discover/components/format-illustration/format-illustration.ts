import { Component, input } from '@angular/core';
import { ComicFormat } from '@shared/models/catalog-item.model';

/**
 * La piccola illustrazione di un formato (serie, volume unico, graphic novel, omnibus) con i volumi
 * nei colori del tema. Al passaggio sulla scheda (`group/tile`) i volumi si alzano uno dopo l'altro.
 */
@Component({
  selector: 'app-format-illustration',
  templateUrl: './format-illustration.html',
  host: {
    class:
      'block h-24 overflow-hidden rounded-xl bg-[radial-gradient(90%_110%_at_50%_110%,rgb(208_188_255/0.3),transparent_70%),#0f0c20] text-primary-300',
    'aria-hidden': 'true',
  },
})
export class FormatIllustration {
  public readonly format = input.required<ComicFormat>();
}
