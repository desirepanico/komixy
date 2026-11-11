/** Inclinazione di una carta del ventaglio: la 1ª sta a destra (angolo positivo), l'ultima a sinistra. */
export function fanAngle(rank: number, count: number, spreadDeg: number): number {
  if (count <= 1) return 0;
  const fromLeft = (count - rank) / (count - 1);
  return (fromLeft - 0.5) * spreadDeg;
}
