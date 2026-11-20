import {
  Component,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
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
        gap: 20,
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
          <linearGradient
            id="torusMonoGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#52525b" />
          </linearGradient>
        </defs>
        <circle
          cx="90"
          cy="90"
          r="54"
          fill="none"
          stroke={wireframe ? '#d4d4d8' : 'url(#torusMonoGrad)'}
          strokeWidth={wireframe ? '2.5' : '15'}
          strokeDasharray={wireframe ? '6 5' : undefined}
        />
        <ellipse
          cx="90"
          cy="90"
          rx="68"
          ry="27"
          transform="rotate(32 90 90)"
          fill="none"
          stroke="#e4e4e7"
          strokeWidth={wireframe ? '2' : '5'}
          strokeDasharray={wireframe ? '4 4' : undefined}
        />
        <ellipse
          cx="90"
          cy="90"
          rx="68"
          ry="27"
          transform="rotate(-32 90 90)"
          fill="none"
          stroke="#71717a"
          strokeWidth={wireframe ? '2' : '5'}
          strokeDasharray={wireframe ? '4 4' : undefined}
        />
      </svg>
      <p
        style={{
          maxWidth: '42ch',
          margin: 0,
          color: '#a1a1aa',
          fontSize: '0.88rem',
          lineHeight: 1.65,
        }}
      >
        {reason}
        <br />
        Pengatur sudut di samping tetap memutar pratinjau vektor patung Simpul
        N-02.
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
  const baseScale = Math.min(1, size.width / Math.max(1, size.height)) * 0.86;

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
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 5]} color="#ffffff" intensity={3.2} />
      <pointLight position={[-4, -3, 3]} color="#d4d4d8" intensity={1.4} />
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1, 0.34, 128, 24]} />
        <meshStandardMaterial
          color="#f4f4f5"
          roughness={0.22}
          metalness={0.55}
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
  const degrees = Math.round((progress / 100) * 360);

  return (
    <section
      data-testid="demo-three-torus"
      style={
        {
          color: '#fafafa',
          background: '#09090b',
          padding: 'clamp(24px, 4.5vw, 56px)',
          '--focus': '#ffffff',
        } as CSSProperties
      }
    >
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(20px, 3.5vw, 32px)',
          alignItems: 'stretch',
        }}
      >
        <div
          data-testid="torus-stage"
          style={{
            minHeight: 'clamp(320px, 54svh, 500px)',
            position: 'relative',
            borderRadius: 18,
            border: '1px solid #27272a',
            overflow: 'hidden',
            background:
              'radial-gradient(circle at 50% 45%, #1d1d22, #09090b 74%)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '16px 20px auto',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#a1a1aa',
              pointerEvents: 'none',
              zIndex: 2,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <span>N-02 · EDISI 048/100</span>
            <span>
              {wireframe ? 'Rangka' : 'Satin'} · {degrees}°
            </span>
          </div>

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
                aria-label="Model tiga dimensi patung Simpul N-02 berbahan aluminium monokrom"
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
            display: 'grid',
            alignContent: 'space-between',
            gap: 24,
            padding: 'clamp(22px, 3.5vw, 32px)',
            borderRadius: 18,
            background: '#111114',
            border: '1px solid #27272a',
          }}
        >
          <header style={{ display: 'grid', gap: 10 }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#a1a1aa',
              }}
            >
              Koleksi Objek · Seri 02
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(1.85rem, 3.6vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.045em',
                lineHeight: 1.04,
              }}
            >
              Simpul N-02
            </h2>
            <p
              style={{
                margin: 0,
                color: '#a1a1aa',
                lineHeight: 1.65,
                fontSize: '0.9rem',
              }}
            >
              Patung geometris kontinu dari aluminium daur ulang berfinishing
              satin. Pilih sudut pandang atau periksa struktur rangkanya secara
              langsung.
            </p>
          </header>

          <dl
            style={{
              margin: 0,
              paddingBlock: 16,
              borderBlock: '1px solid #27272a',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 12,
            }}
          >
            {[
              ['Material', 'Alu 6061'],
              ['Dimensi', '18 × 18 cm'],
              ['Finishing', 'Satin Matte'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'grid', gap: 3 }}>
                <dt
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#a1a1aa',
                  }}
                >
                  {label}
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#fafafa',
                  }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div style={{ display: 'grid', gap: 18 }}>
            <div style={{ display: 'grid', gap: 10 }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#a1a1aa',
                }}
              >
                Sudut pandang
              </span>
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
                        padding: '8px 14px',
                        borderRadius: 999,
                        border: active
                          ? '1px solid #ffffff'
                          : '1px solid #27272a',
                        background: active ? '#ffffff' : '#18181b',
                        color: active ? '#09090b' : '#e4e4e7',
                        font: 'inherit',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-pressed={wireframe}
                  onClick={() => setWireframe((prev) => !prev)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 999,
                    border: wireframe
                      ? '1px solid #ffffff'
                      : '1px solid #3f3f46',
                    background: wireframe ? '#ffffff' : 'transparent',
                    color: wireframe ? '#09090b' : '#fafafa',
                    font: 'inherit',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Mode rangka
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                }}
              >
                <label htmlFor={rangeId}>Sudut rotasi</label>
                <span
                  aria-hidden="true"
                  style={{
                    color: '#d4d4d8',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {degrees}°
                </span>
              </div>
              <input
                id={rangeId}
                type="range"
                min={0}
                max={100}
                value={progress}
                aria-valuetext={`${progress}%`}
                onChange={(event) =>
                  setProgress(event.currentTarget.valueAsNumber)
                }
                style={{
                  width: '100%',
                  minHeight: 34,
                  margin: 0,
                  accentColor: '#ffffff',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
