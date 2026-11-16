/** Il tasto dei comandi da mostrare accanto alla K: ⌘ su Mac, iPhone e iPad, Ctrl altrove. */
export function shortcutModifier(platform: string): string {
  return /Mac|iPhone|iPad|iPod/.test(platform) ? '⌘' : 'Ctrl';
}
