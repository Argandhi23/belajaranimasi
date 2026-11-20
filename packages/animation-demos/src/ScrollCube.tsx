import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import type { Group } from 'three';
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
        gap: 24,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <svg aria-hidden="true" width="192" height="210" viewBox="0 0 180 200">
        <path
          d="M90 12 168 56 90 100 12 56Z"
          fill="#f4f4f5"
          stroke="#27272a"
          strokeWidth="1.5"
        />
        <path
          d="M12 56 90 100 90 188 12 144Z"
          fill="#71717a"
          stroke="#27272a"
          strokeWidth="1.5"
        />
        <path
          d="M90 100 168 56 168 144 90 188Z"
          fill="#27272a"
          stroke="#52525b"
          strokeWidth="1.5"
        />
        <path
          d="M12 90 90 134 168 90 168 110 90 154 12 110Z"
          fill="#09090b"
          opacity="0.88"
        />
        <path
          d="M90 26 154 62 154 138 90 174 26 138 26 62Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.45"
        />
      </svg>
      <p
        style={{
          maxWidth: '46ch',
          margin: 0,
          color: '#a1a1aa',
          fontSize: '0.9rem',
          lineHeight: 1.65,
        }}
      >
        {reason}
        <br />
        Tampilan isometrik statis menampilkan sasis monoblok Kubik-01 beserta
        pita akustik kelilingnya.
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
  const group = useRef<Group>(null);
  const { invalidate, gl, size } = useThree();
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
      if (!group.current || !track.current) return;
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
      const tween = gsap.to(group.current.rotation, {
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
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} color="#ffffff" intensity={3.1} />
      <directionalLight
        position={[-5, -3, -4]}
        color="#d4d4d8"
        intensity={1.15}
      />
      {/* R3F owns and disposes these geometries and materials on unmount. */}
      <group ref={group} rotation={[0.35, 0.5, 0]} scale={scale}>
        <mesh>
          <boxGeometry args={[1.56, 1.56, 1.56]} />
          <meshStandardMaterial
            color="#e4e4e7"
            roughness={0.28}
            metalness={0.3}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[1.6, 0.34, 1.6]} />
          <meshStandardMaterial
            color="#18181b"
            roughness={0.55}
            metalness={0.4}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[0.34, 1.6, 1.6]} />
          <meshStandardMaterial
            color="#111114"
            roughness={0.55}
            metalness={0.35}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[1.98, 1.98, 1.98]} />
          <meshBasicMaterial
            color="#71717a"
            wireframe
            transparent
            opacity={0.38}
          />
        </mesh>
      </group>
    </>
  );
}

export default function ScrollCube() {
  const track = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
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

  useGSAP(
    () => {
      if (staticView || !track.current || !progressBar.current) return;
      const tween = gsap.fromTo(
        progressBar.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: track.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { dependencies: [staticView], revertOnUpdate: true },
  );

  return (
    <section
      data-testid="demo-scroll-cube"
      style={
        {
          color: '#fafafa',
          background: '#09090b',
          '--focus': '#ffffff',
        } as CSSProperties
      }
    >
      <header
        style={{
          maxWidth: 1120,
          margin: 'auto',
          padding: 'clamp(28px, 4.5vw, 52px) clamp(20px, 5vw, 56px)',
          display: 'grid',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 10,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#a1a1aa',
          }}
        >
          <span>Kubik-01 · Audio Spasial</span>
          <span>Aluminium Anodisasi · 68 mm</span>
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(1.9rem, 4.2vw, 3.45rem)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: 1.03,
            textWrap: 'balance',
          }}
        >
          Bentuk murni dari segala sudut.
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '52ch',
            color: '#a1a1aa',
            fontSize: '0.96rem',
            lineHeight: 1.65,
          }}
        >
          Sasis monoblok dengan sebaran akustik 360 derajat. Gulir halaman
          perlahan untuk meninjau enam sisi dan celah resonansinya.
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
            height: 'min(85svh, calc(100svh - var(--demo-sticky-top, 0px)))',
            minHeight: 420,
            position: staticView ? 'relative' : 'sticky',
            top: staticView ? undefined : 'var(--demo-sticky-top, 0px)',
            borderTop: '1px solid #27272a',
            background:
              'radial-gradient(circle at center, #1d1d22, transparent 62%), #09090b',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '20px clamp(18px, 4vw, 48px) auto',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#a1a1aa',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <span>KUBIK-01 · EDISI STUDIO</span>
            <span>AKUSTIK 360°</span>
          </div>

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
                fallback="Canvas tidak tersedia. Gulir untuk memutar model Kubik-01."
                aria-label="Model tiga dimensi modul audio Kubik-01 yang berputar mengikuti guliran"
              >
                <CubeScene track={track} onContextLoss={handleContextLoss} />
              </Canvas>
            </CanvasBoundary>
          )}

          {!staticView && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 22,
                translate: '-50% 0',
                width: 'min(420px, calc(100% - 36px))',
                padding: '12px 16px',
                background: 'rgba(9, 9, 11, 0.88)',
                border: '1px solid #27272a',
                borderRadius: 12,
                display: 'grid',
                gap: 8,
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#d4d4d8',
                }}
              >
                <span>Tampak Depan</span>
                <span>Tampak Belakang</span>
              </div>
              <div
                style={{
                  height: 2,
                  background: '#27272a',
                  overflow: 'hidden',
                }}
              >
                <div
                  ref={progressBar}
                  style={{
                    height: '100%',
                    width: '100%',
                    background: '#ffffff',
                    transformOrigin: 'left center',
                    transform: 'scaleX(0)',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
