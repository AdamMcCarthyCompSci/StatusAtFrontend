import { lazy, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';

import { useCanRender3D } from '@/hooks/useCanRender3D';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';

import StatusCardFallback from './StatusCardFallback';

const StatusCard3D = lazy(() => import('./StatusCard3D'));

const StatusCardWrapper = () => {
  const canRender3D = useCanRender3D();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const { orientation } = useDeviceOrientation();

  const gyro =
    orientation.supported && orientation.permissionGranted
      ? { beta: orientation.beta, gamma: orientation.gamma }
      : undefined;

  return (
    <div
      ref={ref}
      className="relative z-10 ml-auto w-full max-w-[900px]"
      style={{ aspectRatio: '3.4 / 2.4' }}
    >
      {canRender3D && inView ? (
        <Suspense fallback={<StatusCardFallback />}>
          <StatusCard3D gyro={gyro} />
        </Suspense>
      ) : (
        <StatusCardFallback enableHoverTilt={!canRender3D} />
      )}
    </div>
  );
};

export default StatusCardWrapper;
