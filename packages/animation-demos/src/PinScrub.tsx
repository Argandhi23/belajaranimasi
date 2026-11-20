import { useRef, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const chapters = [
  {
    step: '01',
    spec: 'Sasis CNC · 420 g',
    title: 'Kalibrasi sasis presisi',
    detail:
      'Modul optik bergeser sepanjang rel aluminium untuk membuka ruang elemen lensa bagian dalam.',
  },
  {
    step: '02',
    spec: 'Bukaan f/1.4 — f/16',
    title: 'Rotasi cincin apertur',
    detail:
      'Putaran halus 180 derajat mengatur sembilan bilah diafragma dengan kontrol mekanis tanpa jeda.',
  },
  {
    step: '03',
    spec: 'Jarak dekat 0,28 m',
    title: 'Fokus makro penuh',
    detail:
      'Lensa kembali ke sumbu utama dan mengunci pembesaran optik hingga ke tepi bingkai.',
  },
] as const;

export default function PinScrub() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const moduleRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const meter = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        if (!stage.current || !moduleRef.current) return;
        const cards =
          stage.current.querySelectorAll<HTMLElement>('[data-pin-chapter]');
        const timeline = gsap.timeline({
          defaults: { ease: 'none', duration: 1 },
          scrollTrigger: {
            trigger: stage.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 2}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        if (meter.current) {
          timeline.fromTo(
            meter.current,
            { scaleY: 0.08, transformOrigin: 'top center' },
            { scaleY: 1, duration: 3, transformOrigin: 'top center' },
            0,
          );
        }

        timeline
          .addLabel('translate', 0)
          .to(
            moduleRef.current,
            {
              x: () => Math.min(110, (stage.current?.clientWidth ?? 320) * 0.1),
            },
            'translate',
          )
          .addLabel('rotate', 1)
          .to(moduleRef.current, { rotation: 180 }, 'rotate')
          .addLabel('scale', 2)
          .to(moduleRef.current, { scale: 1.32, x: 0 }, 'scale');

        if (ringRef.current) {
          timeline.to(
            ringRef.current,
            {
              rotation: -90,
              svgOrigin: '90 90',
              duration: 2,
            },
            'rotate',
          );
        }

        if (cards.length === 3) {
          gsap.set([cards[1], cards[2]], { opacity: 0.34 });
          timeline
            .to(cards[0], { opacity: 0.34, duration: 0.35 }, 'rotate')
            .to(cards[1], { opacity: 1, duration: 0.35 }, 'rotate')
            .to(cards[1], { opacity: 0.34, duration: 0.35 }, 'scale')
            .to(cards[2], { opacity: 1, duration: 0.35 }, 'scale');
        }

        let alive = true;
        void document.fonts.ready.then(() => {
          if (alive) timeline.scrollTrigger?.refresh();
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
      data-testid="demo-pin-scrub"
      data-pin-demo
      style={
        {
          color: '#fafafa',
          background: '#09090b',
          '--focus': '#ffffff',
        } as CSSProperties
      }
    >
      <style>
        {`[data-pin-demo] [data-pin-visual] { min-height: clamp(310px, 50svh, 450px); }
[data-pin-demo] [data-pin-chapter] { padding: 18px 20px; }
@media (max-width: 760px) {
  [data-pin-demo] [data-pin-visual] { order: -1; min-height: 230px; }
  [data-pin-demo] [data-pin-chapter] { padding: 12px 14px; }
}`}
      </style>
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
            color: '#a1a1aa',
          }}
        >
          <span>Seri Monolit M1</span>
          <span>Optik 35 mm · f/1.4</span>
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(1.9rem, 4.2vw, 3.45rem)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: 1.03,
            textWrap: 'balance',
          }}
        >
          Presisi optik dalam tiga fase.
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '52ch',
            color: '#a1a1aa',
            fontSize: '0.96rem',
            lineHeight: 1.65,
          }}
        >
          Dirancang dari blok aluminium tunggal dengan mekanisme manual penuh.
          Susuri setiap tahap perakitan lensa dari sasis hingga fokus makro.
        </p>
      </header>

      <div
        ref={stage}
        data-testid="pin-stage"
        style={{
          minHeight: '85svh',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid #27272a',
          background:
            'radial-gradient(circle at 72% 48%, #1c1c21, transparent 58%), #09090b',
          padding:
            'calc(var(--demo-sticky-top, 0px) + clamp(16px, 2.5vw, 30px)) clamp(20px, 5vw, 56px) clamp(28px, 4vw, 48px)',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            width: '100%',
            margin: 'auto',
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(22px, 4vw, 52px)',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              paddingInlineStart: 22,
              display: 'grid',
              gap: 14,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                top: 8,
                bottom: 8,
                width: 2,
                background: '#27272a',
              }}
            >
              <div
                ref={meter}
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#ffffff',
                  transformOrigin: 'top center',
                }}
              />
            </div>

            {chapters.map((chapter) => (
              <article
                key={chapter.step}
                data-pin-chapter
                style={{
                  border: '1px solid #27272a',
                  borderRadius: 12,
                  background: '#111114',
                  display: 'grid',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#a1a1aa',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <span>Tahap {chapter.step}</span>
                  <span>{chapter.spec}</span>
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.08rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#fafafa',
                  }}
                >
                  {chapter.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    color: '#a1a1aa',
                  }}
                >
                  {chapter.detail}
                </p>
              </article>
            ))}
          </div>

          <div
            data-pin-visual
            style={{
              position: 'relative',
              border: '1px solid #27272a',
              borderRadius: 18,
              background:
                'radial-gradient(circle at 50% 50%, #1a1a1f, #0c0c0f 74%)',
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden',
              isolation: 'isolate',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '16px 20px auto',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#a1a1aa',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <span>MONOLIT M1</span>
              <span>NO. 0042 / 500</span>
            </div>

            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(#ffffff0c 1px, transparent 1px), linear-gradient(90deg, #ffffff0c 1px, transparent 1px)',
                backgroundSize: '44px 44px',
                backgroundPosition: 'center',
                zIndex: -2,
              }}
            />

            {/* Calibration housing reference silhouette */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: 'clamp(160px, 24vw, 220px)',
                aspectRatio: '1',
                borderRadius: 22,
                border: '1px dashed #3f3f46',
                zIndex: -1,
              }}
            />

            {/* Precision optical lens chassis */}
            <div
              ref={moduleRef}
              data-testid="pin-square"
              aria-hidden="true"
              style={{
                width: 'clamp(136px, 20vw, 178px)',
                aspectRatio: '1',
                borderRadius: 24,
                background: 'linear-gradient(145deg, #f4f4f5, #a1a1aa)',
                border: '1px solid #ffffff',
                boxShadow: '0 28px 68px rgba(0, 0, 0, 0.8)',
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
                willChange: 'transform',
              }}
            >
              <svg
                viewBox="0 0 180 180"
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                <rect
                  x="10"
                  y="10"
                  width="160"
                  height="160"
                  rx="18"
                  fill="none"
                  stroke="#09090b"
                  strokeWidth="1.5"
                  opacity="0.28"
                />
                <circle cx="24" cy="24" r="4" fill="#09090b" />
                <circle cx="156" cy="24" r="3" fill="#52525b" />
                <circle cx="24" cy="156" r="3" fill="#52525b" />
                <circle cx="156" cy="156" r="3" fill="#52525b" />
                <circle
                  cx="90"
                  cy="90"
                  r="64"
                  fill="#09090b"
                  stroke="#27272a"
                  strokeWidth="3"
                />
                <circle
                  ref={ringRef}
                  cx="90"
                  cy="90"
                  r="56"
                  fill="none"
                  stroke="#a1a1aa"
                  strokeWidth="2"
                  strokeDasharray="3 5"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="44"
                  fill="#18181b"
                  stroke="#52525b"
                  strokeWidth="1.5"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="29"
                  fill="#09090b"
                  stroke="#e4e4e7"
                  strokeWidth="1.5"
                />
                <polygon
                  points="90,67 109,78 109,102 90,113 71,102 71,78"
                  fill="#18181b"
                  stroke="#fafafa"
                  strokeWidth="1.2"
                />
                <circle cx="90" cy="90" r="11" fill="#050506" />
                <path
                  d="M 75 74 A 22 22 0 0 1 103 73"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </div>

            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 'auto 20px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                paddingTop: 12,
                borderTop: '1px solid #27272a',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#a1a1aa',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <span>35MM · F/1.4 · ASPH</span>
              <span>ALUMINIUM ANODISASI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
