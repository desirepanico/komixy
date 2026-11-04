/**
 * Restituisce l'URL a cui tornare dopo il login, solo se è un percorso interno dell'app.
 * Scarta indirizzi esterni (`https://...`, `//sito.it`) per evitare redirect verso altri siti.
 */
export function safeReturnUrl(returnUrl: string | null, fallback: string): string {
  const isInternal = !!returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//');
  return isInternal && !returnUrl.includes('\\') ? returnUrl : fallback;
}
