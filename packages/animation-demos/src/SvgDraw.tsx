import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
      data-testid="demo-svg-draw"
      style={{ color: '#1d2d28', background: '#f6fbf9' }}
    >
      <header style={{ padding: '64px 24px', maxWidth: 760, margin: 'auto' }}>
        <p style={{ fontFamily: 'monospace', color: '#1b6b53' }}>
          04 / SVG DRAW
        </p>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
          Garis tumbuh mengikuti scroll.
        </h2>
        <p>
          Gulir ke bawah untuk menggambar jalur vektor dari titik awal hingga
          akhir. Gulir kembali ke atas untuk menarik garisnya mundur.
        </p>
        <p>
          Dengan pengurangan gerak aktif, seluruh jalur SVG langsung tampil utuh
          tanpa animasi gambar bertahap.
        </p>
      </header>
      <div
        ref={stage}
        data-testid="svg-draw-stage"
        style={{
          height: '100svh',
          minHeight: 520,
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
          padding: 24,
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(#dfeee8 1px, transparent 1px), linear-gradient(90deg, #dfeee8 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      >
        <svg
          viewBox="0 0 640 320"
          aria-label="Jalur gelombang geometris yang digambar mengikuti scroll"
          style={{
            width: 'min(92vw, 640px)',
            height: 'auto',
            overflow: 'visible',
          }}
        >
          <path
            d="M 48 248 C 128 72, 208 72, 272 176 S 416 280, 480 120 L 592 72"
            fill="none"
            stroke="#cfe5dc"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={path}
            data-testid="svg-draw-path"
            d="M 48 248 C 128 72, 208 72, 272 176 S 416 280, 480 120 L 592 72"
            fill="none"
            stroke="#1f7a5c"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="48" cy="248" r="8" fill="#1f7a5c" />
          <circle
            cx="592"
            cy="72"
            r="8"
            fill="#f6fbf9"
            stroke="#1f7a5c"
            strokeWidth="4"
          />
        </svg>
        <p
          style={{
            position: 'absolute',
            bottom: 24,
            padding: '8px 16px',
            background: '#f6fbf9',
            border: '1px solid #cfe5dc',
            borderRadius: 8,
            fontFamily: 'monospace',
            textAlign: 'center',
          }}
        >
          strokeDashoffset: length → 0
        </p>
      </div>
      <footer style={{ padding: '80px 24px', textAlign: 'center' }}>
        <strong>Jalur selesai digambar.</strong>
        <p>
          Panjang path diukur dengan getTotalLength lalu dihubungkan ke posisi
          scroll melalui strokeDashoffset.
        </p>
      </footer>
    </section>
  );
}
