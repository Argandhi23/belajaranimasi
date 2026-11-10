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
      style={{ color: '#24232a', background: '#fafaf8' }}
    >
      <header style={{ padding: '64px 24px', maxWidth: 760, margin: 'auto' }}>
        <p style={{ fontFamily: 'monospace', color: '#6447b5' }}>
          01 / PIN + SCRUB
        </p>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
          Satu scroll. Tiga tahap.
        </h2>
        <p>
          Gulir ke bawah: kotak bergeser, berputar, lalu membesar. Gulir kembali
          untuk membalik urutannya.
        </p>
        <p>
          Dengan pengurangan gerak aktif, kotak tetap diam dan halaman mengalir
          biasa.
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
          backgroundImage:
            'linear-gradient(#eae8ef 1px, transparent 1px), linear-gradient(90deg, #eae8ef 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      >
        <div
          ref={square}
          data-testid="pin-square"
          aria-hidden="true"
          style={{
            width: 100,
            height: 100,
            borderRadius: 12,
            background: '#7954d3',
            boxShadow: '0 12px 32px #7954d322',
          }}
        />
        <p
          style={{
            position: 'absolute',
            bottom: 24,
            padding: '8px 16px',
            background: '#fafaf8',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}
        >
          01 geser → 02 putar → 03 perbesar
        </p>
      </div>
      <footer style={{ padding: '80px 24px', textAlign: 'center' }}>
        <strong>Timeline selesai.</strong>
        <p>
          Pin menahan panggung; scrub menghubungkan posisi scroll dengan progres
          timeline.
        </p>
      </footer>
    </section>
  );
}
