import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const panels = [
  {
    title: 'Orbit',
    description: 'Lingkaran konsentris menarik mata menuju pusat.',
    paper: '#211942',
    ink: '#f6e9ff',
    art: 'repeating-radial-gradient(circle, #d1a5fd 0 2px, transparent 3px 15px)',
    radius: '50%',
    angle: 0,
  },
  {
    title: 'Lipatan',
    description: 'Bidang diagonal membagi ruang menjadi beberapa arah.',
    paper: '#ffd5b8',
    ink: '#431e14',
    art: 'repeating-linear-gradient(135deg, #a53621 0 14px, #f78858 14px 28px, #ffbd91 28px 42px)',
    radius: '28% 0 28% 0',
    angle: -12,
  },
  {
    title: 'Gelombang',
    description: 'Garis berulang memberi ritme pada bidang yang diam.',
    paper: '#cdf0e2',
    ink: '#093d32',
    art: 'repeating-radial-gradient(ellipse at 50% 105%, #176d5b 0 4px, #65b99f 5px 10px, transparent 11px 17px)',
    radius: '50% 50% 8% 8%',
    angle: 0,
  },
];

export default function HorizontalStory() {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const viewport = stage.current;
      const strip = track.current;
      if (!viewport || !strip) return;
      const media = gsap.matchMedia();
      media.add(
        '(min-width: 900px) and (min-height: 550px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.set(strip, { display: 'flex' });
          const distance = () => strip.scrollWidth - viewport.clientWidth;
          const tween = gsap.to(strip, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: viewport,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          let active = true;
          void document.fonts.ready.then(() => {
            if (active) tween.scrollTrigger?.refresh();
          });
          return () => {
            active = false;
          };
        },
      );
      return () => media.revert();
    },
    { scope: stage },
  );

  return (
    <section
      aria-labelledby="horizontal-title"
      style={{ background: '#13101c', color: '#fff9f5' }}
    >
      <header
        style={{ maxWidth: 1100, margin: 'auto', padding: '48px 24px 36px' }}
      >
        <h2
          id="horizontal-title"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            lineHeight: 1.05,
            margin: '0 0 12px',
          }}
        >
          Studi bentuk
        </h2>
        <p style={{ margin: 0 }}>
          Gulir untuk menjelajahi tiga komposisi geometris.
        </p>
      </header>
      <div ref={stage} style={{ overflow: 'clip' }}>
        <ol
          ref={track}
          data-testid="horizontal-track"
          role="list"
          style={{ display: 'grid', margin: 0, padding: 0, listStyle: 'none' }}
        >
          {panels.map((panel, index) => (
            <li
              key={panel.title}
              style={{
                flex: '0 0 100%',
                minWidth: 0,
                background: panel.paper,
                color: panel.ink,
              }}
            >
              <figure
                style={{
                  boxSizing: 'border-box',
                  minHeight: 'clamp(340px, min(86svh, 75vw), 1000px)',
                  maxWidth: 1100,
                  margin: 'auto',
                  padding: 'clamp(24px, 5vw, 72px)',
                  display: 'grid',
                  alignContent: 'space-between',
                  gap: 30,
                }}
              >
                <span aria-hidden="true" style={{ fontFamily: 'monospace' }}>
                  {String(index + 1).padStart(2, '0')} / 03
                </span>
                <div
                  aria-hidden="true"
                  style={{
                    justifySelf: 'center',
                    width: 'min(54vw, 38svh, 380px)',
                    aspectRatio: '1',
                    borderRadius: panel.radius,
                    background: panel.art,
                    transform: `rotate(${panel.angle}deg)`,
                  }}
                />
                <figcaption>
                  <h3
                    style={{
                      margin: '0 0 6px',
                      fontFamily: 'Georgia, serif',
                      fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
                      lineHeight: 0.95,
                      letterSpacing: '-0.055em',
                    }}
                  >
                    {panel.title}
                  </h3>
                  <p style={{ margin: 0 }}>{panel.description}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
