import { useRef, useState } from 'react';
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
      style={{
        background: '#14231e',
        color: '#f4f2e5',
        padding: 'clamp(20px, 4.5vw, 58px)',
        display: 'grid',
        gap: 16,
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          minHeight: 'clamp(230px, 44vw, 370px)',
          padding: 24,
          background:
            'radial-gradient(circle at center, #315c43, transparent 64%), #182c23',
          border: '1px solid #4e6d56',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(90deg, transparent calc(50% - 1px), #bedb9d4d 50%, transparent calc(50% + 1px)), linear-gradient(0deg, transparent calc(50% - 1px), #bedb9d4d 50%, transparent calc(50% + 1px)), repeating-radial-gradient(circle at center, transparent 0 31px, #bedb9d4d 32px 33px)',
          }}
        />
        <button
          ref={button}
          type="button"
          aria-pressed={locked}
          onClick={() => setLocked((previous) => !previous)}
          style={{
            position: 'relative',
            padding: maxOffset,
            border: 0,
            borderRadius: 99,
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
              gap: 10,
              minHeight: 56,
              padding: '8px clamp(14px, 4vw, 30px)',
              borderRadius: 'inherit',
              border: '1px solid #e1f3b0',
              background: locked ? '#f6efde' : '#ddf1a8',
              color: '#1c281b',
              fontWeight: 750,
              pointerEvents: 'none',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: '2px solid currentColor',
                boxShadow: locked ? 'inset 0 0 0 2px #f6efde' : undefined,
                background: locked ? '#294936' : 'transparent',
              }}
            />
            Medan magnet
          </span>
        </button>
      </div>
      <p style={{ color: '#deead6', margin: 0 }}>
        Dekatkan kursor ke tepi tombol untuk melihat tarikan. Tekan tombol untuk
        {locked ? ' melepas kunci.' : ' mengunci.'}
      </p>
    </section>
  );
}
