import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PinScrub() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const square = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        if (!stage.current || !square.current) return;
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
        timeline
          .addLabel('translate')
          .to(
            square.current,
            {
              x: () =>
                Math.min(240, (stage.current?.clientWidth ?? 320) * 0.25),
            },
            'translate',
          )
          .addLabel('rotate')
          .to(square.current, { rotation: 180 }, 'rotate')
          .addLabel('scale')
          .to(square.current, { scale: 1.5, x: 0 }, 'scale');
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
      style={{ color: '#faf0ff', background: '#211429' }}
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
          Satu scroll. Tiga tahap.
        </h2>
        <p style={{ margin: '0 0 8px', maxWidth: '58ch', lineHeight: 1.6 }}>
          Gulir untuk menggeser, memutar, dan memperbesar kotak. Gulir ke atas
          untuk membalik urutannya.
        </p>
        <p
          style={{
            margin: 0,
            maxWidth: '58ch',
            color: '#e7d0eb',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
          Jika pengurangan gerak aktif, kotak diam dan panggung tidak ditahan.
        </p>
      </header>
      <div
        ref={stage}
        data-testid="pin-stage"
        style={{
          height: '85svh',
          minHeight: 360,
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          isolation: 'isolate',
          borderTop: '1px solid #6a4775',
          background:
            'radial-gradient(ellipse at center, #492d52, transparent 66%), #281831',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '12% clamp(18px, 6vw, 76px)',
            zIndex: -1,
            background:
              'linear-gradient(90deg, #dfb8ef55, #dfb8ef55) center / 100% 1px no-repeat, repeating-linear-gradient(#dfb8ef88 0 1px, transparent 1px 18px) left center / 14px 100% no-repeat, repeating-linear-gradient(#dfb8ef88 0 1px, transparent 1px 18px) right center / 14px 100% no-repeat',
          }}
        />
        {['clamp(-240px, -25vw, -75px)', 'clamp(75px, 25vw, 240px)'].map(
          (offset) => (
            <div
              key={offset}
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: 100,
                height: 100,
                translate: offset,
                border: '1px solid #d8a4ea99',
                borderRadius: 12,
                background:
                  'repeating-linear-gradient(135deg, #d8a4ea22 0 1px, transparent 1px 8px)',
                zIndex: -1,
              }}
            />
          ),
        )}
        <div
          ref={square}
          data-testid="pin-square"
          aria-hidden="true"
          style={{
            width: 100,
            height: 100,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #f1cef9, #c489db)',
            border: '1px solid #fae3ff',
            boxShadow: '0 12px 44px #13091b66',
          }}
        />
        <p
          style={{
            position: 'absolute',
            bottom: 24,
            padding: '8px 16px',
            margin: 0,
            background: '#211429',
            border: '1px solid #6a4775',
            borderRadius: 6,
            color: '#e7d0eb',
            font: '0.8rem/1.5 monospace',
            textAlign: 'center',
          }}
        >
          01 geser → 02 putar → 03 perbesar
        </p>
      </div>
      <footer
        style={{
          borderTop: '1px solid #6a4775',
          padding: 'clamp(36px, 7vw, 80px) 24px',
          textAlign: 'center',
          color: '#e7d0eb',
          lineHeight: 1.6,
        }}
      >
        <strong>Timeline selesai.</strong>
        <p>
          Pin menahan panggung; scrub menghubungkan posisi scroll dengan progres
          timeline.
        </p>
      </footer>
    </section>
  );
}
