import { useId, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

const stages = [
  {
    code: '01',
    title: 'Bentuk',
    detail: 'Skala dan elevasi kartu pembuka.',
    accent: '#818cf8',
  },
  {
    code: '02',
    title: 'Ritme',
    detail: 'Translasi mendatar disusul rotasi ringan.',
    accent: '#38bdf8',
  },
  {
    code: '03',
    title: 'Harmoni',
    detail: 'Cincin fokus melebar saat seluruh tahap selaras.',
    accent: '#34d399',
  },
] as const;

export default function TimelineChoreography() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState(100);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const rangeId = useId();

  useGSAP(
    () => {
      const cards = root.current?.querySelectorAll<HTMLElement>(
        '[data-timeline-card]',
      );
      const badges = root.current?.querySelectorAll<HTMLElement>(
        '[data-timeline-badge]',
      );
      const bars = root.current?.querySelectorAll<HTMLElement>(
        '[data-timeline-bar]',
      );
      if (!cards?.length || !badges?.length || !bars?.length) return;

      const media = gsap.matchMedia();
      media.add(
        {
          animated: '(prefers-reduced-motion: no-preference)',
          still: '(prefers-reduced-motion: reduce)',
        },
        ({ conditions }) => {
          const animate = Boolean(conditions?.animated);
          setMotionEnabled(animate);

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power3.out', duration: 0.45 },
            onUpdate: () => {
              setProgress(Math.round(tl.progress() * 100));
            },
          });

          tl.addLabel('tahapSatu')
            .from(cards[0], { y: 20, opacity: 0.35, scale: 0.94 }, 'tahapSatu')
            .from(badges[0], { scale: 0.6, rotation: -35 }, 'tahapSatu+=0.08')
            .from(
              bars[0],
              { scaleX: 0, transformOrigin: 'left center' },
              'tahapSatu+=0.12',
            )
            .addLabel('tahapDua', '-=0.15')
            .from(cards[1], { y: 20, opacity: 0.35, scale: 0.94 }, 'tahapDua')
            .from(badges[1], { x: -16, rotation: 90 }, 'tahapDua+=0.08')
            .from(
              bars[1],
              { scaleX: 0, transformOrigin: 'left center' },
              'tahapDua+=0.12',
            )
            .addLabel('tahapTiga', '-=0.15')
            .from(cards[2], { y: 20, opacity: 0.35, scale: 0.94 }, 'tahapTiga')
            .from(badges[2], { scale: 1.35, opacity: 0.2 }, 'tahapTiga+=0.08')
            .from(
              bars[2],
              { scaleX: 0, transformOrigin: 'left center' },
              'tahapTiga+=0.12',
            );

          tl.progress(1);
          timeline.current = tl;

          return () => {
            timeline.current = null;
          };
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );

  function seek(value: number) {
    setProgress(value);
    timeline.current?.pause();
    timeline.current?.progress(value / 100);
  }

  function handleReplay() {
    if (!motionEnabled) return;
    timeline.current?.restart();
  }

  return (
    <section
      ref={root}
      data-testid="demo-timeline-choreography"
      style={{
        background: '#090d16',
        color: '#f8fafc',
        padding: 'clamp(24px, 5vw, 60px)',
        display: 'grid',
        gap: 24,
      }}
    >
      <header style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <h2
          style={{
            margin: '0 0 10px',
            fontSize: 'clamp(1.75rem, 3.6vw, 3.1rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.06,
          }}
        >
          Koreografi Timeline Berurutan.
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '58ch',
            color: '#94a3b8',
            lineHeight: 1.65,
            fontSize: '0.95rem',
          }}
        >
          Tiga tahap animasi disusun dalam satu <code>gsap.timeline()</code>{' '}
          menggunakan label waktu yang saling bertautan. Putar ulang atau geser
          slider untuk memeriksa tiap frame.
        </p>
      </header>

      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {stages.map((stage) => (
          <div
            key={stage.code}
            data-timeline-card
            style={{
              padding: 22,
              borderRadius: 16,
              background: '#111827',
              border: '1px solid #1e293b',
              display: 'grid',
              gap: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {stage.code}
              </span>
              <span
                data-timeline-badge
                aria-hidden="true"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: stage.accent,
                  display: 'inline-block',
                }}
              />
            </div>
            <div>
              <h3
                style={{
                  margin: '0 0 6px',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                {stage.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                }}
              >
                {stage.detail}
              </p>
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 999,
                background: '#1e293b',
                overflow: 'hidden',
              }}
            >
              <div
                data-timeline-bar
                style={{
                  height: '100%',
                  width: '100%',
                  background: stage.accent,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          width: '100%',
          padding: 20,
          borderRadius: 14,
          background: '#111827',
          border: '1px solid #1e293b',
          display: 'grid',
          gap: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label
              htmlFor={rangeId}
              style={{ fontWeight: 600, fontSize: '0.875rem' }}
            >
              Progres timeline
            </label>
            <span
              aria-hidden="true"
              style={{
                color: '#a5b4fc',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                fontSize: '0.875rem',
              }}
            >
              {progress}%
            </span>
          </div>
          <button
            type="button"
            data-testid="timeline-replay"
            disabled={!motionEnabled}
            onClick={handleReplay}
            style={{
              padding: '9px 16px',
              borderRadius: 999,
              border: '1px solid #818cf8',
              background: motionEnabled ? '#e0e7ff' : '#1e293b',
              color: motionEnabled ? '#1e1b4b' : '#94a3b8',
              font: 'inherit',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: motionEnabled ? 'pointer' : 'not-allowed',
            }}
          >
            Putar ulang
          </button>
        </div>
        <input
          id={rangeId}
          type="range"
          min={0}
          max={100}
          value={progress}
          aria-valuetext={`${progress}%`}
          onChange={(event) => seek(event.currentTarget.valueAsNumber)}
          style={{
            width: '100%',
            minHeight: 34,
            margin: 0,
            accentColor: '#818cf8',
            cursor: 'pointer',
          }}
        />
      </div>
    </section>
  );
}
