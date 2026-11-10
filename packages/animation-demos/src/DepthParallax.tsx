import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function DepthParallax() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const layers =
          root.current?.querySelectorAll<HTMLElement>('[data-depth]');
        if (!layers) return;
        const tweens = Array.from(layers, (layer) => {
          const distance = Number(layer.dataset.depth);
          return gsap.fromTo(
            layer,
            { y: distance },
            {
              y: -distance,
              ease: 'none',
              scrollTrigger: {
                trigger: stage.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
        let alive = true;
        void document.fonts.ready.then(() => {
          if (alive) tweens.forEach((tween) => tween.scrollTrigger?.refresh());
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
      data-testid="demo-depth-parallax"
      style={{ color: '#202c3a', background: '#f8fafc' }}
    >
      <header style={{ padding: '64px 24px', maxWidth: 760, margin: 'auto' }}>
        <p style={{ fontFamily: 'monospace', color: '#2862a6' }}>
          02 / DEPTH PARALLAX
        </p>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
          Jarak terasa lewat gerak.
        </h2>
        <p>
          Gulir perlahan. Lapisan depan bergerak lebih jauh daripada lapisan
          belakang, membentuk ilusi kedalaman.
        </p>
        <p>
          Pengurangan gerak menampilkan susunan lapisan statis tanpa parallax.
        </p>
      </header>
      <div
        ref={stage}
        style={{
          height: '110svh',
          minHeight: 600,
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(#e8f1fa, #f8fafc)',
        }}
      >
        <div
          data-depth="50"
          data-testid="parallax-back"
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 'min(65vw, 460px)',
            height: 'min(65vw, 460px)',
            borderRadius: '50%',
            background: '#b7d2ed',
            top: '20%',
            left: '10%',
          }}
        />
        <div
          data-depth="130"
          data-testid="parallax-middle"
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 'min(45vw, 300px)',
            height: 'min(45vw, 300px)',
            background: '#5c9bd0',
            borderRadius: 24,
            top: '40%',
            right: '12%',
            rotate: '-15deg',
          }}
        />
        <div
          data-depth="240"
          data-testid="parallax-front"
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 'min(27vw, 160px)',
            height: 'min(27vw, 160px)',
            background: '#245a91',
            borderRadius: 16,
            top: '65%',
            left: '28%',
            rotate: '20deg',
          }}
        />
        <p
          style={{
            zIndex: 1,
            padding: '16px 24px',
            background: '#ffffffed',
            border: '1px solid #c7d6e5',
            borderRadius: 12,
            maxWidth: 280,
            textAlign: 'center',
          }}
        >
          Belakang: 100 px
          <br />
          Tengah: 260 px
          <br />
          Depan: 480 px
          <br />
          <small>Jarak perjalanan vertikal</small>
        </p>
      </div>
      <footer style={{ padding: '80px 24px', textAlign: 'center' }}>
        Tiga kecepatan. Satu arah scroll. Tidak ada elemen yang ditahan.
      </footer>
    </section>
  );
}
