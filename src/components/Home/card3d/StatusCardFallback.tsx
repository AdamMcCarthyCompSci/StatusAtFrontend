import { useState } from 'react';

interface StatusCardFallbackProps {
  className?: string;
  enableHoverTilt?: boolean;
}

const StatusCardFallback = ({
  className = '',
  enableHoverTilt = true,
}: StatusCardFallbackProps) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableHoverTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -10, y: x * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsDragging(false);
  };

  return (
    <div className={`relative ${className}`} style={{ perspective: '1000px' }}>
      <div
        className={`relative mx-auto w-full max-w-[340px] animate-glowPulse rounded-2xl border border-border bg-gradient-to-br from-card to-background p-6 shadow-2xl transition-transform duration-300 ease-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          aspectRatio: '3.4 / 2.1',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        {/* Glossy overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5" />

        {/* Card content */}
        <div className="relative flex h-full flex-col justify-between">
          {/* Top row: wordmark */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold tracking-wide text-foreground/90">
              StatusAt
            </span>
            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
          </div>

          {/* Middle: case info */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Visa Application
            </p>
            <p className="text-sm font-semibold text-foreground">
              Maria Santos
            </p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Document Review
              </span>
            </div>
          </div>

          {/* Bottom: progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>3/5</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-primary to-blue-600"
                style={{ width: '60%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCardFallback;
