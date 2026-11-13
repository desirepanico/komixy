/** Unisce l'indirizzo del backend e il percorso di una chiamata con una sola barra in mezzo, qualunque barra abbiano agli estremi */
export function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
