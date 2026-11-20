import { Fragment, useRef, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export default function KineticType() {
  const stage = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          timeline.current = gsap
            .timeline({ paused: true })
            .addLabel('reveal')
            .from(
              '.kinetic-word',
              {
                yPercent: 120,
                rotate: 7,
                duration: 0.72,
                stagger: 0.11,
                ease: 'power3.out',
                immediateRender: false,
              },
              'reveal',
            )
            .addLabel('accent', 'reveal+=0.36')
            .from(
              '.kinetic-rule',
              {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.55,
                ease: 'power2.inOut',
                immediateRender: false,
              },
              'accent',
            )
            .from(
              '.kinetic-meta',
              {
                y: 14,
                opacity: 0,
                duration: 0.45,
                ease: 'power2.out',
                immediateRender: false,
              },
              'accent+=0.08',
            );
          return () => {
            timeline.current = null;
          };
        },
        stage,
      );
      return () => media.revert();
    },
    { scope: stage },
  );

  return (
    <section
      ref={stage}
      aria-label="Monograf tipografi"
      style={
        {
          background: '#fafafa',
          color: '#09090b',
          padding: 'clamp(32px, 7vw, 88px) clamp(20px, 5vw, 64px)',
          '--focus': '#09090b',
        } as CSSProperties
      }
    >
      <style>
        {
          '@media (prefers-reduced-motion: reduce) { .kinetic-replay { display: none; } }'
        }
      </style>
      <div
        style={{
          maxWidth: 1040,
          minHeight: 'min(480px, 72svh)',
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          alignContent: 'space-between',
          gap: 32,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 10,
            paddingBottom: 18,
            borderBottom: '1px solid #d4d4d8',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#52525b',
          }}
        >
          <span>Edisi No. 14 · Monograf Tipografi</span>
          <span>Jakarta · 2026</span>
        </div>

        <h2
          aria-label="Huruf ikut bergerak"
          style={{
            margin: 0,
            fontSize: 'clamp(2.5rem, 11vw, 8.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.065em',
            lineHeight: 0.94,
          }}
        >
          {['Huruf ikut', 'bergerak'].map((line, lineIndex) => (
            <Fragment key={line}>
              {lineIndex > 0 && ' '}
              <span
                aria-hidden="true"
                style={{
                  display: 'block',
                  overflow: 'clip',
                  padding: '0.05em 0.08em 0.14em 0',
                }}
              >
                {line.split(' ').map((word, index) => (
                  <Fragment key={word}>
                    {index > 0 && ' '}
                    <span
                      className="kinetic-word"
                      style={{
                        display: 'inline-block',
                        color: word === 'bergerak' ? '#52525b' : '#09090b',
                        willChange: 'transform',
                      }}
                    >
                      {word}
                    </span>
                  </Fragment>
                ))}
              </span>
            </Fragment>
          ))}
        </h2>

        <div style={{ display: 'grid', gap: 22 }}>
          <div
            aria-hidden="true"
            className="kinetic-rule"
            style={{ height: 2, background: '#09090b' }}
          />
          <div
            className="kinetic-meta"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 18,
            }}
          >
            <p
              style={{
                margin: 0,
                maxWidth: '48ch',
                fontSize: '0.95rem',
                lineHeight: 1.68,
                color: '#52525b',
              }}
            >
              Ketika proporsi huruf bertemu jeda waktu yang tepat, tipografi
              tidak lagi sekadar dibaca — ia membentuk tempo dan arah pandang di
              seluruh halaman.
            </p>
            <button
              type="button"
              className="kinetic-replay"
              onClick={() => timeline.current?.restart()}
              style={{
                background: '#09090b',
                color: '#ffffff',
                border: '1px solid #09090b',
                borderRadius: 999,
                padding: '11px 22px',
                font: 'inherit',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Putar ulang
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
