import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

const phrases = [
  'Gerak memberi makna',
  'Kode membentuk ritme',
  'Interaksi terasa hidup',
] as const;

export default function TextScramble() {
  const root = useRef<HTMLElement>(null);
  const target = useRef<HTMLHeadingElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const playOnUpdate = useRef(false);
  const [activePhrase, setActivePhrase] = useState<string>(phrases[0]);
  const [motionEnabled, setMotionEnabled] = useState(false);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          animated: '(prefers-reduced-motion: no-preference)',
          still: '(prefers-reduced-motion: reduce)',
        },
        ({ conditions }) => {
          const animate = Boolean(conditions?.animated);
          setMotionEnabled(animate);
          if (!target.current || !bar.current) return;

          if (!animate) {
            playOnUpdate.current = false;
            target.current.textContent = activePhrase;
            gsap.set(bar.current, { scaleX: 1 });
            timeline.current = null;
            return;
          }

          const tl = gsap.timeline({ paused: true });
          tl.fromTo(
            bar.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.95, ease: 'power2.out' },
            0,
          ).to(
            target.current,
            {
              duration: 0.95,
              scrambleText: {
                text: activePhrase,
                chars: '01▲◆●XYZ',
                speed: 0.6,
                revealDelay: 0.18,
              },
              ease: 'none',
            },
            0,
          );
          timeline.current = tl;

          if (playOnUpdate.current) {
            playOnUpdate.current = false;
            tl.play(0);
          } else {
            tl.progress(1);
          }

          return () => {
            timeline.current = null;
            if (target.current) {
              target.current.textContent = activePhrase;
            }
          };
        },
      );
      return () => media.revert();
    },
    { scope: root, dependencies: [activePhrase], revertOnUpdate: true },
  );

  function selectPhrase(phrase: string) {
    if (phrase === activePhrase) {
      if (motionEnabled) timeline.current?.restart();
      return;
    }
    playOnUpdate.current = motionEnabled;
    setActivePhrase(phrase);
  }

  return (
    <section
      ref={root}
      data-testid="demo-text-scramble"
      style={{
        background: '#090d16',
        color: '#f8fafc',
        padding: 'clamp(28px, 6vw, 72px) clamp(20px, 5vw, 60px)',
        display: 'grid',
        gap: 28,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          width: '100%',
          padding: 'clamp(28px, 5vw, 52px)',
          borderRadius: 16,
          background:
            'radial-gradient(circle at 20% 20%, #1e1b4b, #111827 72%)',
          border: '1px solid #1e293b',
          display: 'grid',
          gap: 20,
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#a5b4fc',
          }}
        >
          ScrambleTextPlugin · Decode
        </span>
        <h2
          ref={target}
          data-testid="scramble-target"
          aria-live="polite"
          style={{
            margin: 0,
            minHeight: '2.2em',
            display: 'flex',
            alignItems: 'center',
            fontSize: 'clamp(1.85rem, 5.2vw, 4.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            color: '#f8fafc',
          }}
        >
          {activePhrase}
        </h2>
        <div
          aria-hidden="true"
          style={{
            height: 4,
            borderRadius: 999,
            background: '#1e293b',
            overflow: 'hidden',
          }}
        >
          <div
            ref={bar}
            data-testid="scramble-bar"
            style={{
              height: '100%',
              width: '100%',
              background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div
          role="group"
          aria-label="Pilih frasa"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
        >
          {phrases.map((phrase) => {
            const active = activePhrase === phrase;
            return (
              <button
                key={phrase}
                type="button"
                aria-pressed={active}
                onClick={() => selectPhrase(phrase)}
                style={{
                  padding: '9px 14px',
                  borderRadius: 999,
                  border: active ? '1px solid #6366f1' : '1px solid #334155',
                  background: active ? '#6366f1' : '#111827',
                  color: '#f8fafc',
                  font: 'inherit',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {phrase}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          data-testid="scramble-replay"
          disabled={!motionEnabled}
          onClick={() => timeline.current?.restart()}
          style={{
            padding: '10px 18px',
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
    </section>
  );
}
