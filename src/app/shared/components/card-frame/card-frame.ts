import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card-frame',
  templateUrl: './card-frame.html',
  host: { class: 'block' },
})
export class CardFrame {
  /** Edizione speciale: bordo sfumato al posto del grigio */
  public readonly rare = input<boolean>(false);
  /** Carta cliccabile: il bordo si schiarisce al passaggio del mouse e la carta si preme */
  public readonly interactive = input<boolean>(false);
  /** Carta piccola, con meno margine interno */
  public readonly compact = input<boolean>(false);
}
