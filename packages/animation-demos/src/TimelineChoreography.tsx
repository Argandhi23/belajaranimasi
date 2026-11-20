import { useId, useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

const stages = [
  {
    code: '01',
    phase: 'Gerbang Awal',
    title: 'Perencanaan',
    detail:
      'Spesifikasi antarmuka, kontrak API, dan target waktu muat disepakati bersama sebelum baris kode ditulis.',
    duration: 'Hari 1—3',
    icon: 'plan',
  },
  {
    code: '02',
    phase: 'Gerbang Inti',
    title: 'Perakitan',
    detail:
      'Komponen dibangun terpisah, diuji lintas ukuran layar, dan ditinjau langsung lewat tautan pratinjau.',
    duration: 'Hari 4—9',
    icon: 'build',
  },
  {
    code: '03',
    phase: 'Gerbang Akhir',
    title: 'Peluncuran',
    detail:
      'Rilis didistribusikan ke jaringan tepi lengkap dengan pemantauan latensi dan kesiapan pemulihan.',
    duration: 'Hari 10',
    icon: 'launch',
  },
] as const;

function StageIcon({ kind }: { kind: (typeof stages)[number]['icon'] }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      {kind === 'plan' && (
        <path
          d="M5 4h14v16H5V4Zm3 5h8M8 13h8M8 17h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {kind === 'build' && (
        <path
          d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 9 8-4.5M12 12v9M12 12 4 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      )}
      {kind === 'launch' && (
        <path
          d="M5 19 19 5M10 5h9v9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

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
            .from(cards[0], { y: 20, opacity: 0.35, scale: 0.95 }, 'tahapSatu')
            .from(badges[0], { scale: 0.65, rotation: -30 }, 'tahapSatu+=0.08')
            .from(
              bars[0],
              { scaleX: 0, transformOrigin: 'left center' },
              'tahapSatu+=0.12',
            )
            .addLabel('tahapDua', '-=0.15')
            .from(cards[1], { y: 20, opacity: 0.35, scale: 0.95 }, 'tahapDua')
            .from(badges[1], { x: -14, rotation: 45 }, 'tahapDua+=0.08')
            .from(
              bars[1],
              { scaleX: 0, transformOrigin: 'left center' },
              'tahapDua+=0.12',
            )
            .addLabel('tahapTiga', '-=0.15')
            .from(cards[2], { y: 20, opacity: 0.35, scale: 0.95 }, 'tahapTiga')
            .from(badges[2], { scale: 1.3, opacity: 0.25 }, 'tahapTiga+=0.08')
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
      style={
        {
          background: '#fafafa',
          color: '#09090b',
          padding: 'clamp(28px, 5vw, 60px) clamp(20px, 5vw, 56px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 24,
          '--focus': '#09090b',
        } as CSSProperties
      }
    >
      <header
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          width: '100%',
          minWidth: 0,
          display: 'grid',
          gap: 10,
          paddingBottom: 20,
          borderBottom: '1px solid #d4d4d8',
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
          <span>Alur Produksi · Tiga Fase</span>
          <span>Siklus Rilis 10 Hari</span>
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(1.85rem, 4vw, 3.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: 1.04,
          }}
        >
          Dari spesifikasi hingga tayang di produksi.
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '54ch',
            color: '#52525b',
            lineHeight: 1.65,
            fontSize: '0.94rem',
          }}
        >
          Setiap rilis melewati tiga gerbang terverifikasi secara berurutan agar
          kualitas desain dan stabilitas sistem tetap terjaga.
        </p>
      </header>

      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          width: '100%',
          minWidth: 0,
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: 14,
        }}
      >
        {stages.map((stage) => (
          <article
            key={stage.code}
            data-timeline-card
            style={{
              padding: 22,
              borderRadius: 14,
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              display: 'grid',
              alignContent: 'space-between',
              gap: 18,
              willChange: 'transform, opacity',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#52525b',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {stage.code} · {stage.phase}
              </span>
              <span
                data-timeline-badge
                aria-hidden="true"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#09090b',
                  color: '#ffffff',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <StageIcon kind={stage.icon} />
              </span>
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.16rem',
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    color: '#09090b',
                  }}
                >
                  {stage.title}
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#52525b',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {stage.duration}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.84rem',
                  color: '#52525b',
                  lineHeight: 1.6,
                }}
              >
                {stage.detail}
              </p>
            </div>

            <div
              style={{
                height: 3,
                borderRadius: 999,
                background: '#e4e4e7',
                overflow: 'hidden',
              }}
            >
              <div
                data-timeline-bar
                style={{
                  height: '100%',
                  width: '100%',
                  background: '#09090b',
                }}
              />
            </div>
          </article>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          width: '100%',
          padding: 20,
          borderRadius: 14,
          background: '#ffffff',
          border: '1px solid #e4e4e7',
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
              style={{ fontWeight: 700, fontSize: '0.88rem' }}
            >
              Progres timeline
            </label>
            <span
              aria-hidden="true"
              style={{
                color: '#52525b',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                fontSize: '0.88rem',
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
              padding: '9px 18px',
              borderRadius: 999,
              border: motionEnabled ? '1px solid #09090b' : '1px solid #d4d4d8',
              background: motionEnabled ? '#09090b' : '#f4f4f5',
              color: motionEnabled ? '#ffffff' : '#71717a',
              font: 'inherit',
              fontSize: '0.84rem',
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
            accentColor: '#09090b',
            cursor: 'pointer',
          }}
        />
      </div>
    </section>
  );
}
