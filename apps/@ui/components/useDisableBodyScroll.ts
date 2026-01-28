import { useEffect } from 'react';

let count: number = 0;

export function useDisableBodyScroll(enable: boolean): void {
  useEffect(() => {
    if (enable) {
      count++;
      if (count === 1) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      if (enable) {
        count--;
        if (count === 0) {
          document.body.style.overflow = '';
        }
      }
    };
  }, [enable]);
}
