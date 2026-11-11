import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Play, Pause } from 'lucide-react';
gsap.registerPlugin(useGSAP);
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
              { y: (index) => [-10, -28, -50][index], stagger: 0 },
              0,
            );
          else if (id === 'svg-draw')
            timeline.fromTo(
              '.svg-draw-line',
              { strokeDasharray: 220, strokeDashoffset: 220 },
              { strokeDashoffset: 0 },
              0,
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
      <span className="preview-index">
        {id === 'pin-scrub'
          ? '01 / SCROLL'
          : id === 'depth-parallax'
            ? '02 / DEPTH'
            : id === 'scroll-cube'
              ? '03 / WEBGL'
              : '04 / VECTOR'}
      </span>
      <div className="preview-art" aria-hidden="true">
        {id === 'depth-parallax' ? (
          <>
            <i className="preview-shape layer-one" />
            <i className="preview-shape layer-two" />
            <i className="preview-shape layer-three" />
          </>
        ) : id === 'scroll-cube' ? (
          <svg className="preview-shape cube-sketch" viewBox="0 0 150 170">
            <path d="M75 8 139 43v77l-64 40-64-40V43Z" fill="#efac6a" />
            <path d="m75 8 64 35-64 39-64-39Z" fill="#ffd4a7" />
            <path d="M75 82v78l64-40V43Z" fill="#dd8541" />
            <path
              d="m11 43 64 39 64-39M75 82v78"
              fill="none"
              stroke="#9c512c"
              strokeWidth="1.5"
            />
          </svg>
        ) : id === 'svg-draw' ? (
          <svg className="preview-shape svg-draw-sketch" viewBox="0 0 180 110">
            <path
              d="M 16 78 C 52 18, 92 98, 126 38 C 144 12, 156 54, 166 28"
              fill="none"
              stroke="#99ccb9"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="5 7"
            />
            <path
              className="svg-draw-line"
              d="M 16 78 C 52 18, 92 98, 126 38 C 144 12, 156 54, 166 28"
              fill="none"
              stroke="#1f7a5c"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="16" cy="78" r="5" fill="#1f7a5c" />
            <circle cx="166" cy="28" r="5" fill="#1f7a5c" />
          </svg>
        ) : (
          <i className="preview-shape preview-square">
            <span />
          </i>
        )}
      </div>
      <span className="preview-caption">
        {id === 'scroll-cube'
          ? 'Ilustrasi · buka demo 3D'
          : 'Cuplikan gerak · demo lengkap di dalam'}
      </span>
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
