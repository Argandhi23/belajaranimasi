import { Fragment, useRef } from 'react';
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
                duration: 0.7,
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
      aria-label="Panggung tipografi"
      style={{
        background: '#2823ab',
        color: '#fffbed',
        padding: 'clamp(36px, 8vw, 108px) clamp(20px, 6vw, 80px)',
      }}
    >
      <style>
        {
          '@media (prefers-reduced-motion: reduce) { .kinetic-replay { display: none; } }'
        }
      </style>
      <div
        style={{
          maxWidth: 1000,
          minHeight: 'min(470px, 72svh)',
          margin: 'auto',
          display: 'grid',
          alignContent: 'center',
        }}
      >
        <h2
          aria-label="Huruf ikut bergerak"
          style={{
            margin: 0,
            fontSize: 'clamp(2rem, 12vw, 9rem)',
            fontWeight: 900,
            letterSpacing: '-0.077em',
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
                  padding: '0.06em 0.09em 0.16em 0',
                }}
              >
                {line.split(' ').map((word, index) => (
                  <Fragment key={word}>
                    {index > 0 && ' '}
                    <span
                      className="kinetic-word"
                      style={{
                        display: 'inline-block',
                        color: word === 'bergerak' ? '#e9ff80' : 'inherit',
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
        <div
          aria-hidden="true"
          className="kinetic-rule"
          style={{ height: 2, background: '#b7aff6', margin: '12px 0 24px' }}
        />
        <button
          type="button"
          className="kinetic-replay"
          onClick={() => timeline.current?.restart()}
          style={{
            justifySelf: 'start',
            background: '#e9ff80',
            color: '#22205b',
            border: 'none',
            borderRadius: 6,
            padding: '12px 18px',
            font: 'inherit',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Putar ulang
        </button>
      </div>
    </section>
  );
}
