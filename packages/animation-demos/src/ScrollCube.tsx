import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import type { Mesh } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function StaticCube({ reason }: { reason: string }) {
  return (
    <div
      data-testid="cube-fallback"
      style={{
        display: 'grid',
        placeItems: 'center',
        height: '100%',
        alignContent: 'center',
        gap: 36,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <svg aria-hidden="true" width="180" height="200" viewBox="0 0 180 200">
        <path d="M90 10 170 55 90 100 10 55Z" fill="#f9b26d" />
        <path d="M10 55 90 100 90 190 10 145Z" fill="#db7a35" />
        <path d="M90 100 170 55 170 145 90 190Z" fill="#ae4c20" />
      </svg>
      <p
        style={{
          maxWidth: '44ch',
          margin: 0,
          color: '#eed6c8',
          lineHeight: 1.6,
        }}
      >
        {reason}
        <br />
        Scroll memutar kubus pada sumbu X dan Y. Ilustrasi ini menunjukkan tiga
        sisinya.
      </p>
    </div>
  );
}

class CanvasBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? (
      <StaticCube reason="WebGL tidak tersedia pada perangkat ini." />
    ) : (
      this.props.children
    );
  }
}

function CubeScene({
  track,
  onContextLoss,
}: {
  track: RefObject<HTMLDivElement | null>;
  onContextLoss: () => void;
}) {
  const mesh = useRef<Mesh>(null);
  const { invalidate, gl, size } = useThree();
  // Keep the full cube in view on tall, narrow canvases.
  const scale = Math.min(1, size.width / Math.max(1, size.height));
  useEffect(() => {
    const canvas = gl.domElement;
    const handleLoss = (event: Event) => {
      event.preventDefault();
      onContextLoss();
    };
    canvas.addEventListener('webglcontextlost', handleLoss);
    return () => canvas.removeEventListener('webglcontextlost', handleLoss);
  }, [gl, onContextLoss]);
  useGSAP(
    () => {
      if (!mesh.current || !track.current) return;
      let visible = false;
      const draw = () => {
        if (visible && !document.hidden) invalidate();
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? false;
        draw();
      });
      observer.observe(gl.domElement);
      document.addEventListener('visibilitychange', draw);
      const tween = gsap.to(mesh.current.rotation, {
        x: Math.PI * 1.3,
        y: Math.PI * 2.25,
        ease: 'none',
        onUpdate: draw,
        scrollTrigger: {
          trigger: track.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      let alive = true;
      void document.fonts.ready.then(() => {
        if (alive) tween.scrollTrigger?.refresh();
      });
      return () => {
        alive = false;
        observer.disconnect();
        document.removeEventListener('visibilitychange', draw);
      };
    },
    { dependencies: [invalidate, gl, track], revertOnUpdate: true },
  );
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 5, 6]} color="#ffe2cc" intensity={3} />
      {/* R3F owns and disposes this component's geometry and material on unmount. */}
      <mesh ref={mesh} rotation={[0.35, 0.5, 0]} scale={scale}>
        <boxGeometry args={[1.7, 1.7, 1.7]} />
        <meshStandardMaterial
          color="#df8c58"
          roughness={0.42}
          metalness={0.08}
        />
      </mesh>
    </>
  );
}

export default function ScrollCube() {
  const track = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [contextLost, setContextLost] = useState(false);
  const handleContextLoss = useCallback(() => setContextLost(true), []);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const staticView = reduced || contextLost;
  return (
    <section
      data-testid="demo-scroll-cube"
      style={{ color: '#fff2e7', background: '#23191a' }}
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
          Putar ruang dengan scroll.
        </h2>
        <p style={{ margin: '0 0 8px', maxWidth: '58ch', lineHeight: 1.6 }}>
          Gulir untuk memutar kubus pada sumbu X dan Y. Kamera tetap diam,
          sementara cahaya menampakkan sisi yang berbeda.
        </p>
        <p
          style={{
            margin: 0,
            maxWidth: '58ch',
            color: '#eed6c8',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
          Ilustrasi statis tersedia jika pengurangan gerak aktif atau WebGL
          tidak tersedia.
        </p>
      </header>
      <div
        ref={track}
        data-testid="cube-track"
        style={{ height: staticView ? 'auto' : '240svh', position: 'relative' }}
      >
        <div
          data-testid="cube-stage"
          style={{
            height: '85svh',
            minHeight: 400,
            position: staticView ? 'relative' : 'sticky',
            top: 0,
            borderTop: '1px solid #684539',
            background:
              'linear-gradient(#ffd6bd35, #ffd6bd35) center / 77% 1px no-repeat, linear-gradient(#ffd6bd35, #ffd6bd35) center / 1px 76% no-repeat, radial-gradient(ellipse at center, #60392c, transparent 66%), #211819',
            overflow: 'hidden',
          }}
        >
          {staticView ? (
            <StaticCube
              reason={
                reduced
                  ? 'Pengurangan gerak aktif.'
                  : 'Konteks WebGL terputus; ilustrasi statis tetap tersedia.'
              }
            />
          ) : (
            <CanvasBoundary onFailure={handleContextLoss}>
              <Canvas
                frameloop="demand"
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ antialias: true, powerPreference: 'low-power' }}
                fallback="Canvas tidak tersedia. Scroll mengendalikan rotasi kubus pada sumbu X dan Y."
                aria-label="Kubus oranye tiga dimensi yang berputar mengikuti scroll"
              >
                <CubeScene track={track} onContextLoss={handleContextLoss} />
              </Canvas>
            </CanvasBoundary>
          )}
          {!staticView && (
            <p
              style={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                translate: '-50% 0',
                width: 'max-content',
                maxWidth: 'calc(100% - 32px)',
                margin: 0,
                padding: '8px 16px',
                background: '#23191a',
                border: '1px solid #684539',
                borderRadius: 6,
                color: '#eed6c8',
                textAlign: 'center',
                font: '600 0.8rem/1.5 var(--font-sans, inherit)',
                pointerEvents: 'none',
              }}
            >
              scroll ↕ → rotation.x + rotation.y
            </p>
          )}
        </div>
      </div>
      <footer
        style={{
          borderTop: '1px solid #684539',
          padding: 'clamp(36px, 7vw, 80px) 24px',
          textAlign: 'center',
          color: '#eed6c8',
          lineHeight: 1.6,
        }}
      >
        Render hanya saat diperlukan. Gulir kembali untuk melihat sisi
        sebelumnya.
      </footer>
    </section>
  );
}
