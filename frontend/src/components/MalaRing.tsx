import React, { useEffect, useRef } from 'react';

interface MalaRingProps {
  count: number; // 0–108 beads filled
}

const TOTAL_BEADS = 108;
const CANVAS_SIZE = 260;
const RING_RADIUS = 100;
const BEAD_RADIUS = 5;

export default function MalaRing({ count }: MalaRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const countRef = useRef(count);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef(0);
  // Breathing animation state
  const breathRef = useRef(0);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = (timestamp: number) => {
      // Throttle to ~30fps
      if (timestamp - lastFrameRef.current < 33) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameRef.current = timestamp;

      const cx = CANVAS_SIZE / 2;
      const cy = CANVAS_SIZE / 2;

      // Smooth rotation
      targetRotationRef.current += 0.003;
      rotationRef.current += (targetRotationRef.current - rotationRef.current) * 0.08;

      // Breathing: gentle sine wave for Om symbol scale
      breathRef.current += 0.04;
      const breathScale = 1 + Math.sin(breathRef.current) * 0.06;

      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw ring track
      ctx.beginPath();
      ctx.arc(cx, cy, RING_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = 'oklch(0.7 0.08 60 / 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const currentCount = countRef.current;

      // Draw beads
      for (let i = 0; i < TOTAL_BEADS; i++) {
        const angle = (i / TOTAL_BEADS) * Math.PI * 2 + rotationRef.current;
        const x = cx + Math.cos(angle) * RING_RADIUS;
        const y = cy + Math.sin(angle) * RING_RADIUS;
        const filled = i < currentCount;

        ctx.beginPath();
        ctx.arc(x, y, BEAD_RADIUS, 0, Math.PI * 2);

        if (filled) {
          ctx.fillStyle = 'oklch(0.72 0.18 55)';
        } else {
          ctx.fillStyle = 'oklch(0.85 0.06 60 / 0.5)';
        }
        ctx.fill();
      }

      // Center Om symbol with breathing scale
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(breathScale, breathScale);
      ctx.font = '32px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'oklch(0.65 0.18 55)';
      ctx.fillText('ॐ', 0, 0);
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="w-48 h-48"
      style={{ imageRendering: 'auto' }}
    />
  );
}
