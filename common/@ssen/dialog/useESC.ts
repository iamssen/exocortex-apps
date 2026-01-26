import { useEffect } from 'react';

export function useESC(callback: () => void): void {
  useEffect(() => {
    function keydown(evt: KeyboardEvent) {
      if (evt.key === 'Escape') {
        callback();
      }
    }

    globalThis.addEventListener('keydown', keydown);

    return () => {
      globalThis.removeEventListener('keydown', keydown);
    };
  }, [callback]);
}
