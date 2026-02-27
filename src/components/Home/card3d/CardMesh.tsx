import { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CardMeshProps {
  gyro?: { beta: number; gamma: number };
  onCursorChange?: (cursor: 'grab' | 'grabbing' | 'default') => void;
}

const CardMesh = ({ gyro, onCursorChange }: CardMeshProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // Drag state
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });
  const lastInteractionTime = useRef(0);

  // Hover state
  const isHovered = useRef(false);
  const currentScale = useRef(1);

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      lastInteractionTime.current = performance.now();
      onCursorChange?.('grabbing');
    },
    [onCursorChange]
  );

  const onPointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    const sensitivity = 0.008;
    velocity.current = { x: dy * sensitivity, y: dx * sensitivity };
    rotation.current.x += dy * sensitivity;
    rotation.current.y += dx * sensitivity;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    lastInteractionTime.current = performance.now();
  }, []);

  const onPointerUp = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
      isDragging.current = false;
      lastInteractionTime.current = performance.now();
      onCursorChange?.(isHovered.current ? 'grab' : 'default');
    },
    [onCursorChange]
  );

  const onPointerEnter = useCallback(() => {
    isHovered.current = true;
    if (!isDragging.current) onCursorChange?.('grab');
  }, [onCursorChange]);

  const onPointerLeave = useCallback(() => {
    isHovered.current = false;
    if (!isDragging.current) onCursorChange?.('default');
  }, [onCursorChange]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    const timeSinceInteraction =
      performance.now() - lastInteractionTime.current;
    const isIdle = !isDragging.current && timeSinceInteraction > 3000;

    if (isDragging.current) {
      // Direct drag rotation — already applied in onPointerMove
    } else if (isIdle && !(gyro && (gyro.beta !== 0 || gyro.gamma !== 0))) {
      // Idle: gentle auto-rotate
      // Decay velocity first
      velocity.current.x *= 0.95;
      velocity.current.y *= 0.95;

      const autoSpeed = 0.15;
      rotation.current.y += autoSpeed * delta;
      // Gently return x rotation toward 0
      rotation.current.x = THREE.MathUtils.lerp(rotation.current.x, 0, 0.02);
    } else if (
      gyro &&
      (gyro.beta !== 0 || gyro.gamma !== 0) &&
      !isDragging.current
    ) {
      // Mobile gyro (when not dragging)
      const maxTilt = 0.3;
      const targetX = THREE.MathUtils.clamp(
        (gyro.beta / 90) * maxTilt,
        -maxTilt,
        maxTilt
      );
      const targetY = THREE.MathUtils.clamp(
        (gyro.gamma / 90) * maxTilt,
        -maxTilt,
        maxTilt
      );
      rotation.current.x = THREE.MathUtils.lerp(
        rotation.current.x,
        targetX,
        0.08
      );
      rotation.current.y = THREE.MathUtils.lerp(
        rotation.current.y,
        targetY,
        0.08
      );
    } else if (!isDragging.current) {
      // Desktop pointer follow when recently interacted but not dragging
      const maxTilt = 0.3;
      const targetX = -pointer.y * maxTilt;
      const targetY = pointer.x * maxTilt;

      // Apply inertia decay
      velocity.current.x *= 0.92;
      velocity.current.y *= 0.92;

      // Blend between inertia and pointer follow based on velocity magnitude
      const velMag =
        Math.abs(velocity.current.x) + Math.abs(velocity.current.y);
      if (velMag > 0.001) {
        rotation.current.x += velocity.current.x;
        rotation.current.y += velocity.current.y;
      } else {
        rotation.current.x = THREE.MathUtils.lerp(
          rotation.current.x,
          targetX,
          0.08
        );
        rotation.current.y = THREE.MathUtils.lerp(
          rotation.current.y,
          targetY,
          0.08
        );
      }
    }

    groupRef.current.rotation.x = rotation.current.x;
    groupRef.current.rotation.y = rotation.current.y;

    // Hover scale
    const targetScale = isHovered.current ? 1.03 : 1.0;
    currentScale.current = THREE.MathUtils.lerp(
      currentScale.current,
      targetScale,
      0.1
    );
    groupRef.current.scale.setScalar(currentScale.current);
  });

  const cardColor = useMemo(() => new THREE.Color('#1a1f36'), []);
  const accentColor = useMemo(() => new THREE.Color('#3b82f6'), []);
  const greenColor = useMemo(() => new THREE.Color('#22c55e'), []);
  const whiteColor = useMemo(() => new THREE.Color('#f8fafc'), []);
  const mutedColor = useMemo(() => new THREE.Color('#94a3b8'), []);

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Card body */}
      <RoundedBox args={[3.4, 2.1, 0.06]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color={cardColor}
          clearcoat={1}
          clearcoatRoughness={0.1}
          roughness={0.3}
          metalness={0.1}
        />
      </RoundedBox>

      {/* StatusAt wordmark */}
      <Text
        position={[-1.25, 0.7, 0.04]}
        fontSize={0.16}
        color={whiteColor}
        anchorX="left"
        anchorY="middle"
      >
        StatusAt
      </Text>

      {/* Green status dot */}
      <mesh position={[1.35, 0.7, 0.04]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color={greenColor} />
      </mesh>

      {/* Case name label */}
      <Text
        position={[-1.25, 0.2, 0.04]}
        fontSize={0.1}
        color={mutedColor}
        anchorX="left"
        anchorY="middle"
      >
        Visa Application
      </Text>

      {/* Client name */}
      <Text
        position={[-1.25, 0.0, 0.04]}
        fontSize={0.15}
        color={whiteColor}
        anchorX="left"
        anchorY="middle"
      >
        Maria Santos
      </Text>

      {/* Status indicator dot */}
      <mesh position={[-1.25, -0.3, 0.04]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Status text */}
      <Text
        position={[-1.12, -0.3, 0.04]}
        fontSize={0.1}
        color={accentColor}
        anchorX="left"
        anchorY="middle"
      >
        Document Review
      </Text>

      {/* Progress bar background */}
      <mesh position={[0, -0.7, 0.04]}>
        <planeGeometry args={[2.8, 0.08]} />
        <meshBasicMaterial color={new THREE.Color('#334155')} />
      </mesh>

      {/* Progress bar fill (60%) */}
      <mesh position={[-0.56, -0.7, 0.05]}>
        <planeGeometry args={[1.68, 0.08]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Progress label */}
      <Text
        position={[-1.4, -0.55, 0.04]}
        fontSize={0.08}
        color={mutedColor}
        anchorX="left"
        anchorY="middle"
      >
        Progress
      </Text>

      {/* Progress count */}
      <Text
        position={[1.4, -0.55, 0.04]}
        fontSize={0.08}
        color={mutedColor}
        anchorX="right"
        anchorY="middle"
      >
        3/5
      </Text>

      {/* ===== BACK FACE ===== */}
      {/* Back face group — rotated 180° on Y so content reads correctly.
          Positive local Z here becomes negative Z in parent space (the back). */}
      <group rotation={[0, Math.PI, 0]}>
        {/* Decorative stripe */}
        <mesh position={[0, 0.45, 0.04]}>
          <planeGeometry args={[3.2, 0.12]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>

        {/* StatusAt wordmark — centered */}
        <Text
          position={[0, 0, 0.04]}
          fontSize={0.28}
          color={whiteColor}
          anchorX="center"
          anchorY="middle"
        >
          StatusAt
        </Text>

        {/* Tagline */}
        <Text
          position={[0, -0.3, 0.04]}
          fontSize={0.1}
          color={mutedColor}
          anchorX="center"
          anchorY="middle"
        >
          Real-time case tracking
        </Text>

        {/* Bottom decorative stripe */}
        <mesh position={[0, -0.65, 0.04]}>
          <planeGeometry args={[3.2, 0.06]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>
      </group>
    </group>
  );
};

export default CardMesh;
