import { DependencyList, useEffect } from 'react';

export const usePageRefresh = (cleanup: (e: BeforeUnloadEvent) => void, deps?: DependencyList) => {
  useEffect(() => {
    window.addEventListener('beforeunload', cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
    };
    // This function is very hard to setup correctly for this and should probably be rethought
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
