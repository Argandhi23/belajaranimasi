import { useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(useGSAP, Flip);

type Layout = 'grid' | 'list';

const works = [
  {
    code: '01',
    category: 'Arsitektur',
    year: '2026',
    title: 'Paviliun Senja',
    summary:
      'Ruang baca terbuka dengan kanopi beton kantilever dan bukaan cahaya utara.',
    cover: 'pavilion',
  },
  {
    code: '02',
    category: 'Editorial',
    year: '2025',
    title: 'Monograf Aksara',
    summary:
      'Buku cetak 240 halaman mengenai sistem grid modern dan ritme tipografi.',
    cover: 'monograph',
  },
  {
    code: '03',
    category: 'Objek',
    year: '2026',
    title: 'Jam Meja M-04',
    summary:
      'Penunjuk waktu mekanis berbadan baja hitam matte dengan jarum kontras tinggi.',
    cover: 'clock',
  },
] as const;

function WorkCover({ kind }: { kind: (typeof works)[number]['cover'] }) {
  if (kind === 'pavilion') {
    return (
      <svg
        viewBox="0 0 180 180"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <rect width="180" height="180" fill="#09090b" />
        <rect x="24" y="42" width="132" height="18" fill="#fafafa" />
        <rect x="34" y="60" width="22" height="82" fill="#d4d4d8" />
        <rect x="78" y="60" width="22" height="82" fill="#fafafa" />
        <rect x="122" y="60" width="22" height="82" fill="#71717a" />
        <rect x="20" y="142" width="140" height="8" fill="#fafafa" />
      </svg>
    );
  }
  if (kind === 'monograph') {
    return (
      <svg
        viewBox="0 0 180 180"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <rect width="180" height="180" fill="#111114" />
        <rect x="32" y="24" width="116" height="132" rx="4" fill="#fafafa" />
        <line
          x1="90"
          y1="24"
          x2="90"
          y2="156"
          stroke="#d4d4d8"
          strokeWidth="1.5"
        />
        <rect x="44" y="40" width="34" height="12" fill="#09090b" />
        <rect x="44" y="60" width="34" height="4" fill="#52525b" />
        <rect x="44" y="70" width="26" height="4" fill="#a1a1aa" />
        <rect x="102" y="40" width="34" height="54" fill="#09090b" />
        <circle cx="119" cy="67" r="11" fill="#fafafa" />
        <rect x="102" y="106" width="34" height="4" fill="#52525b" />
        <rect x="102" y="116" width="24" height="4" fill="#a1a1aa" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 180 180"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <rect width="180" height="180" fill="#09090b" />
      <rect
        x="32"
        y="32"
        width="116"
        height="116"
        rx="22"
        fill="#18181b"
        stroke="#3f3f46"
        strokeWidth="2"
      />
      <circle
        cx="90"
        cy="90"
        r="40"
        fill="#09090b"
        stroke="#fafafa"
        strokeWidth="2"
      />
      <line
        x1="90"
        y1="90"
        x2="90"
        y2="60"
        stroke="#fafafa"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="90"
        y1="90"
        x2="112"
        y2="98"
        stroke="#a1a1aa"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="90" cy="90" r="4" fill="#ffffff" />
    </svg>
  );
}

export default function FlipGallery() {
  const root = useRef<HTMLElement>(null);
  const [layout, setLayout] = useState<Layout>('grid');
  const previous = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const motion = useRef(false);

  useGSAP(
    () => {
      const items = root.current?.querySelectorAll('.flip-print');
      if (!items) return;
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        motion.current = true;
        return () => {
          motion.current = false;
          previous.current = null;
          Flip.killFlipsOf(items);
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const before = previous.current;
      previous.current = null;
      if (before && motion.current) {
        Flip.from(before, {
          duration: 0.55,
          ease: 'power3.inOut',
          scale: true,
          nested: true,
        });
      }
    },
    { scope: root, dependencies: [layout], revertOnUpdate: true },
  );

  function changeLayout(next: Layout) {
    if (next === layout) return;
    const items = root.current?.querySelectorAll('.flip-print');
    if (motion.current && items) previous.current = Flip.getState(items);
    setLayout(next);
  }

  return (
    <section
      ref={root}
      data-flip-gallery
      data-layout={layout}
      aria-labelledby="flip-title"
      style={
        {
          background: '#fafafa',
          color: '#09090b',
          padding: 'clamp(28px, 6vw, 68px) clamp(18px, 5vw, 56px)',
          overflow: 'clip',
          '--focus': '#09090b',
        } as CSSProperties
      }
    >
      <style>
        {`[data-flip-gallery] { --focus: #09090b; }
@media (max-width: 600px) {
  [data-flip-gallery][data-layout='grid'] .flip-year,
  [data-flip-gallery][data-layout='grid'] .flip-summary { display: none; }
}`}
      </style>
      <div
        style={{
          maxWidth: 1040,
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 24,
        }}
      >
        <header
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 16,
            paddingBottom: 20,
            borderBottom: '1px solid #d4d4d8',
          }}
        >
          <div style={{ display: 'grid', gap: 8 }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#52525b',
              }}
            >
              Pilihan Studio · 2025—2026
            </span>
            <h2
              id="flip-title"
              style={{
                fontSize: 'clamp(1.9rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1,
                margin: 0,
                letterSpacing: '-0.05em',
              }}
            >
              Arsip karya
            </h2>
          </div>

          <div
            role="group"
            aria-label="Tata letak"
            style={{
              display: 'inline-flex',
              padding: 4,
              borderRadius: 999,
              border: '1px solid #d4d4d8',
              background: '#ffffff',
              gap: 4,
            }}
          >
            {(
              [
                ['grid', 'Grid'],
                ['list', 'Daftar'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={layout === value}
                onClick={() => changeLayout(value)}
                style={{
                  font: 'inherit',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  padding: '8px 18px',
                  cursor: 'pointer',
                  border: 0,
                  borderRadius: 999,
                  color: layout === value ? '#ffffff' : '#09090b',
                  background: layout === value ? '#09090b' : 'transparent',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <ul
          role="list"
          aria-labelledby="flip-title"
          style={{
            display: 'grid',
            gridTemplateColumns:
              layout === 'grid'
                ? 'repeat(3, minmax(0, 1fr))'
                : 'minmax(0, 1fr)',
            gap: 14,
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {works.map((work) => (
            <li
              key={work.title}
              className="flip-print"
              style={{
                minWidth: 0,
                borderRadius: 14,
                border: '1px solid #e4e4e7',
                background: '#ffffff',
                color: '#09090b',
              }}
            >
              <figure
                style={{
                  margin: 0,
                  padding: 'clamp(10px, 2vw, 20px)',
                  display: 'grid',
                  alignItems: 'center',
                  gridTemplateColumns:
                    layout === 'list'
                      ? 'min(24vw, 116px) minmax(0, 1fr)'
                      : '1fr',
                  gap: 'clamp(12px, 2.2vw, 22px)',
                }}
              >
                <div
                  aria-hidden="true"
                  className="flip-print"
                  style={{
                    aspectRatio: '1',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid #e4e4e7',
                  }}
                >
                  <WorkCover kind={work.cover} />
                </div>
                <figcaption style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 8,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#52525b',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    <span>
                      {work.code} · {work.category}
                    </span>
                    <span className="flip-year">{work.year}</span>
                  </div>
                  <strong
                    style={{
                      fontWeight: 800,
                      fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                      letterSpacing: '-0.025em',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {work.title}
                  </strong>
                  <span
                    className="flip-summary"
                    style={{
                      fontSize: '0.82rem',
                      lineHeight: 1.55,
                      color: '#52525b',
                    }}
                  >
                    {work.summary}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
