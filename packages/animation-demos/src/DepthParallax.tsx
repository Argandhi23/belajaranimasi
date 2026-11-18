import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function DepthParallax() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const layers =
          root.current?.querySelectorAll<HTMLElement>('[data-depth]');
        if (!layers) return;
        const tweens = Array.from(layers, (layer) => {
          const distance = Number(layer.dataset.depth);
          return gsap.fromTo(
            layer,
            { y: distance },
            {
              y: -distance,
              ease: 'none',
              scrollTrigger: {
                trigger: stage.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
        let alive = true;
        void document.fonts.ready.then(() => {
          if (alive) tweens.forEach((tween) => tween.scrollTrigger?.refresh());
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
      data-testid="demo-depth-parallax"
      style={{ color: '#e9faff', background: '#101e2a' }}
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
          Jarak terasa lewat gerak.
        </h2>
        <p style={{ margin: '0 0 8px', maxWidth: '58ch', lineHeight: 1.6 }}>
          Gulir perlahan. Lapisan depan bergerak lebih jauh daripada lapisan
          belakang, membentuk ilusi kedalaman.
        </p>
        <p
          style={{
            margin: 0,
            maxWidth: '58ch',
            color: '#c1e4e9',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
          Jika pengurangan gerak aktif, ketiga lapisan tetap terlihat dalam
          posisi diam.
        </p>
      </header>
      <div
        ref={stage}
        style={{
          height: '110svh',
          minHeight: 600,
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          isolation: 'isolate',
          borderTop: '1px solid #34536a',
          background:
            'radial-gradient(ellipse at 66% 40%, #1b4255, transparent 68%), #0b1824',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(#a5ddea12 1px, transparent 1px), linear-gradient(90deg, #a5ddea12 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            backgroundPosition: 'center',
          }}
        />
        <div
          data-depth="50"
          data-testid="parallax-back"
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 'min(65vw, 460px)',
            height: 'min(65vw, 460px)',
            borderRadius: '50%',
            background:
              'repeating-radial-gradient(circle, transparent 0 17px, #9ad5e64d 18px 19px, transparent 20px 29px), #234965',
            border: '1px solid #75a6bd',
            top: '14%',
            left: '10%',
          }}
        />
        <div
          data-depth="130"
          data-testid="parallax-middle"
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 'min(45vw, 300px)',
            height: 'min(45vw, 300px)',
            background: 'linear-gradient(135deg, #5298a9, #255065)',
            border: '1px solid #87bacb',
            boxShadow: '0 18px 48px #08141b5c',
            borderRadius: 24,
            top: '40%',
            right: '12%',
            rotate: '-15deg',
          }}
        />
        <div
          data-depth="240"
          data-testid="parallax-front"
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 'min(27vw, 160px)',
            height: 'min(27vw, 160px)',
            background: 'linear-gradient(150deg, #b2fff0, #5abec6)',
            boxShadow: '0 22px 48px #08141b7a',
            borderRadius: 16,
            top: '65%',
            left: '28%',
            rotate: '20deg',
          }}
        />
        <dl
          style={{
            position: 'absolute',
            insetInline: 'clamp(12px, 5vw, 52px)',
            bottom: 24,
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            maxWidth: 560,
            margin: '0 auto',
            padding: '12px 0',
            background: '#101e2a',
            border: '1px solid #44667c',
            borderRadius: 6,
          }}
        >
          {(
            [
              ['Belakang', '100 px'],
              ['Tengah', '260 px'],
              ['Depan', '480 px'],
            ] as const
          ).map(([label, distance], index) => (
            <div
              key={label}
              style={{
                borderInlineStart: index ? '1px solid #44667c' : undefined,
                textAlign: 'center',
              }}
            >
              <dt style={{ color: '#c1e4e9', fontSize: '0.75rem' }}>{label}</dt>
              <dd
                style={{
                  margin: '4px 0 0',
                  color: '#e9faff',
                  font: '700 clamp(0.9rem, 3vw, 1.35rem)/1.4 var(--font-sans, inherit)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {distance}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <footer
        style={{
          borderTop: '1px solid #34536a',
          padding: 'clamp(36px, 7vw, 80px) 24px',
          textAlign: 'center',
          color: '#c1e4e9',
          lineHeight: 1.6,
        }}
      >
        Setiap angka menunjukkan jarak gerak vertikal lapisan. Panggung ikut
        bergulir bersama halaman.
      </footer>
    </section>
  );
}
