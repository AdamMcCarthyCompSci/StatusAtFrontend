import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';

import CardMesh from './CardMesh';

interface StatusCard3DProps {
  gyro?: { beta: number; gamma: number };
}

const StatusCard3D = ({ gyro }: StatusCard3DProps) => {
  const [cursor, setCursor] = useState<'grab' | 'grabbing' | 'default'>(
    'default'
  );

  const handleCursorChange = useCallback(
    (newCursor: 'grab' | 'grabbing' | 'default') => {
      setCursor(newCursor);
    },
    []
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', cursor }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <spotLight
        position={[-5, 3, 2]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
      />
      <Float
        speed={2}
        rotationIntensity={0.3}
        floatIntensity={0.5}
        enabled={cursor !== 'grabbing'}
      >
        <CardMesh gyro={gyro} onCursorChange={handleCursorChange} />
      </Float>
      <Environment preset="city" background={false} />
    </Canvas>
  );
};

export default StatusCard3D;
