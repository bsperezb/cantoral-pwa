/**
 * Detecta si la app corre como PWA instalada.
 * Standalone en Chrome/Edge/Firefox; navigator.standalone en iOS Safari.
 */
export function usePwaMode() {
  const isStandalone = () => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
    if (window.matchMedia?.('(display-mode: minimal-ui)').matches) return true;
    if (window.navigator?.standalone === true) return true;
    return false;
  };
  return { isStandalone };
}
