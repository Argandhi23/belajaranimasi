import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(useGSAP, Flip);

type Layout = 'grid' | 'list';

const prints = [
  { title: 'Lingkaran', ink: '#f98660', shape: '50%', angle: 0 },
  { title: 'Belah ketupat', ink: '#e9dbf7', shape: '10%', angle: 45 },
  { title: 'Lengkung', ink: '#b1d594', shape: '50% 50% 8% 8%', angle: 0 },
];

export default function FlipGallery() {
  const root = useRef<HTMLElement>(null);
  const [layout, setLayout] = useState<Layout>('grid');
  const previous = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const motion = useRef(false);

  useGSAP(
    () => {
      const items = root.current?.querySelectorAll('.flip-print');
      if (!items) return;
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        motion.current = true;
        return () => {
          motion.current = false;
          previous.current = null;
          Flip.killFlipsOf(items);
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const before = previous.current;
      previous.current = null;
      if (before && motion.current) {
        Flip.from(before, {
          duration: 0.55,
          ease: 'power3.inOut',
          scale: true,
          nested: true,
        });
      }
    },
    { scope: root, dependencies: [layout], revertOnUpdate: true },
  );

  function changeLayout(next: Layout) {
    if (next === layout) return;
    const items = root.current?.querySelectorAll('.flip-print');
    if (motion.current && items) previous.current = Flip.getState(items);
    setLayout(next);
  }

  return (
    <section
      ref={root}
      aria-labelledby="flip-title"
      style={{
        background: '#f3f0e8',
        color: '#254536',
        padding: 'clamp(28px, 6vw, 70px) clamp(16px, 5vw, 60px)',
        overflow: 'clip',
      }}
    >
      <div style={{ maxWidth: 1000, margin: 'auto' }}>
        <header
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 16,
            paddingBottom: 24,
          }}
        >
          <h2
            id="flip-title"
            style={{
              fontSize: 'clamp(2rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1,
              margin: 0,
              letterSpacing: '-0.05em',
            }}
          >
            Galeri bentuk
          </h2>
          <div
            role="group"
            aria-label="Tata letak"
            style={{ display: 'flex', gap: 6 }}
          >
            {(
              [
                ['grid', 'Grid'],
                ['list', 'Daftar'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={layout === value}
                onClick={() => changeLayout(value)}
                style={{
                  font: 'inherit',
                  fontWeight: 700,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  border: '1px solid #254536',
                  borderRadius: 6,
                  color: layout === value ? '#fff' : '#254536',
                  background: layout === value ? '#254536' : 'transparent',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </header>
        <ul
          role="list"
          aria-labelledby="flip-title"
          style={{
            display: 'grid',
            gridTemplateColumns:
              layout === 'grid'
                ? 'repeat(3, minmax(0, 1fr))'
                : 'minmax(0, 1fr)',
            gap: 8,
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {prints.map((print) => (
            <li
              key={print.title}
              style={{
                minWidth: 0,
                borderRadius: 8,
                background: '#254536',
                color: '#fffaf0',
              }}
              className="flip-print"
            >
              <figure
                style={{
                  margin: 0,
                  padding: 'clamp(8px, 2vw, 22px)',
                  display: 'grid',
                  alignItems: 'center',
                  gridTemplateColumns:
                    layout === 'list'
                      ? 'min(22vw, 110px) minmax(0, 1fr)'
                      : '1fr',
                  gap: 'clamp(8px, 2vw, 22px)',
                }}
              >
                <div
                  aria-hidden="true"
                  className="flip-print"
                  style={{
                    aspectRatio: '1',
                    display: 'grid',
                    placeItems: 'center',
                    background: '#193528',
                    borderRadius: 4,
                  }}
                >
                  <span
                    style={{
                      width: '52%',
                      aspectRatio: '1',
                      background: print.ink,
                      borderRadius: print.shape,
                      transform: `rotate(${print.angle}deg)`,
                    }}
                  />
                </div>
                <figcaption
                  style={{
                    fontWeight: 700,
                    fontSize: 'clamp(0.75rem, 2vw, 1.2rem)',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {print.title}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
