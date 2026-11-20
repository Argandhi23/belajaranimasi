import { useId, useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

const capabilities = [
  {
    code: '01',
    name: 'Jaringan Edge Global',
    caption:
      'Distribusi aset statis dari 35+ titik tepi menjaga waktu muat tetap konsisten di semua wilayah.',
    metric: '< 40 ms TTFB',
    inverted: false,
    icon: 'globe',
  },
  {
    code: '02',
    name: 'Sistem Desain Terpadu',
    caption:
      'Token tipografi, spasi, dan kontras sinkron langsung antara dokumen spesifikasi dan komponen kode.',
    metric: 'Kontras AA+',
    inverted: true,
    icon: 'layers',
  },
  {
    code: '03',
    name: 'Analitik Tanpa Beban',
    caption:
      'Pemantauan performa antarmuka dan stabilitas tata letak tanpa skrip pelacak yang memblokir render.',
    metric: '0 KB Blokir',
    inverted: false,
    icon: 'pulse',
  },
  {
    code: '04',
    name: 'Keamanan Berlapis',
    caption:
      'Validasi skema ketat di batas API dengan pemisahan peran baca dan tulis secara menyeluruh.',
    metric: 'TLS 1.3 Strict',
    inverted: false,
    icon: 'shield',
  },
  {
    code: '05',
    name: 'Pratinjau Tiap Cabang',
    caption:
      'Setiap pembaruan memperoleh tautan pratinjau terisolasi untuk peninjauan desain sebelum rilis.',
    metric: 'Siap 18 dtk',
    inverted: false,
    icon: 'branch',
  },
  {
    code: '06',
    name: 'Pemulihan Seketika',
    caption:
      'Kembalikan rilis stabil sebelumnya dalam satu klik tanpa memutus sesi aktif pengguna.',
    metric: '99,99% Aktif',
    inverted: true,
    icon: 'rewind',
  },
] as const;

function CapabilityIcon({
  kind,
  stroke,
}: {
  kind: (typeof capabilities)[number]['icon'];
  stroke: string;
}) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      {kind === 'globe' && (
        <>
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke={stroke}
            strokeWidth="1.75"
          />
          <path
            d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
          />
        </>
      )}
      {kind === 'layers' && (
        <path
          d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 17l9 4 9-4"
          fill="none"
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      )}
      {kind === 'pulse' && (
        <path
          d="M3 12h4l2.5-6 4 12 2.5-6H21"
          fill="none"
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {kind === 'shield' && (
        <path
          d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3Z"
          fill="none"
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      )}
      {kind === 'branch' && (
        <path
          d="M7 5v14M7 14c0-3 10-2 10-6V5M5 5h4M5 19h4M15 5h4"
          fill="none"
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      )}
      {kind === 'rewind' && (
        <path
          d="M4 12a8 8 0 1 0 2.3-5.6L4 8.5M4 4v4.5h4.5"
          fill="none"
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function StaggerGrid() {
  const root = useRef<HTMLElement>(null);
  const replay = useRef<gsap.core.Timeline | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const noteId = useId();

  useGSAP(
    () => {
      const items = root.current?.querySelectorAll('[data-stagger-tile]');
      if (!items?.length) return;
      const media = gsap.matchMedia();
      media.add(
        {
          animated: '(prefers-reduced-motion: no-preference)',
          still: '(prefers-reduced-motion: reduce)',
        },
        ({ conditions }) => {
          const animate = Boolean(conditions?.animated);
          setMotionEnabled(animate);
          if (!animate) return;

          replay.current = gsap
            .timeline({ paused: true })
            .set(items, { yPercent: 18, scale: 0.94, opacity: 0 })
            .to(items, {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              duration: 0.52,
              ease: 'power3.out',
              stagger: { grid: [2, 3], from: 'start', amount: 0.44 },
            });
          return () => {
            replay.current = null;
          };
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      style={
        {
          background: '#fafafa',
          color: '#09090b',
          padding: 'clamp(28px, 5vw, 60px) clamp(20px, 5vw, 56px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 28,
          '--focus': '#09090b',
        } as CSSProperties
      }
    >
      <header
        style={{
          maxWidth: 1040,
          width: '100%',
          minWidth: 0,
          margin: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'end',
          justifyContent: 'space-between',
          gap: 16,
          paddingBottom: 20,
          borderBottom: '1px solid #d4d4d8',
        }}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#52525b',
            }}
          >
            Arsitektur Platform · Kapabilitas Inti
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(1.85rem, 4vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              lineHeight: 1.04,
            }}
          >
            Dirancang untuk tim produk modern.
          </h2>
          <p
            id={noteId}
            style={{
              margin: 0,
              maxWidth: '50ch',
              color: '#52525b',
              fontSize: '0.92rem',
              lineHeight: 1.6,
            }}
          >
            Enam fondasi infrastruktur yang menyatukan alur desain, pengujian,
            dan distribusi ke produksi.
          </p>
        </div>

        <button
          type="button"
          disabled={!motionEnabled}
          aria-describedby={noteId}
          onClick={() => replay.current?.restart()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 44,
            padding: '10px 18px',
            border: motionEnabled ? '1px solid #09090b' : '1px solid #d4d4d8',
            borderRadius: 999,
            background: motionEnabled ? '#09090b' : '#f4f4f5',
            color: motionEnabled ? '#ffffff' : '#71717a',
            font: 'inherit',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: motionEnabled ? 'pointer' : 'not-allowed',
            outlineOffset: 4,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M 4 11 A 8 8 0 1 1 7 18 M 4 5 V 11 H 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Putar ulang
        </button>
      </header>

      <div
        style={{
          maxWidth: 1040,
          width: '100%',
          minWidth: 0,
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
          gap: 14,
        }}
      >
        {capabilities.map((item) => {
          const surface = item.inverted ? '#09090b' : '#ffffff';
          const ink = item.inverted ? '#fafafa' : '#09090b';
          const muted = item.inverted ? '#a1a1aa' : '#52525b';
          const border = item.inverted ? '#27272a' : '#e4e4e7';
          return (
            <article
              key={item.code}
              data-stagger-tile
              style={{
                padding: 22,
                borderRadius: 14,
                background: surface,
                color: ink,
                border: `1px solid ${border}`,
                display: 'grid',
                alignContent: 'space-between',
                gap: 20,
                willChange: 'transform, opacity',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: muted,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {item.code}
                </span>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: `1px solid ${border}`,
                    background: item.inverted ? '#18181b' : '#fafafa',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <CapabilityIcon kind={item.icon} stroke={ink} />
                </div>
              </div>

              <div style={{ display: 'grid', gap: 6 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.08rem',
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                  }}
                >
                  {item.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.84rem',
                    lineHeight: 1.58,
                    color: muted,
                  }}
                >
                  {item.caption}
                </p>
              </div>

              <div
                style={{
                  paddingTop: 12,
                  borderTop: `1px solid ${border}`,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: ink,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {item.metric}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
