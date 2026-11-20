import { useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

const statements = [
  {
    text: 'Gerak memberi makna',
    caption:
      'Setiap transisi membantu mata membaca arah dan hubungan antarelemen — bukan sekadar hiasan di atas halaman.',
    index: '01',
    discipline: 'Prinsip Visual',
  },
  {
    text: 'Kode membentuk ritme',
    caption:
      'Arsitektur yang bersih melahirkan interaksi yang konsisten: cepat merespons, ringan dijalankan, dan mudah dirawat.',
    index: '02',
    discipline: 'Prinsip Rekayasa',
  },
  {
    text: 'Interaksi terasa hidup',
    caption:
      'Detail kecil yang presisi mengubah kunjungan singkat menjadi pengalaman digital yang tenang dan mudah diingat.',
    index: '03',
    discipline: 'Prinsip Pengalaman',
  },
] as const;

export default function TextScramble() {
  const root = useRef<HTMLElement>(null);
  const target = useRef<HTMLHeadingElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const playOnUpdate = useRef(false);
  const [activePhrase, setActivePhrase] = useState<string>(statements[0].text);
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

  const currentItem =
    statements.find((item) => item.text === activePhrase) ?? statements[0];

  return (
    <section
      ref={root}
      data-testid="demo-text-scramble"
      style={
        {
          background: '#09090b',
          color: '#fafafa',
          padding: 'clamp(28px, 5.5vw, 68px) clamp(20px, 5vw, 56px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 24,
          '--focus': '#ffffff',
        } as CSSProperties
      }
    >
      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          width: '100%',
          padding: 'clamp(26px, 4.8vw, 52px)',
          borderRadius: 18,
          background:
            'radial-gradient(circle at 18% 18%, #1c1c21, #0d0d10 72%)',
          border: '1px solid #27272a',
          display: 'grid',
          gap: 22,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 10,
            paddingBottom: 16,
            borderBottom: '1px solid #27272a',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#a1a1aa',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span>Manifesto Studio · {currentItem.discipline}</span>
          <span>{currentItem.index} / 03</span>
        </div>

        <h2
          ref={target}
          data-testid="scramble-target"
          aria-live="polite"
          style={{
            margin: 0,
            minHeight: '2.1em',
            display: 'flex',
            alignItems: 'center',
            fontSize: 'clamp(2rem, 5.6vw, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.048em',
            lineHeight: 1.04,
            color: '#ffffff',
          }}
        >
          {activePhrase}
        </h2>

        <p
          style={{
            margin: 0,
            maxWidth: '54ch',
            fontSize: '0.96rem',
            lineHeight: 1.68,
            color: '#a1a1aa',
          }}
        >
          {currentItem.caption}
        </p>

        <div
          aria-hidden="true"
          style={{
            height: 2,
            borderRadius: 999,
            background: '#27272a',
            overflow: 'hidden',
          }}
        >
          <div
            ref={bar}
            data-testid="scramble-bar"
            style={{
              height: '100%',
              width: '100%',
              background: '#ffffff',
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: 1040,
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
          aria-label="Pilih prinsip manifesto"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
        >
          {statements.map((item) => {
            const active = activePhrase === item.text;
            return (
              <button
                key={item.text}
                type="button"
                aria-pressed={active}
                onClick={() => selectPhrase(item.text)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 999,
                  border: active ? '1px solid #ffffff' : '1px solid #27272a',
                  background: active ? '#ffffff' : '#111114',
                  color: active ? '#09090b' : '#e4e4e7',
                  font: 'inherit',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {item.text}
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
            border: motionEnabled ? '1px solid #ffffff' : '1px solid #27272a',
            background: motionEnabled ? '#ffffff' : '#18181b',
            color: motionEnabled ? '#09090b' : '#71717a',
            font: 'inherit',
            fontSize: '0.84rem',
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
