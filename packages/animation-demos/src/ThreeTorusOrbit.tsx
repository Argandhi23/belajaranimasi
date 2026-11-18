import {
  Component,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import type { Mesh } from 'three';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

type Preset = {
  id: 'isometrik' | 'horisontal' | 'penuh';
  label: string;
  rx: number;
  ry: number;
  scale: number;
};

const presets: readonly Preset[] = [
  { id: 'isometrik', label: 'Isometrik', rx: 0.45, ry: 0.6, scale: 1 },
  { id: 'horisontal', label: 'Horisontal', rx: 0.08, ry: 1.57, scale: 1.08 },
  {
    id: 'penuh',
    label: 'Putaran Penuh',
    rx: Math.PI * 0.85,
    ry: Math.PI * 1.45,
    scale: 0.94,
  },
];

function StaticTorus({
  reason,
  progress,
  wireframe,
}: {
  reason: string;
  progress: number;
  wireframe: boolean;
}) {
  const deg = Math.round((progress / 100) * 360);
  return (
    <div
      data-testid="torus-fallback"
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
      <svg
        aria-hidden="true"
        width="176"
        height="176"
        viewBox="0 0 180 180"
        style={{
          transform: `rotate(${deg}deg)`,
          transition: 'transform 0.12s linear',
        }}
      >
        <defs>
          <linearGradient id="torusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <circle
          cx="90"
          cy="90"
          r="56"
          fill="none"
          stroke={wireframe ? '#a5b4fc' : 'url(#torusGrad)'}
          strokeWidth={wireframe ? '3' : '16'}
          strokeDasharray={wireframe ? '6 5' : undefined}
        />
        <ellipse
          cx="90"
          cy="90"
          rx="68"
          ry="28"
          transform="rotate(32 90 90)"
          fill="none"
          stroke="#c7d2fe"
          strokeWidth="6"
          strokeDasharray={wireframe ? '4 4' : undefined}
        />
        <ellipse
          cx="90"
          cy="90"
          rx="68"
          ry="28"
          transform="rotate(-32 90 90)"
          fill="none"
          stroke="#818cf8"
          strokeWidth="6"
          strokeDasharray={wireframe ? '4 4' : undefined}
        />
      </svg>
      <p
        style={{
          maxWidth: '46ch',
          margin: 0,
          color: '#cbd5e1',
          fontSize: '0.92rem',
          lineHeight: 1.65,
        }}
      >
        {reason}
        <br />
        Slider sudut rotasi tetap memutar ilustrasi simpul torus tanpa WebGL.
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
    return this.state.failed ? null : this.props.children;
  }
}

function TorusScene({
  activePreset,
  progress,
  wireframe,
  onContextLoss,
}: {
  activePreset: Preset;
  progress: number;
  wireframe: boolean;
  onContextLoss: () => void;
}) {
  const mesh = useRef<Mesh>(null);
  const initialized = useRef(false);
  const { invalidate, gl, size } = useThree();
  const baseScale = Math.min(1, size.width / Math.max(1, size.height)) * 0.85;

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
      if (!mesh.current) return;
      const offset = (progress / 100) * Math.PI * 2;
      const targetRx = activePreset.rx + offset * 0.35;
      const targetRy = activePreset.ry + offset;
      const targetScale = baseScale * activePreset.scale;

      if (!initialized.current) {
        initialized.current = true;
        mesh.current.rotation.set(targetRx, targetRy, 0);
        mesh.current.scale.setScalar(targetScale);
        invalidate();
        return;
      }

      gsap.to(mesh.current.rotation, {
        x: targetRx,
        y: targetRy,
        duration: 0.75,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: () => invalidate(),
      });
      gsap.to(mesh.current.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.75,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: () => invalidate(),
      });
    },
    {
      dependencies: [activePreset, progress, baseScale, invalidate],
    },
  );

  useEffect(() => {
    invalidate();
  }, [wireframe, invalidate]);

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 5]} color="#e0e7ff" intensity={2.8} />
      <pointLight position={[-4, -3, 3]} color="#6366f1" intensity={1.6} />
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1, 0.34, 128, 24]} />
        <meshStandardMaterial
          color="#818cf8"
          roughness={0.28}
          metalness={0.35}
          wireframe={wireframe}
        />
      </mesh>
    </>
  );
}

