/**
 * Raggio degli angoli di una carta ridotta da `scale`: la carta è disegnata a grandezza piena con `rounded-xl`
 * e poi rimpicciolita, quindi i suoi angoli si riducono nella stessa misura. Chi avvolge la carta in un elemento
 * con il focus (link, bottone) lo usa come `border-radius`, così l'anello di focus segue gli angoli della carta.
 *   <a [style.border-radius]="radius"> <app-pack-card [scale]="0.5" /> </a>
 */
export function packCardRadius(scale: number): string {
  return `calc(var(--radius-xl) * ${scale})`;
}
