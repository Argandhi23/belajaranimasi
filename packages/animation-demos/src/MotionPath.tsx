import { useId, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(useGSAP, MotionPathPlugin);

const route =
  'M 66 208 C 155 195 145 65 238 60 C 324 55 412 125 375 181 C 344 228 255 189 295 134 C 347 62 495 71 571 131';

const waypoints = [
  { name: 'Awal', x: 66, y: 208, labelY: 240 },
  { name: 'Tikungan', x: 375, y: 181, labelY: 216 },
  { name: 'Tujuan', x: 571, y: 131, labelY: 166 },
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
      // Both the token and the path use the same SVG coordinates.
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
    // A direct seek has no transition, so it also works with reduced motion.
    tween.current?.progress(value / 100);
  }

  return (
    <section
      ref={root}
      style={{
        background: '#151326',
        color: '#faf4e9',
        padding: 'clamp(20px, 4.5vw, 58px)',
        display: 'grid',
        gap: 20,
      }}
    >
      <figure style={{ display: 'grid', gap: 12, margin: 0 }}>
        <svg
          aria-hidden="true"
          viewBox="0 0 640 265"
          style={{
            display: 'block',
            width: '100%',
            backgroundColor: '#211c38',
            backgroundImage:
              'radial-gradient(ellipse at 62% 32%, #382f55, transparent 62%), radial-gradient(#6f6388 1px, transparent 1px)',
            backgroundSize: '100% 100%, 17px 17px',
            border: '1px solid #55476e',
            borderRadius: 12,
          }}
        >
          <path
            d="M 24 208 H 615 M 24 131 H 615 M 66 25 V 240 M 571 25 V 240"
            fill="none"
            stroke="#655679"
            strokeWidth="1"
            strokeDasharray="3 8"
          />
          <path d={route} fill="none" stroke="#9890bd" strokeWidth="3" />
          <path
            d={route}
            pathLength="100"
            fill="none"
            stroke="#deef98"
            strokeWidth="4"
            strokeDasharray={`${progress} 100`}
          />
          {waypoints.map(({ name, x, y, labelY }, index) => (
            <g key={name}>
              <circle
                cx={x}
                cy={y}
                r="13"
                fill="#25203c"
                stroke="#bdb2df"
                strokeWidth="2"
              />
              <circle cx={x} cy={y} r="4" fill="#d4c8ff" />
              <text
                x={x}
                y={labelY}
                textAnchor="middle"
                fill="#eee6ff"
                fontSize="22"
                fontWeight="700"
              >
                {String.fromCharCode(65 + index)}
              </text>
            </g>
          ))}
          <g ref={token} data-motion-path-token transform="translate(66 208)">
            <circle r="17" fill="#deef98" stroke="#262635" strokeWidth="2" />
            <path d="M -6 -7 L 9 0 L -6 7 L -2 0 Z" fill="#222b23" />
          </g>
        </svg>
        <figcaption style={{ color: '#e0d7f0', fontSize: '0.875rem' }}>
          A · Awal &ensp; B · Tikungan &ensp; C · Tujuan
        </figcaption>
      </figure>
      <div style={{ display: 'grid', gap: 8 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            fontWeight: 650,
          }}
        >
          <label htmlFor={rangeId}>Progres lintasan</label>
          <span
            aria-hidden="true"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {progress}%
          </span>
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
            minHeight: 36,
            margin: 0,
            accentColor: '#deef98',
          }}
        />
        <p style={{ color: '#e0d7f0', fontSize: '0.875rem', margin: 0 }}>
          Geser pengatur untuk mengikuti belokan dari awal sampai tujuan.
        </p>
      </div>
    </section>
  );
}
