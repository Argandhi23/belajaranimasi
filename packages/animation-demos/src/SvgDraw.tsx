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
      style={{ color: '#effff5', background: '#102821' }}
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
          Garis tumbuh mengikuti scroll.
        </h2>
        <p style={{ margin: '0 0 8px', maxWidth: '58ch', lineHeight: 1.6 }}>
          Gulir ke bawah untuk menggambar jalur dari titik awal. Gulir ke atas
          untuk menarik garisnya kembali.
        </p>
        <p
          style={{
            margin: 0,
            maxWidth: '58ch',
            color: '#bae7ce',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
          Jika pengurangan gerak aktif, seluruh garis langsung tampil utuh.
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
          borderTop: '1px solid #355b4b',
          background:
            'linear-gradient(#a4f2c51a 1px, transparent 1px) center / 44px 44px, linear-gradient(90deg, #a4f2c51a 1px, transparent 1px) center / 44px 44px, radial-gradient(ellipse at center, #204535, transparent 72%), #0d221b',
        }}
      >
        <svg
          viewBox="0 0 640 320"
          aria-label="Jalur gelombang geometris yang digambar mengikuti scroll"
          style={{
            width: 'min(100%, 880px)',
            height: 'auto',
            overflow: 'visible',
          }}
        >
          <path
            d="M 48 248 C 128 72, 208 72, 272 176 S 416 280, 480 120 L 592 72"
            fill="none"
            stroke="#7db89e"
            strokeWidth="2"
            strokeDasharray="5 9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={path}
            data-testid="svg-draw-path"
            d="M 48 248 C 128 72, 208 72, 272 176 S 416 280, 480 120 L 592 72"
            fill="none"
            stroke="#a4f2c5"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="48" cy="248" r="8" fill="#a4f2c5" />
          <circle
            cx="592"
            cy="72"
            r="8"
            fill="#102821"
            stroke="#a4f2c5"
            strokeWidth="4"
          />
        </svg>
        <p
          style={{
            position: 'absolute',
            bottom: 24,
            padding: '8px 16px',
            margin: 0,
            background: '#102821',
            border: '1px solid #355b4b',
            borderRadius: 6,
            color: '#bae7ce',
            font: '600 0.8rem/1.5 var(--font-sans, inherit)',
            textAlign: 'center',
          }}
        >
          strokeDashoffset: length → 0
        </p>
      </div>
      <footer
        style={{
          borderTop: '1px solid #355b4b',
          padding: 'clamp(36px, 7vw, 80px) 24px',
          textAlign: 'center',
          color: '#bae7ce',
          lineHeight: 1.6,
        }}
      >
        <strong>Jalur selesai digambar.</strong>
        <p>
          Panjang path diukur dengan getTotalLength lalu dihubungkan ke posisi
          scroll melalui strokeDashoffset.
        </p>
      </footer>
    </section>
  );
}
