/** Una voce di `app-select-button`: il valore che sceglie e la chiave Transloco del suo testo */
export interface SelectButtonOption<T extends string = string> {
  value: T;
  label: string;
}
