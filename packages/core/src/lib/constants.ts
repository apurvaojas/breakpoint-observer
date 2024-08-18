import type { BreakpointConfig } from './types';

export const defaultBreakpoints: BreakpointConfig = [
  { xs: 0 },
  { sm: 576 },
  { md: 768 },
  { lg: 992 },
  { xl: 1200 },
  { xxl: 1400 },
];

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
