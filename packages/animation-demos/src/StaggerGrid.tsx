import { useId, useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

const tiles: { name: string; paper: string; print: CSSProperties }[] = [
  {
    name: 'Lingkaran',
    paper: '#e2eea5',
    print: {
      borderRadius: '50%',
      background:
        'repeating-radial-gradient(circle, #262236 0 8%, transparent 9% 16%)',
    },
  },
  {
    name: 'Lengkungan',
    paper: '#b7a7e8',
    print: {
      borderRadius: '50% 50% 7% 7%',
      background: 'linear-gradient(90deg, #28263a 50%, #f5eee0 50%)',
    },
  },
  {
    name: 'Sudut',
    paper: '#f6ecdd',
    print: {
      background: 'linear-gradient(135deg, #28263a 50%, #b199df 50%)',
    },
  },
  {
    name: 'Kelopak',
    paper: '#eed5b1',
    print: {
      borderRadius: '0 50%',
      background: 'linear-gradient(45deg, #e0efa6 50%, #28263a 50%)',
    },
  },
  {
    name: 'Belah ketupat',
    paper: '#202f2b',
    print: {
      background:
        'repeating-linear-gradient(90deg, #e2eea5 0 10%, transparent 10% 20%)',
      clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
    },
  },
  {
    name: 'Bintang',
    paper: '#d3c6f4',
    print: {
      background: '#28263a',
      clipPath:
        'polygon(50% 0, 63% 37%, 100% 50%, 63% 63%, 50% 100%, 37% 63%, 0 50%, 37% 37%)',
    },
  },
];

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
            .set(items, { yPercent: 16, scale: 0.9, opacity: 0 })
            .to(items, {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'power3.out',
              stagger: { grid: [2, 3], from: 'start', amount: 0.42 },
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
      style={{
        background: '#21182f',
        color: '#f6eedf',
        padding: 'clamp(20px, 4.5vw, 58px)',
        display: 'grid',
        gap: 20,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 'clamp(6px, 1.5vw, 14px)',
          background: '#30233f',
          border: '1px solid #59466b',
          borderRadius: 12,
          padding: 'clamp(10px, 2.2vw, 20px)',
          overflow: 'hidden',
        }}
      >
        {tiles.map(({ name, paper, print }) => (
          <div
            key={name}
            data-stagger-tile
            style={{
              aspectRatio: '1.25',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 5,
              background: paper,
            }}
          >
            <div style={{ width: '55%', aspectRatio: '1', ...print }} />
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <p id={noteId} style={{ margin: 0, color: '#e9def1' }}>
          {motionEnabled
            ? 'Enam ubin muncul berurutan dari kiri atas.'
            : 'Keenam ubin tampil bersama saat pengurangan gerak aktif.'}
        </p>
        <button
          type="button"
          aria-disabled={!motionEnabled}
          aria-describedby={noteId}
          onClick={() => replay.current?.restart()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 44,
            padding: '8px 14px',
            border: '1px solid #cbb6ea',
            borderRadius: 32,
            background: motionEnabled ? '#d9caf2' : '#332645',
            color: motionEnabled ? '#271b38' : '#e9def1',
            font: 'inherit',
            fontWeight: 700,
            cursor: motionEnabled ? 'pointer' : 'default',
            outlineOffset: 4,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
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
      </div>
    </section>
  );
}
