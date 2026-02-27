import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Blob {
  id: number;
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
  scaleRange: [number, number];
  duration: number;
  delay: number;
  color: string;
  opacity: number;
  rotation: number;
}

const colors = [
  'hsl(271, 76%, 53%)', // brand purple
  'hsl(237, 83%, 57%)', // blue-purple
  'hsl(271, 76%, 63%)', // lighter purple
  'hsl(257, 80%, 55%)', // mid purple
  'hsl(217, 91%, 60%)', // brand blue
  'hsl(280, 70%, 50%)', // deep purple
  'hsl(250, 75%, 58%)', // violet
];

// Six circle variants: perfect circle, tall oval, wide oval, small dot, large soft, medium
const circleVariants: { cx: number; cy: number; rx: number; ry: number }[] = [
  { cx: 50, cy: 50, rx: 44, ry: 44 }, // perfect circle
  { cx: 50, cy: 50, rx: 36, ry: 46 }, // tall oval
  { cx: 50, cy: 50, rx: 46, ry: 34 }, // wide oval
  { cx: 50, cy: 50, rx: 48, ry: 48 }, // large circle
  { cx: 50, cy: 50, rx: 30, ry: 30 }, // small circle
  { cx: 50, cy: 50, rx: 40, ry: 48 }, // slightly tall
];

interface FloatingBlobsProps {
  side?: 'both' | 'left' | 'right';
  count?: number;
}

const generateBlobs = (
  count: number,
  side: 'both' | 'left' | 'right'
): Blob[] => {
  const blobs: Blob[] = [];
  for (let i = 0; i < count; i++) {
    let x: number;
    if (side === 'left') {
      x = -8 + ((i * 17) % 20);
    } else if (side === 'right') {
      x = 72 + ((i * 17) % 20);
    } else {
      x = i % 2 === 0 ? -8 + ((i * 17) % 18) : 72 + ((i * 17) % 18);
    }

    const y = -8 + ((i * 31) % 90);

    blobs.push({
      id: i,
      x,
      y,
      size: 80 + ((i * 53) % 280),
      driftX: (i % 2 === 0 ? 1 : -1) * (15 + ((i * 13) % 30)),
      driftY: (i % 3 === 0 ? -1 : 1) * (18 + ((i * 9) % 30)),
      scaleRange: [0.85 + ((i * 3) % 4) * 0.05, 1.1 + ((i * 7) % 3) * 0.05],
      duration: 16 + ((i * 11) % 22),
      delay: (i * 1.1) % 8,
      color: colors[i % colors.length],
      opacity: 0.06 + ((i * 3) % 6) * 0.015,
      rotation: ((i * 37) % 40) - 20,
    });
  }
  return blobs;
};

const FloatingBlobs = ({ side = 'both', count = 14 }: FloatingBlobsProps) => {
  const blobs = useMemo(() => generateBlobs(count, side), [count, side]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map(blob => {
        const variant = circleVariants[blob.id % circleVariants.length];

        return (
          <motion.div
            key={blob.id}
            className="absolute"
            style={{
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              width: blob.size,
              height: blob.size,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: blob.scaleRange[0],
              rotate: blob.rotation,
              opacity: 0,
            }}
            animate={{
              x: [0, blob.driftX, -blob.driftX * 0.6, blob.driftX * 0.4, 0],
              y: [0, blob.driftY * 0.5, blob.driftY, -blob.driftY * 0.3, 0],
              scale: [
                blob.scaleRange[0],
                blob.scaleRange[1],
                blob.scaleRange[0],
                blob.scaleRange[1],
                blob.scaleRange[0],
              ],
              rotate: [
                blob.rotation,
                blob.rotation + 6,
                blob.rotation - 4,
                blob.rotation + 2,
                blob.rotation,
              ],
              opacity: [
                blob.opacity,
                blob.opacity * 1.4,
                blob.opacity * 0.7,
                blob.opacity * 1.3,
                blob.opacity,
              ],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: blob.delay,
            }}
          >
            <svg
              viewBox="0 0 100 100"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse
                cx={variant.cx}
                cy={variant.cy}
                rx={variant.rx}
                ry={variant.ry}
                fill={blob.color}
                stroke="none"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingBlobs;
