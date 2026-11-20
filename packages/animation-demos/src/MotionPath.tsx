import { useId, useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(useGSAP, MotionPathPlugin);

const route = 'M 76 218 C 150 140, 260 118, 378 158 C 482 194, 578 96, 684 128';

const hubs = [
  {
    code: 'JKT',
    port: 'Pelabuhan Sunda',
    stop: 0,
    x: 76,
    y: 218,
    labelY: 254,
  },
  {
    code: 'SMG',
    port: 'Terminal Tengah',
    stop: 50,
    x: 378,
    y: 158,
    labelY: 196,
  },
  {
    code: 'SBY',
    port: 'Dermaga Timur',
    stop: 100,
    x: 684,
    y: 128,
    labelY: 164,
  },
] as const;

export default function MotionPath() {
  const root = useRef<HTMLElement>(null);
  const token = useRef<SVGGElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [progress, setProgress] = useState(0);
  const rangeId = useId();

  useGSAP(
    () => {
      if (!token.current) return;
      gsap.set(token.current, { transformOrigin: '50% 50%' });
      tween.current = gsap.to(token.current, {
        motionPath: { path: route, autoRotate: true },
        duration: 1,
        ease: 'none',
        paused: true,
      });
      return () => {
        tween.current = null;
      };
    },
    { scope: root },
  );

  function seek(value: number) {
    setProgress(value);
    // Direct seek updates position immediately without transition, supporting reduced motion.
    tween.current?.progress(value / 100);
  }

  const activeHub =
    progress < 34
      ? 'JKT · Pelabuhan Sunda'
      : progress < 84
        ? 'SMG · Terminal Tengah'
        : 'SBY · Dermaga Timur';
  const distanceKm = Math.round((progress / 100) * 782);

  return (
    <section
      ref={root}
      style={
        {
          background: '#09090b',
          color: '#fafafa',
          padding: 'clamp(24px, 4.5vw, 56px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 24,
          '--focus': '#ffffff',
        } as CSSProperties
      }
    >
      <header
        style={{
          maxWidth: 1040,
          width: '100%',
          margin: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'end',
          gap: 16,
        }}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#a1a1aa',
            }}
          >
            Koridor Laut Jawa · Jalur Ekspedisi
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(1.85rem, 3.8vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 1.04,
            }}
          >
            Pelacakan armada di sepanjang rute.
          </h2>
        </div>
        <div
          style={{
            padding: '8px 14px',
            borderRadius: 999,
            border: '1px solid #27272a',
            background: '#111114',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#e4e4e7',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {activeHub} · {distanceKm} km
        </div>
      </header>

      <figure
        style={{
          maxWidth: 1040,
          width: '100%',
          margin: 'auto',
          display: 'grid',
          gap: 12,
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 760 300"
          style={{
            display: 'block',
            width: '100%',
            backgroundColor: '#111114',
            backgroundImage:
              'radial-gradient(ellipse at 52% 40%, #1d1d22, transparent 68%)',
            border: '1px solid #27272a',
            borderRadius: 16,
          }}
        >
          {/* Cartographic graticule */}
          <path
            d="M 28 75 H 732 M 28 150 H 732 M 28 225 H 732 M 150 24 V 276 M 380 24 V 276 M 610 24 V 276"
            fill="none"
            stroke="#222226"
            strokeWidth="1"
            strokeDasharray="3 7"
          />
          {/* Subtle monochrome coastline & topographic arcs */}
          <path
            d="M 20 264 Q 160 226 300 244 T 580 218 T 744 238 L 744 294 L 20 294 Z"
            fill="#16161a"
            stroke="#27272a"
            strokeWidth="1"
          />
          <circle
            cx="76"
            cy="218"
            r="46"
            fill="none"
            stroke="#27272a"
            strokeDasharray="2 6"
          />
          <circle
            cx="684"
            cy="128"
            r="46"
            fill="none"
            stroke="#27272a"
            strokeDasharray="2 6"
          />
          <text
            x="714"
            y="46"
            textAnchor="end"
            fill="#71717a"
            fontSize="11"
            fontWeight="700"
            letterSpacing="0.14em"
          >
            U ↑ · 06°LS
          </text>

          {/* Planned & completed shipping route */}
          <path
            d={route}
            fill="none"
            stroke="#3f3f46"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={route}
            pathLength="100"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progress} 100`}
          />

          {hubs.map(({ code, x, y, labelY }) => (
            <g key={code}>
              <circle
                cx={x}
                cy={y}
                r="13"
                fill="#09090b"
                stroke="#a1a1aa"
                strokeWidth="2"
              />
              <circle cx={x} cy={y} r="3.5" fill="#fafafa" />
              <text
                x={x}
                y={labelY}
                textAnchor="middle"
                fill="#e4e4e7"
                fontSize="13"
                fontWeight="700"
                letterSpacing="0.1em"
              >
                {code}
              </text>
            </g>
          ))}

          <g ref={token} data-motion-path-token transform="translate(76 218)">
            <circle r="16" fill="#ffffff" stroke="#09090b" strokeWidth="2.5" />
            <path d="M -5 -6 L 8 0 L -5 6 L -2 0 Z" fill="#09090b" />
          </g>
        </svg>
        <figcaption
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 8,
            color: '#a1a1aa',
            fontSize: '0.82rem',
          }}
        >
          <span>
            JKT Pelabuhan Sunda → SMG Terminal Tengah → SBY Dermaga Timur
          </span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            Total jarak koridor 782 km
          </span>
        </figcaption>
      </figure>

      <div
        style={{
          maxWidth: 1040,
          width: '100%',
          margin: 'auto',
          padding: 20,
          borderRadius: 14,
          background: '#111114',
          border: '1px solid #27272a',
          display: 'grid',
          gap: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label htmlFor={rangeId} style={{ fontWeight: 700 }}>
              Progres lintasan
            </label>
            <span
              aria-hidden="true"
              style={{
                color: '#a1a1aa',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 600,
              }}
            >
              {progress}%
            </span>
          </div>
          <div
            role="group"
            aria-label="Lompat ke pelabuhan transit"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}
          >
            {hubs.map((hub) => (
              <button
                key={hub.code}
                type="button"
                onClick={() => seek(hub.stop)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  border:
                    progress === hub.stop
                      ? '1px solid #ffffff'
                      : '1px solid #27272a',
                  background: progress === hub.stop ? '#ffffff' : '#18181b',
                  color: progress === hub.stop ? '#09090b' : '#d4d4d8',
                  font: 'inherit',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {hub.code} · {hub.port}
              </button>
            ))}
          </div>
        </div>
        <input
          id={rangeId}
          type="range"
          min={0}
          max={100}
          value={progress}
          aria-valuetext={`${progress}%`}
          onChange={(event) => seek(event.currentTarget.valueAsNumber)}
          style={{
            width: '100%',
            minHeight: 34,
            margin: 0,
            accentColor: '#ffffff',
            cursor: 'pointer',
          }}
        />
      </div>
    </section>
  );
}
