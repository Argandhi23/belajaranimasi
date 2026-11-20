import { useRef, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ROUTE_PATH =
  'M 64 226 C 154 96, 246 96, 336 168 S 514 238, 600 124 L 696 76';

const phases = [
  {
    code: '01',
    name: 'Penemuan',
    summary: 'Audit merek, wawancara pemangku kepentingan, dan pemetaan arah.',
    x: 64,
    y: 226,
    labelX: 96,
    labelY: 264,
  },
  {
    code: '02',
    name: 'Arsitektur',
    summary: 'Penyusunan sistem grid, hierarki informasi, dan prototipe inti.',
    x: 336,
    y: 168,
    labelX: 374,
    labelY: 132,
  },
  {
    code: '03',
    name: 'Produksi',
    summary:
      'Rekayasa antarmuka responsif, interaksi halus, dan optimasi aset.',
    x: 600,
    y: 124,
    labelX: 562,
    labelY: 88,
  },
  {
    code: '04',
    name: 'Peluncuran',
    summary: 'Pengujian lintas perangkat, publikasi rilis, dan panduan tim.',
    x: 696,
    y: 76,
    labelX: 662,
    labelY: 42,
  },
] as const;

export default function SvgDraw() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        if (!stage.current || !path.current) return;
        const length = path.current.getTotalLength();
        const tween = gsap.fromTo(
          path.current,
          {
            strokeDasharray: length,
            strokeDashoffset: length,
          },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: stage.current,
              start: 'top 55%',
              end: 'bottom 35%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
        let alive = true;
        void document.fonts.ready.then(() => {
          if (alive) tween.scrollTrigger?.refresh();
        });
        return () => {
          alive = false;
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-testid="demo-svg-draw"
      style={
        {
          color: '#09090b',
          background: '#ffffff',
          '--focus': '#09090b',
        } as CSSProperties
      }
    >
      <header
        style={{
          maxWidth: 1120,
          margin: 'auto',
          padding: 'clamp(28px, 4.5vw, 52px) clamp(20px, 5vw, 56px)',
          display: 'grid',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 10,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#52525b',
          }}
        >
          <span>Studio Karsa · Metode Kerja</span>
          <span>Empat Fase Terukur</span>
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(1.9rem, 4.2vw, 3.45rem)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: 1.03,
            textWrap: 'balance',
          }}
        >
          Dari sketsa awal hingga ruang nyata.
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '52ch',
            color: '#52525b',
            fontSize: '0.96rem',
            lineHeight: 1.65,
          }}
        >
          Setiap kolaborasi bergerak lewat empat gerbang kerja yang jelas —
          menjaga konsistensi rancangan sejak riset sampai peluncuran.
        </p>
      </header>

      <div
        ref={stage}
        data-testid="svg-draw-stage"
        style={{
          minHeight: '92svh',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          alignContent: 'center',
          gap: 24,
          position: 'relative',
          padding: 'clamp(28px, 5vw, 56px) clamp(20px, 5vw, 56px)',
          overflow: 'hidden',
          borderTop: '1px solid #e4e4e7',
          background:
            'linear-gradient(rgba(9, 9, 11, 0.045) 1px, transparent 1px) center / 44px 44px, linear-gradient(90deg, rgba(9, 9, 11, 0.045) 1px, transparent 1px) center / 44px 44px, #fafafa',
        }}
      >
        <div
          style={{
            maxWidth: 1040,
            width: '100%',
            minWidth: 0,
            margin: 'auto',
            padding: 'clamp(16px, 3vw, 34px)',
            border: '1px solid #d4d4d8',
            borderRadius: 16,
            background: '#ffffff',
          }}
        >
          <svg
            viewBox="0 0 760 290"
            aria-label="Diagram empat fase kerja studio dari penemuan hingga peluncuran"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          >
            <path
              aria-hidden="true"
              d="M 24 226 H 736 M 24 124 H 736"
              fill="none"
              stroke="#f4f4f5"
              strokeWidth="1.5"
            />
            <path
              d={ROUTE_PATH}
              fill="none"
              stroke="#d4d4d8"
              strokeWidth="2"
              strokeDasharray="4 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              ref={path}
              data-testid="svg-draw-path"
              d={ROUTE_PATH}
              fill="none"
              stroke="#09090b"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {phases.map((node) => (
              <g key={node.code}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="11"
                  fill="#ffffff"
                  stroke="#09090b"
                  strokeWidth="2.5"
                />
                <circle cx={node.x} cy={node.y} r="3.5" fill="#09090b" />
                <text
                  x={node.labelX}
                  y={node.labelY}
                  textAnchor="middle"
                  fill="#09090b"
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                  }}
                >
                  {node.code} · {node.name.toUpperCase()}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <ol
          style={{
            maxWidth: 1040,
            width: '100%',
            margin: 'auto',
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 12,
          }}
        >
          {phases.map((phase) => (
            <li
              key={phase.code}
              style={{
                padding: '16px 18px',
                border: '1px solid #e4e4e7',
                borderRadius: 12,
                background: '#ffffff',
                display: 'grid',
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#52525b',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                FASE {phase.code}
              </span>
              <strong style={{ fontSize: '1rem', color: '#09090b' }}>
                {phase.name}
              </strong>
              <span
                style={{
                  fontSize: '0.82rem',
                  color: '#52525b',
                  lineHeight: 1.55,
                }}
              >
                {phase.summary}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
