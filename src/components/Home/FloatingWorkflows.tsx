import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Each node is a rounded rectangle, matching the real flow builder
interface Node {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Connections reference node indices: [fromIndex, fromSide, toIndex, toSide]
// Sides: 'bottom' | 'top' | 'right' | 'left'
type Side = 'bottom' | 'top' | 'right' | 'left';
type Connection = [number, Side, number, Side];

interface Blueprint {
  nodes: Node[];
  connections: Connection[];
  viewBox: string;
}

interface FloatingShape {
  id: number;
  blueprint: Blueprint;
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  rotation: number;
  pixelSize: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

const R = 8; // corner radius for rounded rects

const buildRoundedRect = (node: Node): string => {
  const { x, y, w, h } = node;
  return `M${x + R},${y} h${w - 2 * R} a${R},${R} 0 0 1 ${R},${R} v${h - 2 * R} a${R},${R} 0 0 1 -${R},${R} h-${w - 2 * R} a${R},${R} 0 0 1 -${R},-${R} v-${h - 2 * R} a${R},${R} 0 0 1 ${R},-${R} Z`;
};

// Orthogonal connector (right-angle routing like the real flow builder)
const buildOrthogonalPath = (
  from: Node,
  fromSide: Side,
  to: Node,
  toSide: Side
): string => {
  let x1: number, y1: number, x2: number, y2: number;

  // Start point
  if (fromSide === 'bottom') {
    x1 = from.x + from.w / 2;
    y1 = from.y + from.h;
  } else if (fromSide === 'top') {
    x1 = from.x + from.w / 2;
    y1 = from.y;
  } else if (fromSide === 'right') {
    x1 = from.x + from.w;
    y1 = from.y + from.h / 2;
  } else {
    x1 = from.x;
    y1 = from.y + from.h / 2;
  }

  // End point
  if (toSide === 'top') {
    x2 = to.x + to.w / 2;
    y2 = to.y;
  } else if (toSide === 'bottom') {
    x2 = to.x + to.w / 2;
    y2 = to.y + to.h;
  } else if (toSide === 'left') {
    x2 = to.x;
    y2 = to.y + to.h / 2;
  } else {
    x2 = to.x + to.w;
    y2 = to.y + to.h / 2;
  }

  // Orthogonal routing
  if (fromSide === 'bottom' && toSide === 'top') {
    const midY = (y1 + y2) / 2;
    return `M${x1},${y1} V${midY} H${x2} V${y2}`;
  }
  if (fromSide === 'right' && toSide === 'left') {
    const midX = (x1 + x2) / 2;
    return `M${x1},${y1} H${midX} V${y2} H${x2}`;
  }
  if (fromSide === 'bottom' && toSide === 'left') {
    return `M${x1},${y1} V${y2} H${x2}`;
  }
  if (fromSide === 'right' && toSide === 'top') {
    return `M${x1},${y1} H${x2} V${y2}`;
  }
  // Fallback: simple L-bend
  return `M${x1},${y1} V${y2} H${x2}`;
};

// All rounded rectangles, matching real flow builder nodes
const blueprints: Blueprint[] = [
  // 3-step vertical flow
  {
    nodes: [
      { x: 10, y: 0, w: 80, h: 36 },
      { x: 10, y: 60, w: 80, h: 36 },
      { x: 10, y: 120, w: 80, h: 36 },
    ],
    connections: [
      [0, 'bottom', 1, 'top'],
      [1, 'bottom', 2, 'top'],
    ],
    viewBox: '0 0 100 160',
  },
  // Branch: 1 → 2 side by side
  {
    nodes: [
      { x: 30, y: 0, w: 80, h: 36 },
      { x: 0, y: 80, w: 60, h: 36 },
      { x: 80, y: 80, w: 60, h: 36 },
    ],
    connections: [
      [0, 'bottom', 1, 'top'],
      [0, 'bottom', 2, 'top'],
    ],
    viewBox: '0 0 140 120',
  },
  // 4-step vertical
  {
    nodes: [
      { x: 10, y: 0, w: 80, h: 32 },
      { x: 10, y: 52, w: 80, h: 32 },
      { x: 10, y: 104, w: 80, h: 32 },
      { x: 10, y: 156, w: 80, h: 32 },
    ],
    connections: [
      [0, 'bottom', 1, 'top'],
      [1, 'bottom', 2, 'top'],
      [2, 'bottom', 3, 'top'],
    ],
    viewBox: '0 0 100 192',
  },
  // 2-step horizontal
  {
    nodes: [
      { x: 0, y: 10, w: 72, h: 36 },
      { x: 100, y: 10, w: 72, h: 36 },
    ],
    connections: [[0, 'right', 1, 'left']],
    viewBox: '0 0 176 56',
  },
  // L-shape: right then down
  {
    nodes: [
      { x: 0, y: 0, w: 72, h: 36 },
      { x: 100, y: 0, w: 72, h: 36 },
      { x: 100, y: 60, w: 72, h: 36 },
    ],
    connections: [
      [0, 'right', 1, 'left'],
      [1, 'bottom', 2, 'top'],
    ],
    viewBox: '0 0 176 100',
  },
  // 2-step with converge: 2 → 1
  {
    nodes: [
      { x: 0, y: 0, w: 60, h: 36 },
      { x: 80, y: 0, w: 60, h: 36 },
      { x: 30, y: 80, w: 80, h: 36 },
    ],
    connections: [
      [0, 'bottom', 2, 'top'],
      [1, 'bottom', 2, 'top'],
    ],
    viewBox: '0 0 140 120',
  },
];

// Actual brand colors
const colors = [
  'hsl(217, 91%, 60%)', // --brand-blue
  'hsl(271, 76%, 53%)', // --brand-purple
  'hsl(217, 91%, 60%)', // brand-blue again
  'hsl(271, 76%, 53%)', // brand-purple again
  'hsl(237, 83%, 57%)', // midpoint blue-purple
  'hsl(217, 91%, 60%)', // brand-blue
];

const generateShapes = (count: number): FloatingShape[] => {
  const shapes: FloatingShape[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    shapes.push({
      id: i,
      blueprint: blueprints[i % blueprints.length],
      startX: 2 + col * 22 + ((i * 7) % 12),
      startY: -8 + row * 38 + ((i * 13) % 20),
      driftX: (i % 2 === 0 ? 1 : -1) * (20 + ((i * 11) % 30)),
      driftY: (i % 3 === 0 ? -1 : 1) * (12 + ((i * 7) % 20)),
      rotation: ((i * 4) % 10) - 5,
      pixelSize: 180 + ((i * 37) % 100),
      opacity: 0.14 + ((i * 3) % 4) * 0.04,
      duration: 22 + ((i * 7) % 16),
      delay: (i * 1.3) % 5,
      color: colors[i % colors.length],
    });
  }
  return shapes;
};

const FloatingWorkflows = () => {
  const shapes = useMemo(() => generateShapes(10), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

      {shapes.map(shape => {
        const bp = shape.blueprint;
        const [, , vbW, vbH] = bp.viewBox.split(' ').map(Number);
        const aspect = vbW / vbH;
        const w = aspect >= 1 ? shape.pixelSize : shape.pixelSize * aspect;
        const h = aspect >= 1 ? shape.pixelSize / aspect : shape.pixelSize;

        return (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              left: `${shape.startX}%`,
              top: `${shape.startY}%`,
            }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
            animate={{
              x: [0, shape.driftX, -shape.driftX * 0.5, shape.driftX * 0.3, 0],
              y: [0, shape.driftY * 0.6, shape.driftY, -shape.driftY * 0.4, 0],
              rotate: [
                0,
                shape.rotation,
                -shape.rotation * 0.5,
                shape.rotation * 0.3,
                0,
              ],
              opacity: [
                shape.opacity,
                shape.opacity * 1.3,
                shape.opacity * 0.85,
                shape.opacity * 1.15,
                shape.opacity,
              ],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: shape.delay,
            }}
          >
            <svg width={w} height={h} viewBox={bp.viewBox} fill="none">
              {/* Connectors - orthogonal like the real flow builder */}
              {bp.connections.map(([fromIdx, fromSide, toIdx, toSide], ci) => (
                <path
                  key={`c-${ci}`}
                  d={buildOrthogonalPath(
                    bp.nodes[fromIdx],
                    fromSide,
                    bp.nodes[toIdx],
                    toSide
                  )}
                  stroke={shape.color}
                  strokeWidth={2.5}
                  strokeOpacity={0.45}
                  fill="none"
                />
              ))}

              {/* Nodes - rounded rectangles */}
              {bp.nodes.map((node, ni) => (
                <path
                  key={`n-${ni}`}
                  d={buildRoundedRect(node)}
                  stroke={shape.color}
                  strokeWidth={2.5}
                  strokeOpacity={0.55}
                  fill={shape.color}
                  fillOpacity={0.1}
                />
              ))}
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingWorkflows;
