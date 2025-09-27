import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

// Custom hook for URL state management using React Router
export function useUrlState<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T | null) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = (searchParams.get(key) as T) || defaultValue;

  const setValue = useCallback(
    (value: T | null) => {
      const newParams = new URLSearchParams(searchParams);
      
      if (value === null || value === '' || value === defaultValue) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }

      setSearchParams(newParams);
    },
    [key, defaultValue, searchParams, setSearchParams]
  );

  return [value, setValue];
}

// Convenience hooks for common use cases
export function useUrlSearch(defaultValue = '') {
  return useUrlState('search', defaultValue);
}

export function useUrlFilter(defaultValue = '') {
  return useUrlState('filter', defaultValue);
}

export function useUrlSort(defaultValue = '') {
  return useUrlState('sort', defaultValue);
}

export function useUrlPage(defaultValue = 1) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const value = parseInt(searchParams.get('page') || String(defaultValue), 10) || defaultValue;

  const setValue = useCallback(
    (newValue: number | null) => {
      const newParams = new URLSearchParams(searchParams);
      
      if (newValue === null || newValue === defaultValue) {
        newParams.delete('page');
      } else {
        newParams.set('page', String(newValue));
      }

      setSearchParams(newParams);
    },
    [defaultValue, searchParams, setSearchParams]
  );

  return [value, setValue] as const;
}