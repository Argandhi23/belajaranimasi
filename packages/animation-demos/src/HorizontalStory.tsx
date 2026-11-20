import { useRef, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const panels = [
  {
    index: '01',
    location: 'Jakarta · Koleksi Tetap',
    title: 'Monolit Beton',
    description:
      'Barisan kolom beton polos membentuk koridor sunyi yang memisahkan hiruk-pikuk jalan dari ruang pamer utama.',
    metaA: 'ARSITEKTUR · 2026',
    metaB: 'SEKTOR UTARA',
    paper: '#09090b',
    surface: '#111114',
    ink: '#fafafa',
    muted: '#a1a1aa',
    line: '#27272a',
    focus: '#ffffff',
    artwork: 'monolith',
  },
  {
    index: '02',
    location: 'Bandung · Instalasi Ruang',
    title: 'Garis Cahaya',
    description:
      'Bukaan langit memanjang memotong dinding putih, menghadirkan bayangan diagonal yang bergeser sepanjang hari.',
    metaA: 'FOTOGRAFI · 2026',
    metaB: 'GALERI TIMUR',
    paper: '#f4f4f5',
    surface: '#ffffff',
    ink: '#09090b',
    muted: '#52525b',
    line: '#d4d4d8',
    focus: '#09090b',
    artwork: 'light',
  },
  {
    index: '03',
    location: 'Yogyakarta · Arsip Bentuk',
    title: 'Skala Sunyi',
    description:
      'Lengkungan konsentris pada amfiteater batu menjaga akustik alami sekaligus merangkum arah pandangan pengunjung.',
    metaA: 'INSTALASI · 2026',
    metaB: 'PAVILIUN SELATAN',
    paper: '#141417',
    surface: '#1c1c21',
    ink: '#fafafa',
    muted: '#a1a1aa',
    line: '#2e2e34',
    focus: '#ffffff',
    artwork: 'amphitheater',
  },
] as const;

function ExhibitionPlate({
  kind,
}: {
  kind: (typeof panels)[number]['artwork'];
}) {
  if (kind === 'monolith') {
    return (
      <svg
        viewBox="0 0 360 300"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <rect width="360" height="300" fill="#0c0c0f" />
        <rect x="34" y="40" width="292" height="24" fill="#fafafa" />
        <rect x="48" y="64" width="38" height="176" fill="#e4e4e7" />
        <rect x="116" y="64" width="38" height="176" fill="#a1a1aa" />
        <rect x="184" y="64" width="38" height="176" fill="#71717a" />
        <rect x="252" y="64" width="38" height="176" fill="#3f3f46" />
        <rect x="28" y="240" width="304" height="14" fill="#fafafa" />
        <line
          x1="18"
          y1="266"
          x2="342"
          y2="266"
          stroke="#27272a"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  if (kind === 'light') {
    return (
      <svg
        viewBox="0 0 360 300"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <rect width="360" height="300" fill="#09090b" />
        <polygon points="88,0 198,0 108,300 0,300" fill="#ffffff" />
        <polygon points="222,0 282,0 192,300 132,300" fill="#e4e4e7" />
        <polygon points="304,0 332,0 242,300 214,300" fill="#71717a" />
        <rect
          x="44"
          y="44"
          width="272"
          height="212"
          fill="none"
          stroke="#09090b"
          strokeWidth="2"
          opacity="0.35"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 360 300"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <rect width="360" height="300" fill="#0d0d10" />
      <path
        d="M 40 250 A 140 140 0 0 1 320 250"
        fill="none"
        stroke="#fafafa"
        strokeWidth="2.5"
      />
      <path
        d="M 74 250 A 106 106 0 0 1 286 250"
        fill="none"
        stroke="#a1a1aa"
        strokeWidth="2"
      />
      <path
        d="M 108 250 A 72 72 0 0 1 252 250"
        fill="none"
        stroke="#71717a"
        strokeWidth="1.8"
      />
      <path
        d="M 142 250 A 38 38 0 0 1 218 250"
        fill="#fafafa"
        stroke="#fafafa"
        strokeWidth="1.5"
      />
      <line
        x1="28"
        y1="250"
        x2="332"
        y2="250"
        stroke="#3f3f46"
        strokeWidth="1.5"
      />
      <line
        x1="180"
        y1="44"
        x2="180"
        y2="250"
        stroke="#3f3f46"
        strokeDasharray="4 6"
      />
    </svg>
  );
}

export default function HorizontalStory() {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const viewport = stage.current;
      const strip = track.current;
      if (!viewport || !strip) return;
      const media = gsap.matchMedia();
      media.add(
        '(min-width: 900px) and (min-height: 550px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.set(strip, { display: 'flex' });
          const distance = () => strip.scrollWidth - viewport.clientWidth;
          const tween = gsap.to(strip, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: viewport,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          let active = true;
          void document.fonts.ready.then(() => {
            if (active) tween.scrollTrigger?.refresh();
          });
          return () => {
            active = false;
          };
        },
      );
      return () => media.revert();
    },
    { scope: stage },
  );

  return (
    <section
      aria-labelledby="horizontal-title"
      data-horizontal-story
      style={
        {
          background: '#09090b',
          color: '#fafafa',
          '--focus': '#ffffff',
        } as CSSProperties
      }
    >
      <style>
        {`[data-horizontal-story] [data-horizontal-slide] { min-height: clamp(420px, 70svh, 660px); }
@media (min-width: 900px) and (min-height: 550px) {
  [data-horizontal-story] [data-horizontal-slide] { min-height: 100svh; }
}`}
      </style>
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
            color: '#a1a1aa',
          }}
        >
          <span>Pameran Monokrom 2026</span>
          <span>Tiga Babak Ruang</span>
        </div>
        <h2
          id="horizontal-title"
          style={{
            fontSize: 'clamp(1.9rem, 4.2vw, 3.45rem)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: 1.03,
            margin: 0,
          }}
        >
          Tiga babak membaca ruang.
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '52ch',
            color: '#a1a1aa',
            fontSize: '0.96rem',
            lineHeight: 1.65,
          }}
        >
          Seri dokumentasi visual tentang massa beton, arah jatuhnya cahaya, dan
          skala sunyi dalam arsitektur kontemporer.
        </p>
      </header>

      <div
        ref={stage}
        style={{ overflow: 'clip', borderTop: '1px solid #27272a' }}
      >
        <ol
          ref={track}
          data-testid="horizontal-track"
          role="list"
          style={{ display: 'grid', margin: 0, padding: 0, listStyle: 'none' }}
        >
          {panels.map((panel) => (
            <li
              key={panel.title}
              style={
                {
                  flex: '0 0 100%',
                  minWidth: 0,
                  background: panel.paper,
                  color: panel.ink,
                  borderRight: `1px solid ${panel.line}`,
                  '--focus': panel.focus,
                } as CSSProperties
              }
            >
              <figure
                data-horizontal-slide
                style={{
                  boxSizing: 'border-box',
                  maxWidth: 1120,
                  margin: 'auto',
                  padding:
                    'calc(var(--demo-sticky-top, 0px) + clamp(18px, 2.8vw, 32px)) clamp(20px, 5vw, 56px) clamp(28px, 4.5vw, 52px)',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr)',
                  alignContent: 'space-between',
                  gap: 28,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    paddingBottom: 14,
                    borderBottom: `1px solid ${panel.line}`,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: panel.muted,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <span>{panel.index} / 03</span>
                  <span>{panel.location}</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                    gap: 'clamp(24px, 5vw, 60px)',
                    alignItems: 'center',
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      borderRadius: 16,
                      border: `1px solid ${panel.line}`,
                      background: panel.surface,
                      overflow: 'hidden',
                    }}
                  >
                    <ExhibitionPlate kind={panel.artwork} />
                  </div>

                  <figcaption style={{ display: 'grid', gap: 16 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontWeight: 800,
                        fontSize: 'clamp(2.2rem, 6.2vw, 4.8rem)',
                        lineHeight: 0.98,
                        letterSpacing: '-0.055em',
                      }}
                    >
                      {panel.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        maxWidth: '40ch',
                        fontSize: '1rem',
                        lineHeight: 1.68,
                        color: panel.muted,
                      }}
                    >
                      {panel.description}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 10,
                        paddingTop: 14,
                        borderTop: `1px solid ${panel.line}`,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: panel.muted,
                      }}
                    >
                      <span>{panel.metaA}</span>
                      <span aria-hidden="true">·</span>
                      <span>{panel.metaB}</span>
                    </div>
                  </figcaption>
                </div>

                <div
                  aria-hidden="true"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                  }}
                >
                  {panels.map((bar) => (
                    <span
                      key={bar.index}
                      style={{
                        height: 2,
                        background:
                          bar.index === panel.index ? panel.ink : panel.line,
                      }}
                    />
                  ))}
                </div>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
