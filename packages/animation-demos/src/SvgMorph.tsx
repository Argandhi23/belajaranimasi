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
      style={{ color: '#2b1e28', background: '#fcf7fa' }}
    >
      <header style={{ padding: '64px 24px', maxWidth: 760, margin: 'auto' }}>
        <p style={{ fontFamily: 'monospace', color: '#8f3465' }}>
          05 / SVG MORPH
        </p>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
          Satu bentuk bertransformasi menjadi bentuk lain.
        </h2>
        <p>
          Gulir ke bawah untuk menginterpolasi titik kontrol kurva Bézier dari
          lingkaran menuju bintang empat sudut. Gulir kembali ke atas untuk
          mengembalikannya ke bentuk semula.
        </p>
        <p>
          Dengan pengurangan gerak aktif, bentuk awal, garis kontur tujuan, dan
          perbandingan di sisi kiri-kanan tetap tampil statis agar perubahan
          geometri tetap mudah dipahami tanpa animasi.
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
          backgroundImage:
            'linear-gradient(#f0dfe9 1px, transparent 1px), linear-gradient(90deg, #f0dfe9 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      >
        <svg
          viewBox="0 0 640 320"
          aria-label="Transformasi bentuk SVG dari lingkaran menjadi bintang mengikuti scroll"
          style={{
            width: 'min(92vw, 640px)',
            height: 'auto',
            overflow: 'visible',
          }}
        >
          <g transform="translate(-26.4, 84.8) scale(0.42)" opacity="0.75">
            <path
              d={START_PATH}
              fill="#f3d6e6"
              stroke="#8f3465"
              strokeWidth="6"
            />
          </g>
          <text
            x="108"
            y="246"
            textAnchor="middle"
            fill="#70425b"
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          >
            AWAL: LINGKARAN
          </text>
          <path
            d={END_PATH}
            fill="none"
            stroke="#d7abc3"
            strokeWidth="3"
            strokeDasharray="7 7"
          />
          <path
            ref={path}
            data-testid="svg-morph-path"
            d={START_PATH}
            fill="#d96b9e33"
            stroke="#8f3465"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <g transform="translate(397.6, 84.8) scale(0.42)" opacity="0.75">
            <path
              d={END_PATH}
              fill="#f3d6e6"
              stroke="#8f3465"
              strokeWidth="6"
            />
          </g>
          <text
            x="532"
            y="246"
            textAnchor="middle"
            fill="#70425b"
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          >
            AKHIR: BINTANG
          </text>
        </svg>
        <p
          style={{
            position: 'absolute',
            bottom: 24,
            padding: '8px 16px',
            background: '#fcf7fa',
            border: '1px solid #e6cad9',
            borderRadius: 8,
            fontFamily: 'monospace',
            textAlign: 'center',
          }}
        >
          attr.d: lingkaran (4 segmen C) → bintang
        </p>
      </div>
      <footer style={{ padding: '80px 24px', textAlign: 'center' }}>
        <strong>Transformasi bentuk selesai.</strong>
        <p>
          Kedua path memiliki jumlah segmen kubik Bézier yang sepadan sehingga
          setiap koordinat dapat diinterpolasi langsung mengikuti scroll.
        </p>
      </footer>
    </section>
  );
}
