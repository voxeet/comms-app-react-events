import { useCallback, useRef } from 'react';

export const determineProvider = (rtmpURL: string) => {
  switch (true) {
    case /youtube/gi.test(rtmpURL):
      return 'youtube';
    case /facebook/gi.test(rtmpURL):
      return 'facebook';
    case /twitch/gi.test(rtmpURL):
      return 'twitch';
    default:
      return 'other';
  }
};

export function debounce<T extends unknown[]>(fn: (...args: T) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout>;
  function debounceFunc(...args: T) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  }

  return debounceFunc;
}

export function useDebounce<T extends unknown[]>(fn: (...args: T) => void, wait: number) {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const debounceFunc = useCallback((...args: T) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), wait);
    // We don't want to regenerate this function - this is intended behaviour
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return debounceFunc;
}

export function makeUnique(value: string): string {
  return `${value}|${Date.now().toString()}`;
}

export function getFriendlyName(str: string): string {
  const regex = /(.+)\|(.+)/;
  const match = str.match(regex);
  if (match) {
    const [, left] = match;
    return left;
  }
  return str;
}

export function openInNewTab(url: string) {
  window.open(url, '_blank')?.focus();
}