export default function ThreeTorusOrbit() {
  const [preset, setPreset] = useState<Preset>(presets[0]);
  const [progress, setProgress] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [contextLost, setContextLost] = useState(false);
  const rangeId = useId();
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
      data-testid="demo-three-torus"
      style={{
        color: '#f8fafc',
        background: '#090d16',
        padding: 'clamp(22px, 4.5vw, 56px)',
        display: 'grid',
        gap: 24,
      }}
    >
      <header style={{ maxWidth: 1040, margin: '0 auto', width: '100%' }}>
        <h2
          style={{
            margin: '0 0 10px',
            fontSize: 'clamp(1.75rem, 3.6vw, 3.1rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.06,
          }}
        >
          Simpul Torus 3D Interaktif.
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '58ch',
            color: '#94a3b8',
            lineHeight: 1.65,
            fontSize: '0.95rem',
          }}
        >
          Pilih orientasi atau geser sudut rotasi. GSAP menginterpolasi rotasi
          mesh React Three Fiber menggunakan demand rendering agar GPU tetap
          hemat.
        </p>
      </header>

      <div
        data-testid="torus-stage"
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          width: '100%',
          height: 'clamp(300px, 52svh, 460px)',
          position: 'relative',
          borderRadius: 16,
          border: '1px solid #1e293b',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 50% 45%, #1e1b4b, #090d16 74%)',
        }}
      >
        {staticView ? (
          <StaticTorus
            reason={
              reduced
                ? 'Pengurangan gerak aktif pada perangkat ini.'
                : 'WebGL tidak tersedia atau konteks grafis terhenti.'
            }
            progress={progress}
            wireframe={wireframe}
          />
        ) : (
          <CanvasBoundary onFailure={handleContextLoss}>
            <Canvas
              frameloop="demand"
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 4.6], fov: 45 }}
              gl={{ antialias: true, powerPreference: 'low-power' }}
              fallback="WebGL tidak tersedia."
              aria-label="Simpul torus tiga dimensi yang berputar dengan kontrol GSAP"
            >
              <TorusScene
                activePreset={preset}
                progress={progress}
                wireframe={wireframe}
                onContextLoss={handleContextLoss}
              />
            </Canvas>
          </CanvasBoundary>
        )}
      </div>

      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gap: 16,
          padding: 20,
          borderRadius: 14,
          background: '#111827',
          border: '1px solid #1e293b',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div
            role="group"
            aria-label="Preset orientasi"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
          >
            {presets.map((item) => {
              const active = item.id === preset.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPreset(item)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: 999,
                    border: active ? '1px solid #6366f1' : '1px solid #334155',
                    background: active ? '#6366f1' : '#1e293b',
                    color: '#f8fafc',
                    font: 'inherit',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            aria-pressed={wireframe}
            onClick={() => setWireframe((prev) => !prev)}
            style={{
              padding: '9px 14px',
              borderRadius: 999,
              border: wireframe ? '1px solid #a5b4fc' : '1px solid #334155',
              background: wireframe ? '#312e81' : 'transparent',
              color: '#e0e7ff',
              font: 'inherit',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Mode rangka
          </button>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <label htmlFor={rangeId}>Sudut rotasi</label>
            <span
              aria-hidden="true"
              style={{
                color: '#a5b4fc',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {progress}%
            </span>
          </div>
          <input
            id={rangeId}
            type="range"
            min={0}
            max={100}
            value={progress}
            aria-valuetext={`${progress}%`}
            onChange={(event) => setProgress(event.currentTarget.valueAsNumber)}
            style={{
              width: '100%',
              minHeight: 34,
              margin: 0,
              accentColor: '#818cf8',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </section>
  );
}
