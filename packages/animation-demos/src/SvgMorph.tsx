import { useRef, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const START_PATH =
  'M 180 68 C 242 68, 292 118, 292 180 C 292 242, 242 292, 180 292 C 118 292, 68 242, 68 180 C 68 118, 118 68, 180 68 Z';
const END_PATH =
  'M 180 44 C 202 134, 226 158, 316 180 C 226 202, 202 226, 180 316 C 158 226, 134 202, 44 180 C 134 158, 158 134, 180 44 Z';

const editions = [
  {
    year: '2021',
    title: 'Edisi Arsip',
    note: 'Lingkaran utuh yang menandai keterbukaan ruang dan keseimbangan bentuk dasar.',
    path: START_PATH,
  },
  {
    year: '2026',
    title: 'Edisi Kompas',
    note: 'Empat sudut terarah yang menegaskan ketepatan kurasi dan identitas studio terkini.',
    path: END_PATH,
  },
] as const;

export default function SvgMorph() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        if (!stage.current || !path.current) return;
        const tween = gsap.fromTo(
          path.current,
          {
            attr: { d: START_PATH },
          },
          {
            attr: { d: END_PATH },
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
      data-testid="demo-svg-morph"
      style={
        {
          color: '#fafafa',
          background: '#09090b',
          '--focus': '#ffffff',
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
            color: '#a1a1aa',
          }}
        >
          <span>Identitas Merek · Studio Karsa</span>
          <span>Pembaruan Lambang 2026</span>
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
          Dari bentuk tenang menuju arah presisi.
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
          Evolusi tanda pengenal kami berangkat dari bidang melingkar yang
          tenang, lalu meruncing menjadi kompas empat arah tanpa memutus akar
          geometrinya.
        </p>
      </header>

      <div
        ref={stage}
        data-testid="svg-morph-stage"
        style={{
          minHeight: '92svh',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          alignContent: 'center',
          position: 'relative',
          padding: 'clamp(28px, 5vw, 56px) clamp(20px, 5vw, 56px)',
          overflow: 'hidden',
          borderTop: '1px solid #27272a',
          background:
            'radial-gradient(ellipse at 68% 50%, #1c1c21, transparent 64%), #09090b',
        }}
      >
        <div
          style={{
            maxWidth: 1040,
            width: '100%',
            minWidth: 0,
            margin: 'auto',
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(22px, 4vw, 48px)',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'grid', gap: 14 }}>
            {editions.map((edition) => (
              <article
                key={edition.year}
                style={{
                  padding: '20px 22px',
                  border: '1px solid #27272a',
                  borderRadius: 14,
                  background: '#111114',
                  display: 'grid',
                  gridTemplateColumns: '56px minmax(0, 1fr)',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    border: '1px solid #27272a',
                    background: '#09090b',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <svg viewBox="0 0 360 360" width="38" height="38">
                    <path d={edition.path} fill="#fafafa" />
                  </svg>
                </div>
                <div style={{ display: 'grid', gap: 4 }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#a1a1aa',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {edition.year}
                  </span>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#fafafa',
                    }}
                  >
                    {edition.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.84rem',
                      lineHeight: 1.55,
                      color: '#a1a1aa',
                    }}
                  >
                    {edition.note}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div
            style={{
              border: '1px solid #27272a',
              borderRadius: 18,
              background: '#0d0d10',
              padding: 'clamp(18px, 3vw, 32px)',
              position: 'relative',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '16px 20px auto',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#a1a1aa',
              }}
            >
              <span>LAMBANG UTAMA</span>
              <span>2021 → 2026</span>
            </div>
            <svg
              viewBox="0 0 360 360"
              aria-label="Transformasi lambang Studio Karsa dari lingkaran menjadi bintang empat arah mengikuti guliran"
              style={{
                width: 'min(100%, 340px)',
                height: 'auto',
                display: 'block',
              }}
            >
              <circle
                aria-hidden="true"
                cx="180"
                cy="180"
                r="142"
                fill="none"
                stroke="#27272a"
                strokeDasharray="4 6"
              />
              <path
                aria-hidden="true"
                d="M 24 180 H 336 M 180 24 V 336"
                fill="none"
                stroke="#27272a"
                strokeDasharray="3 7"
              />
              <path
                aria-hidden="true"
                d={END_PATH}
                fill="none"
                stroke="#52525b"
                strokeWidth="1.5"
                strokeDasharray="5 6"
              />
              <path
                ref={path}
                data-testid="svg-morph-path"
                d={START_PATH}
                fill="#fafafa"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
