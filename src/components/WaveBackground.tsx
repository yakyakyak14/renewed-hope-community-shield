import React, { useEffect, useMemo, useRef, useState } from 'react';

type Speed = 'slow' | 'medium' | 'fast';

interface NigerianWavesProps {
  waveColors?: string[]; // 3 colors
  backgroundColor?: string;
  mouseInteraction?: boolean;
  animationSpeed?: Speed; // slow | medium | fast
  amplitude?: number; // base amplitude in px
  frequency?: number; // base frequency
  opacity?: [number, number, number];
  gradients?: boolean;
  clickRipples?: boolean;
  responsiveBreakpoints?: boolean;
}

interface Ripple {
  id: number;
  x: number; // px from left
  y: number; // px from top
}

const SPEED_MAP: Record<Speed, number> = {
  slow: 0.01,
  medium: 0.02,
  fast: 0.035,
};

const DEFAULT_PHASES = [0, 1.2, 2.4];

const NigerianWavesBackground: React.FC<NigerianWavesProps> = ({
  waveColors = ['#008751', '#FFFFFF', '#228B22'],
  backgroundColor = '#F9F9F9',
  mouseInteraction = true,
  animationSpeed = 'medium',
  amplitude = 80,
  frequency = 0.012,
  opacity = [0.85, 0.65, 0.45],
  gradients = true,
  clickRipples = true,
  responsiveBreakpoints = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(SVGSVGElement | null)[]>([]);
  const frameRef = useRef<number>();
  const timeRef = useRef(0);
  const mouseTarget = useRef({ x: 0.5, y: 0.5 });
  const mouseSmooth = useRef({ x: 0.5, y: 0.5 });
  const amplitudeRef = useRef(amplitude);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [waveCount, setWaveCount] = useState(3);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Unique ids for gradients to avoid collisions when component is remounted
  const gradIds = useMemo(() => (
    [0, 1, 2].map(i => `ngrad-${i}-${Math.random().toString(36).slice(2)}`)
  ), []);

  // Responsive adjustments
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);
    const handleMql = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener?.('change', handleMql);

    const onResize = () => {
      if (!responsiveBreakpoints) return;
      const w = window.innerWidth;
      if (w <= 768) {
        setWaveCount(2);
        amplitudeRef.current = Math.min(amplitude, 50);
      } else if (w <= 1024) {
        setWaveCount(3);
        amplitudeRef.current = Math.min(amplitude, 65);
      } else {
        setWaveCount(3);
        amplitudeRef.current = amplitude;
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      mql.removeEventListener?.('change', handleMql);
    };
  }, [amplitude, responsiveBreakpoints]);

  // Mouse follow across the whole site without blocking UI interactions
  useEffect(() => {
    if (!mouseInteraction) return;
    let hoverTimeout: number | undefined;
    const onMove = (e: MouseEvent) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      mouseTarget.current.x = e.clientX / Math.max(1, vw);
      mouseTarget.current.y = e.clientY / Math.max(1, vh);
      // temporary amplitude boost on active movement
      amplitudeRef.current = Math.min(amplitudeRef.current + 1.5, amplitude * 1.15);
      if (hoverTimeout) window.clearTimeout(hoverTimeout);
      hoverTimeout = window.setTimeout(() => {
        amplitudeRef.current = Math.max(amplitudeRef.current - 2, amplitude);
      }, 200);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove as any);
  }, [mouseInteraction, amplitude]);

  // Click ripple and pulse
  useEffect(() => {
    if (!clickRipples) return;
    const onClick = (e: MouseEvent) => {
      const rect = document.documentElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now() + Math.random();
      setRipples(prev => {
        const next = [...prev, { id, x, y }];
        // keep at most 8 ripples
        return next.slice(-8);
      });
      // temporary pulse
      const base = amplitudeRef.current;
      amplitudeRef.current = Math.min(base * 1.25, amplitude * 1.4);
      window.setTimeout(() => {
        amplitudeRef.current = Math.max(amplitude, base);
      }, 500);
      // auto-remove ripple
      window.setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 1500);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [clickRipples, amplitude]);

  // Animation loop
  useEffect(() => {
    if (prefersReduced) return; // respect accessibility

    const speed = SPEED_MAP[animationSpeed] || SPEED_MAP.medium;
    const smoothing = 0.15; // smoothing_factor from spec

    const animate = () => {
      timeRef.current += speed;

      // ease mouse towards target
      mouseSmooth.current.x += (mouseTarget.current.x - mouseSmooth.current.x) * smoothing;
      mouseSmooth.current.y += (mouseTarget.current.y - mouseSmooth.current.y) * smoothing;

      for (let i = 0; i < layerRefs.current.length; i++) {
        const el = layerRefs.current[i];
        if (!el) continue;
        const phase = DEFAULT_PHASES[i] || 0;
        const ampLayer = amplitudeRef.current * (1 - i * 0.2);
        const wave = Math.sin(timeRef.current * (frequency * (1 + i * 0.1)) + phase);
        // mouse influence
        const centerDelta = (mouseSmooth.current.x - 0.5);
        const mouseOffset = centerDelta * (60 + i * 20);
        const xTranslate = wave * ampLayer * 0.2 + mouseOffset;
        const yTranslate = Math.cos(timeRef.current * (frequency * 0.6) + phase) * (4 + i * 2);

        el.style.transform = `translate3d(${xTranslate}px, ${yTranslate}px, 0)`;
        el.style.opacity = String(opacity[i] ?? 0.5);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [animationSpeed, frequency, opacity, prefersReduced]);

  // Base gradients decision
  const [grad1, grad2, grad3] = useMemo(() => {
    if (!gradients) return [waveColors[0], waveColors[1], waveColors[2]];
    return [
      `url(#${gradIds[0]})`,
      `url(#${gradIds[1]})`,
      `url(#${gradIds[2]})`,
    ];
  }, [gradients, waveColors, gradIds]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="nigerian-waves-background responsive-waves"
      style={{ background: backgroundColor }}
    >
      {/* Optional subtle base gradient */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, #F9F9F9 0%, #ffffff 50%, #eef5ef 100%)' }} />

      {/* Wave Layers */}
      <div className="absolute inset-0">
        {/* Layer 1 */}
        {waveCount >= 1 && (
          <svg
            ref={(el) => (layerRefs.current[0] = el)}
            className="absolute bottom-0 left-0 w-full h-full wave-layer"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
          >
            {gradients && (
              <defs>
                <linearGradient id={gradIds[0]} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#008751" />
                  <stop offset="50%" stopColor="#228B22" />
                  <stop offset="100%" stopColor="#32CD32" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M0,400 Q300,320 600,380 T1200,400 L1200,800 L0,800 Z"
              fill={grad1}
            />
          </svg>
        )}

        {/* Layer 2 */}
        {waveCount >= 2 && (
          <svg
            ref={(el) => (layerRefs.current[1] = el)}
            className="absolute bottom-0 left-0 w-full h-full wave-layer"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
          >
            {gradients && (
              <defs>
                <linearGradient id={gradIds[1]} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#F8F8F8" />
                  <stop offset="100%" stopColor="#E8E8E8" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M0,500 Q400,420 800,480 T1200,500 L1200,800 L0,800 Z"
              fill={grad2}
            />
          </svg>
        )}

        {/* Layer 3 */}
        {waveCount >= 3 && (
          <svg
            ref={(el) => (layerRefs.current[2] = el)}
            className="absolute bottom-0 left-0 w-full h-full wave-layer"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
          >
            {gradients && (
              <defs>
                <linearGradient id={gradIds[2]} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#228B22" />
                  <stop offset="50%" stopColor="#90EE90" />
                  <stop offset="100%" stopColor="#98FB98" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M0,600 Q200,550 400,580 Q600,610 800,580 Q1000,550 1200,580 L1200,800 L0,800 Z"
              fill={grad3}
            />
          </svg>
        )}
      </div>

      {/* Click Ripples */}
      {clickRipples && ripples.map(r => (
        <span
          key={r.id}
          className="ripple"
          style={{ left: `${r.x}px`, top: `${r.y}px` }}
        />
      ))}
    </div>
  );
};

export default NigerianWavesBackground;