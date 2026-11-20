import { useRef, type CSSProperties } from 'react';
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
      style={
        {
          color: '#09090b',
          background: '#fafafa',
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
          <span>Monograf Arsitektur · Edisi 04</span>
          <span>Jakarta · 2026</span>
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(1.95rem, 4.4vw, 3.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: 1.02,
            textWrap: 'balance',
          }}
        >
          Beton, cahaya, dan jeda ruang.
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '54ch',
            color: '#52525b',
            fontSize: '0.96rem',
            lineHeight: 1.65,
          }}
        >
          Pembacaan atas ruang publik modern: bagaimana massa beton, bayangan
          panjang, dan bukaan langit membentuk keheningan di tengah kota.
        </p>
      </header>

      <div
        ref={stage}
        style={{
          height: '110svh',
          minHeight: 620,
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          isolation: 'isolate',
          borderTop: '1px solid #e4e4e7',
          background: '#f4f4f5',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(9, 9, 11, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(9, 9, 11, 0.05) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            backgroundPosition: 'center',
          }}
        />

        {/* Background architectural typography plate */}
        <div
          data-depth="50"
          data-testid="parallax-back"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '9%',
            left: 'clamp(16px, 6vw, 84px)',
            width: 'min(82vw, 560px)',
            padding: 'clamp(22px, 3.5vw, 38px)',
            borderRadius: 18,
            border: '1px solid #d4d4d8',
            background: '#ffffff',
            willChange: 'transform',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#52525b',
              marginBottom: 14,
            }}
          >
            <span>ARSIP ELEVASI · NO. 04</span>
            <span>SKALA 1 : 200</span>
          </div>
          <div
            style={{
              fontSize: 'clamp(3.2rem, 11vw, 7.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.06em',
              lineHeight: 0.9,
              color: '#e4e4e7',
              userSelect: 'none',
            }}
          >
            RUANG
          </div>
          <div
            style={{
              marginTop: 18,
              height: 1,
              background:
                'repeating-linear-gradient(90deg, #a1a1aa 0 10px, transparent 10px 18px)',
            }}
          />
        </div>

        {/* Midground brutalist pavilion architectural study */}
        <article
          data-depth="130"
          data-testid="parallax-middle"
          style={{
            position: 'absolute',
            top: '25%',
            right: 'clamp(16px, 7vw, 96px)',
            width: 'min(78vw, 410px)',
            borderRadius: 16,
            border: '1px solid #d4d4d8',
            background: '#ffffff',
            boxShadow: '0 26px 64px -24px rgba(9, 9, 11, 0.25)',
            overflow: 'hidden',
            willChange: 'transform',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              background: '#09090b',
              borderBottom: '1px solid #e4e4e7',
            }}
          >
            <svg
              viewBox="0 0 400 220"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              <rect width="400" height="220" fill="#09090b" />
              <polygon points="0,0 260,0 140,220 0,220" fill="#18181b" />
              <rect x="44" y="42" width="312" height="28" fill="#fafafa" />
              <rect x="44" y="70" width="312" height="10" fill="#a1a1aa" />
              <rect x="64" y="80" width="32" height="108" fill="#e4e4e7" />
              <rect x="132" y="80" width="32" height="108" fill="#fafafa" />
              <rect x="200" y="80" width="32" height="108" fill="#d4d4d8" />
              <rect x="268" y="80" width="32" height="108" fill="#a1a1aa" />
              <polygon points="96,80 132,80 132,188 96,188" fill="#111114" />
              <polygon points="164,80 200,80 200,188 164,188" fill="#18181b" />
              <polygon points="232,80 268,80 268,188 232,188" fill="#111114" />
              <polygon points="300,80 356,80 356,188 300,188" fill="#27272a" />
              <rect x="34" y="188" width="332" height="12" fill="#f4f4f5" />
              <line
                x1="0"
                y1="200"
                x2="400"
                y2="200"
                stroke="#52525b"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div style={{ padding: '18px 20px', display: 'grid', gap: 6 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#52525b',
              }}
            >
              <span>Paviliun Utara</span>
              <span>Sektor Barat · 2026</span>
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.14rem',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: '#09090b',
              }}
            >
              Kolonade Beton Ekspos
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.82rem',
                lineHeight: 1.55,
                color: '#52525b',
              }}
            >
              Empat pilar utama menopang kanopi datar yang memotong cahaya siang
              menjadi ritme bayangan tegas.
            </p>
          </div>
        </article>

        {/* Foreground high-contrast curatorial pull-quote */}
        <blockquote
          data-depth="240"
          data-testid="parallax-front"
          style={{
            position: 'absolute',
            top: '57%',
            left: 'clamp(16px, 12vw, 170px)',
            width: 'min(74vw, 310px)',
            margin: 0,
            padding: '20px 22px',
            borderRadius: 14,
            background: '#09090b',
            color: '#fafafa',
            border: '1px solid #27272a',
            boxShadow: '0 28px 64px -12px rgba(9, 9, 11, 0.45)',
            display: 'grid',
            gap: 12,
            willChange: 'transform',
          }}
        >
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#a1a1aa',
            }}
          >
            Catatan Kurator
          </span>
          <p
            style={{
              margin: 0,
              fontSize: '1.02rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.38,
              color: '#ffffff',
            }}
          >
            “Cahaya tidak pernah netral; ia memahat dinding dan menentukan
            seberapa lama kita berhenti.”
          </p>
          <footer
            style={{
              paddingTop: 10,
              borderTop: '1px solid #27272a',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#a1a1aa',
            }}
          >
            Arsip Ruang Monokrom · Bab 04
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
