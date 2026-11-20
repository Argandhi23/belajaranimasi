import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Play, Pause } from 'lucide-react';
gsap.registerPlugin(useGSAP);
const PREVIEW_MORPH_START =
  'M 60 16 C 84 16, 104 36, 104 60 C 104 84, 84 104, 60 104 C 36 104, 16 84, 16 60 C 16 36, 36 16, 60 16 Z';
const PREVIEW_MORPH_END =
  'M 60 8 C 68 42, 78 52, 112 60 C 78 68, 68 78, 60 112 C 52 78, 42 68, 8 60 C 42 52, 52 42, 60 8 Z';
export function Preview({ id }: { id: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  useGSAP(
    () => {
      if (!playing) return;
      const mm = gsap.matchMedia();
      mm.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          const timeline = gsap.timeline({
            repeat: -1,
            yoyo: true,
            paused: true,
            defaults: { duration: 1.6, ease: 'power1.inOut' },
          });
          if (id === 'depth-parallax')
            timeline.to(
              '.preview-shape',
              { y: (index) => [-10, -28, -48][index], stagger: 0 },
              0,
            );
          else if (id === 'svg-draw')
            timeline.fromTo(
              '.svg-draw-line',
              { strokeDasharray: 220, strokeDashoffset: 220 },
              { strokeDashoffset: 0 },
              0,
            );
          else if (id === 'svg-morph')
            timeline.fromTo(
              '.svg-morph-shape',
              { attr: { d: PREVIEW_MORPH_START } },
              { attr: { d: PREVIEW_MORPH_END } },
              0,
            );
          else if (id === 'horizontal-story')
            timeline.to('.preview-posters', { x: -42 });
          else if (id === 'kinetic-type')
            timeline.from('.preview-type span', {
              yPercent: 110,
              stagger: 0.12,
            });
          else if (id === 'flip-gallery')
            timeline.to('.preview-tiles i', {
              x: (index) => [34, 0, -34][index],
              y: (index) => [-30, 0, 30][index],
            });
          else if (id === 'motion-path')
            timeline.to('.preview-path-orbit', { rotation: 240, ease: 'none' });
          else if (id === 'magnetic-button')
            timeline.to('.preview-magnet', { x: 24, y: -15, rotation: -6 });
          else if (id === 'stagger-grid')
            timeline.from('.preview-stagger i', {
              y: 18,
              scale: 0.65,
              opacity: 0.3,
              duration: 0.6,
              stagger: 0.1,
            });
          else if (id === 'three-torus-orbit')
            timeline.to('.preview-torus', {
              rotation: 180,
              scale: 1.08,
            });
          else if (id === 'text-scramble')
            timeline.fromTo(
              '.preview-scramble span',
              { opacity: 0.3, y: 10 },
              { opacity: 1, y: 0, stagger: 0.14, duration: 0.55 },
            );
          else if (id === 'timeline-choreography')
            timeline.fromTo(
              '.preview-timeline i',
              { scaleX: 0.3, opacity: 0.35 },
              {
                scaleX: 1,
                opacity: 1,
                stagger: 0.22,
                duration: 0.5,
                transformOrigin: 'left center',
              },
            );
          else
            timeline.to('.preview-shape', {
              rotation: id === 'scroll-cube' ? 110 : 180,
              x: 20,
              scale: 1.12,
            });
          let visible = true;
          const sync = () => {
            if (visible && !document.hidden) timeline.play();
            else timeline.pause();
          };
          const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
          });
          if (root.current) observer.observe(root.current);
          document.addEventListener('visibilitychange', sync);
          return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', sync);
          };
        },
        root,
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [playing, id], revertOnUpdate: true },
  );
  return (
    <div ref={root} className={`preview preview-${id}`}>
      <div className="preview-art" aria-hidden="true">
        {id === 'depth-parallax' ? (
          <>
            <i className="preview-shape layer-one" />
            <i className="preview-shape layer-two" />
            <i className="preview-shape layer-three" />
          </>
        ) : id === 'scroll-cube' ? (
          <svg className="preview-shape cube-sketch" viewBox="0 0 150 170">
            <path d="M75 8 139 43v77l-64 40-64-40V43Z" fill="#71717a" />
            <path d="m75 8 64 35-64 39-64-39Z" fill="#fafafa" />
            <path d="M75 82v78l64-40V43Z" fill="#27272a" />
            <path
              d="m11 43 64 39 64-39M75 82v78"
              fill="none"
              stroke="#09090b"
              strokeWidth="1.5"
            />
          </svg>
        ) : id === 'svg-draw' ? (
          <svg className="preview-shape svg-draw-sketch" viewBox="0 0 180 110">
            <path
              d="M 16 78 C 52 18, 92 98, 126 38 C 144 12, 156 54, 166 28"
              fill="none"
              stroke="#52525b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="4 7"
            />
            <path
              className="svg-draw-line"
              d="M 16 78 C 52 18, 92 98, 126 38 C 144 12, 156 54, 166 28"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="16" cy="78" r="5" fill="#ffffff" />
            <circle
              cx="166"
              cy="28"
              r="5"
              fill="#09090b"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </svg>
        ) : id === 'svg-morph' ? (
          <svg className="preview-shape svg-morph-sketch" viewBox="0 0 120 120">
            <path
              d={PREVIEW_MORPH_END}
              fill="none"
              stroke="#52525b"
              strokeWidth="2"
              strokeDasharray="4 5"
            />
            <path
              className="svg-morph-shape"
              d={PREVIEW_MORPH_START}
              fill="#fafafa"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </svg>
        ) : id === 'horizontal-story' ? (
          <div className="preview-posters">
            <i />
            <i />
            <i />
          </div>
        ) : id === 'kinetic-type' ? (
          <div className="preview-type">
            <span>Huruf</span> <span>ikut</span>
          </div>
        ) : id === 'flip-gallery' ? (
          <div className="preview-tiles">
            <i />
            <i />
            <i />
          </div>
        ) : id === 'motion-path' ? (
          <div className="preview-path-orbit">
            <i />
          </div>
        ) : id === 'magnetic-button' ? (
          <div className="preview-magnet-field">
            <i className="preview-magnet" />
          </div>
        ) : id === 'stagger-grid' ? (
          <div className="preview-stagger">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        ) : id === 'three-torus-orbit' ? (
          <svg className="preview-shape preview-torus" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="36"
              fill="none"
              stroke="#fafafa"
              strokeWidth="9"
            />
            <ellipse
              cx="60"
              cy="60"
              rx="46"
              ry="18"
              transform="rotate(35 60 60)"
              fill="none"
              stroke="#a1a1aa"
              strokeWidth="4"
            />
            <ellipse
              cx="60"
              cy="60"
              rx="46"
              ry="18"
              transform="rotate(-35 60 60)"
              fill="none"
              stroke="#52525b"
              strokeWidth="4"
            />
          </svg>
        ) : id === 'text-scramble' ? (
          <div className="preview-scramble">
            <span>01</span>
            <span>→</span>
            <span>ABC</span>
          </div>
        ) : id === 'timeline-choreography' ? (
          <div className="preview-timeline">
            <i />
            <i />
            <i />
          </div>
        ) : (
          <i className="preview-shape preview-square">
            <span />
          </i>
        )}
      </div>
      <button
        className="preview-play"
        aria-label={playing ? 'Jeda cuplikan' : 'Putar cuplikan'}
        aria-pressed={playing}
        onClick={() => setPlaying(!playing)}
      >
        {playing ? <Pause size={15} /> : <Play size={15} />}
      </button>
    </div>
  );
}
