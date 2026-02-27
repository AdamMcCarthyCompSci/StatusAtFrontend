import { useState, useEffect } from 'react';

import { useReducedMotion } from './useReducedMotion';

const checkWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return !!gl;
  } catch {
    return false;
  }
};

export const useCanRender3D = (): boolean => {
  const prefersReduced = useReducedMotion();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setCanRender(false);
      return;
    }
    setCanRender(checkWebGLSupport());
  }, [prefersReduced]);

  return canRender;
};
