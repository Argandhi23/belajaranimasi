import { useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

const maxOffset = 22;

export default function MagneticButton() {
  const root = useRef<HTMLElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const surface = useRef<HTMLSpanElement>(null);
  const [locked, setLocked] = useState(false);

  useGSAP(
    () => {
      const hitbox = button.current;
      const movingSurface = surface.current;
      if (locked || !hitbox || !movingSurface) return;
      const media = gsap.matchMedia();
      media.add(
        '(prefers-reduced-motion: no-preference) and (any-pointer: fine) and (any-hover: hover)',
        () => {
          const options = { duration: 0.34, ease: 'power3.out' };
          const moveX = gsap.quickTo(movingSurface, 'x', options);
          const moveY = gsap.quickTo(movingSurface, 'y', options);

          const followPointer = (event: PointerEvent) => {
            if (event.pointerType === 'touch') return;
            const bounds = hitbox.getBoundingClientRect();
            const x = (event.clientX - bounds.left - bounds.width / 2) * 0.38;
            const y = (event.clientY - bounds.top - bounds.height / 2) * 0.38;
            const scale = maxOffset / Math.max(maxOffset, Math.hypot(x, y));
            moveX(x * scale);
            moveY(y * scale);
          };

          function reset() {
            moveX(0);
            moveY(0);
          }

          hitbox.addEventListener('pointermove', followPointer);
          hitbox.addEventListener('pointerleave', reset);
          hitbox.addEventListener('pointercancel', reset);
          return () => {
            hitbox.removeEventListener('pointermove', followPointer);
            hitbox.removeEventListener('pointerleave', reset);
            hitbox.removeEventListener('pointercancel', reset);
          };
        },
      );
      return () => media.revert();
    },
    { scope: root, dependencies: [locked], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      style={
        {
          background: '#09090b',
          color: '#fafafa',
          padding: 'clamp(28px, 6vw, 72px) clamp(20px, 5vw, 56px)',
          '--focus': '#ffffff',
        } as CSSProperties
      }
    >
      <div
        style={{
          maxWidth: 1040,
          width: '100%',
          margin: 'auto',
          borderRadius: 20,
          border: '1px solid #27272a',
          background:
            'radial-gradient(ellipse at 50% 0%, #1c1c21, transparent 65%), #0c0c0f',
          padding: 'clamp(28px, 5.5vw, 60px) clamp(20px, 4.5vw, 52px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 'clamp(28px, 4.5vw, 44px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            paddingBottom: 20,
            borderBottom: '1px solid #27272a',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#a1a1aa',
          }}
        >
          <span>Kolaborasi Studio · 2026</span>
          <span>
            {locked
              ? 'Slot konsultasi tersimpan'
              : 'Tersedia untuk Kuartal III'}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'grid', gap: 16 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(2rem, 4.6vw, 3.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 1.02,
                textWrap: 'balance',
              }}
            >
              Punya proyek baru? Mari bangun bersama.
            </h2>
            <p
              style={{
                margin: 0,
                maxWidth: '46ch',
                color: '#a1a1aa',
                fontSize: '0.96rem',
                lineHeight: 1.68,
              }}
            >
              Kami bermitra dengan tim produk untuk merancang sistem antarmuka,
              situs peluncuran, dan pengalaman web berkinerja tinggi dari konsep
              hingga produksi.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              padding: 'clamp(16px, 3vw, 28px)',
              borderRadius: 16,
              border: '1px solid #222226',
              background:
                'radial-gradient(circle at center, #18181b, #09090b 72%)',
              minHeight: 180,
            }}
          >
            <button
              ref={button}
              type="button"
              aria-pressed={locked}
              onClick={() => setLocked((previous) => !previous)}
              style={{
                position: 'relative',
                padding: maxOffset,
                border: 0,
                borderRadius: 999,
                background: 'transparent',
                cursor: 'pointer',
                font: 'inherit',
                outlineOffset: 4,
              }}
            >
              <span
                ref={surface}
                data-magnetic-surface
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  minHeight: 58,
                  padding: '12px clamp(22px, 3.6vw, 34px)',
                  borderRadius: 'inherit',
                  border: locked ? '1px solid #52525b' : '1px solid #ffffff',
                  background: locked ? '#18181b' : '#ffffff',
                  color: locked ? '#fafafa' : '#09090b',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  letterSpacing: '-0.015em',
                  pointerEvents: 'none',
                  boxShadow: '0 22px 48px rgba(0, 0, 0, 0.6)',
                  willChange: 'transform',
                }}
              >
                <span>Mulai diskusi proyek</span>
                <span
                  aria-hidden="true"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: locked ? '#ffffff' : '#09090b',
                    color: locked ? '#09090b' : '#ffffff',
                    fontSize: '0.85rem',
                    lineHeight: 1,
                  }}
                >
                  {locked ? '✓' : '↗'}
                </span>
              </span>
            </button>
          </div>
        </div>

        <dl
          style={{
            margin: 0,
            paddingTop: 22,
            borderTop: '1px solid #27272a',
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 16,
          }}
        >
          {[
            ['Lokasi', 'Jakarta & Remote Global'],
            ['Fokus', 'Web, Sistem Desain & 3D'],
            ['Waktu respons', 'Dalam 24 jam kerja'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'grid', gap: 4 }}>
              <dt
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#a1a1aa',
                }}
              >
                {label}
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#fafafa',
                }}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
