import { useState, useEffect, useCallback } from 'react';

interface DeviceOrientation {
  beta: number; // front-back tilt (-180 to 180)
  gamma: number; // left-right tilt (-90 to 90)
  supported: boolean;
  permissionGranted: boolean;
}

export const useDeviceOrientation = (): {
  orientation: DeviceOrientation;
  requestPermission: () => Promise<boolean>;
} => {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    beta: 0,
    gamma: 0,
    supported: false,
    permissionGranted: false,
  });

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    setOrientation(prev => ({
      ...prev,
      beta: event.beta ?? 0,
      gamma: event.gamma ?? 0,
    }));
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    // iOS 13+ requires explicit permission
    if (
      typeof (
        DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        }
      ).requestPermission === 'function'
    ) {
      try {
        const permission = await (
          DeviceOrientationEvent as unknown as {
            requestPermission: () => Promise<string>;
          }
        ).requestPermission();
        if (permission === 'granted') {
          setOrientation(prev => ({ ...prev, permissionGranted: true }));
          window.addEventListener('deviceorientation', handleOrientation);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    }
    // Non-iOS or older iOS - permission not needed
    setOrientation(prev => ({ ...prev, permissionGranted: true }));
    window.addEventListener('deviceorientation', handleOrientation);
    return true;
  }, [handleOrientation]);

  useEffect(() => {
    const supported = 'DeviceOrientationEvent' in window;
    setOrientation(prev => ({ ...prev, supported }));

    // On non-iOS, start listening immediately
    if (
      supported &&
      typeof (
        DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        }
      ).requestPermission !== 'function'
    ) {
      setOrientation(prev => ({ ...prev, permissionGranted: true }));
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  return { orientation, requestPermission };
};
