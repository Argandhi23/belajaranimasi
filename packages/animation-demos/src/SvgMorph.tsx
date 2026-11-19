import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const START_PATH =
  'M 320 64 C 373 64, 416 107, 416 160 C 416 213, 373 256, 320 256 C 267 256, 224 213, 224 160 C 224 107, 267 64, 320 64 Z';
const END_PATH =
  'M 320 48 C 338 122, 358 142, 432 160 C 358 178, 338 198, 320 272 C 302 198, 282 178, 208 160 C 282 142, 302 122, 320 48 Z';

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
              start: 'top 65%',
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
      style={{ color: '#fff0fa', background: '#281728' }}
    >
      <header
        style={{
          maxWidth: 1120,
          margin: 'auto',
          padding: 'clamp(26px, 4vw, 56px) clamp(20px, 5vw, 70px)',
        }}
      >
        <h2
          style={{
            margin: '0 0 14px',
            fontSize: 'clamp(1.8rem, 3.8vw, 3.6rem)',
            fontWeight: 900,
            letterSpacing: '-0.065em',
            lineHeight: 1,
            textWrap: 'balance',
          }}
        >
          Lingkaran menjadi bintang.
        </h2>
        <p style={{ margin: '0 0 8px', maxWidth: '58ch', lineHeight: 1.6 }}>
          Gulir untuk mengubah lingkaran menjadi bintang empat sudut. Gulir ke
          atas untuk mengembalikan bentuk awal.
        </p>
        <p
          style={{
            margin: 0,
            maxWidth: '58ch',
            color: '#edcce3',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
          Jika pengurangan gerak aktif, kedua bentuk tetap bisa dibandingkan
          tanpa animasi.
        </p>
      </header>
      <div
        ref={stage}
        data-testid="svg-morph-stage"
        style={{
          height: '100svh',
          minHeight: 520,
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
          padding: 24,
          overflow: 'hidden',
          borderTop: '1px solid #6b4564',
          background:
            'linear-gradient(#f6bde522 1px, transparent 1px) center / 44px 44px, linear-gradient(90deg, #f6bde522 1px, transparent 1px) center / 44px 44px, radial-gradient(ellipse at center, #492545, transparent 70%), #281728',
        }}
      >
        <svg
          viewBox="0 0 640 320"
          aria-label="Transformasi bentuk SVG dari lingkaran menjadi bintang mengikuti scroll"
          style={{
            width: 'min(100%, 880px)',
            height: 'auto',
            overflow: 'visible',
          }}
        >
          <path
            aria-hidden="true"
            d="M 42 160 H 597 M 320 18 V 292"
            fill="none"
            stroke="#be85ad66"
            strokeDasharray="3 6"
          />
          <g transform="translate(-26.4, 84.8) scale(0.42)">
            <path
              d={START_PATH}
              fill="#733963"
              stroke="#d096c4"
              strokeWidth="6"
            />
          </g>
          <text
            x="108"
            y="246"
            textAnchor="middle"
            fill="#edcce3"
            style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 22 }}
          >
            AWAL
          </text>
          <path
            d={END_PATH}
            fill="none"
            stroke="#dca5d1"
            strokeWidth="3"
            strokeDasharray="7 7"
          />
          <path
            ref={path}
            data-testid="svg-morph-path"
            d={START_PATH}
            fill="#d090c9"
            stroke="#f6bde5"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <g transform="translate(397.6, 84.8) scale(0.42)">
            <path
              d={END_PATH}
              fill="#733963"
              stroke="#d096c4"
              strokeWidth="6"
            />
          </g>
          <text
            x="532"
            y="246"
            textAnchor="middle"
            fill="#edcce3"
            style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 22 }}
          >
            AKHIR
          </text>
        </svg>
        <p
          style={{
            position: 'absolute',
            bottom: 24,
            padding: '8px 16px',
            maxWidth: 'calc(100% - 32px)',
            margin: 0,
            background: '#281728',
            border: '1px solid #6b4564',
            borderRadius: 6,
            color: '#edcce3',
            font: '600 0.8rem/1.5 var(--font-sans, inherit)',
            textAlign: 'center',
          }}
        >
          attr.d: lingkaran (4 segmen C) → bintang
        </p>
      </div>
      <footer
        style={{
          borderTop: '1px solid #6b4564',
          padding: 'clamp(36px, 7vw, 80px) 24px',
          textAlign: 'center',
          color: '#edcce3',
          lineHeight: 1.6,
        }}
      >
        <strong>Transformasi bentuk selesai.</strong>
        <p>
          Kedua path memiliki jumlah segmen kubik Bézier yang sepadan sehingga
          setiap koordinat dapat diinterpolasi langsung mengikuti scroll.
        </p>
      </footer>
    </section>
  );
}
