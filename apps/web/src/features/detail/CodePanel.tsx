import { useEffect, useRef, useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (status === 'idle') return;
    const timer = setTimeout(() => setStatus('idle'), 3500);
    return () => clearTimeout(timer);
  }, [status]);
  return (
    <>
      <button
        className="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setStatus('copied');
          } catch {
            setStatus('failed');
          }
        }}
      >
        {status === 'copied' ? (
          <Check size={16} />
        ) : status === 'failed' ? (
          <AlertCircle size={16} />
        ) : (
          <Copy size={16} />
        )}{' '}
        {label}
      </button>
      <span className="copy-status" role="status">
        {status === 'copied'
          ? 'Tersalin!'
          : status === 'failed'
            ? 'Clipboard diblokir. Pilih teks di bawah lalu salin manual.'
            : ''}
      </span>
    </>
  );
}
export function CodePanel({
  source,
  usesThree,
}: {
  source: string;
  usesThree: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === 'undefined',
  );
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (visible) return;
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    let active = true;
    setHtml('');
    if (!visible) return;
    void import('./highlight')
      .then(({ highlight }) => highlight(source))
      .then((value) => {
        if (active) setHtml(value);
      })
      .catch(() => {
        /* Plain text remains usable if highlighting fails. */
      });
    return () => {
      active = false;
    };
  }, [source, visible]);
  return (
    <section
      ref={sectionRef}
      className="source-section"
      aria-labelledby="code-heading"
    >
      <div className="section-title">
        <h2 id="code-heading">Kode sumber</h2>
        <CopyButton text={source} label="Copy Code" />
      </div>
      <p>
        Simpan sebagai komponen <code>.tsx</code> di proyek React + Vite. Instal{' '}
        <code>gsap</code> dan <code>@gsap/react</code>.
      </p>
      {usesThree && (
        <p>
          Untuk demo 3D, gunakan React 19 dan instal <code>three</code>,{' '}
          <code>@react-three/fiber</code>, dan <code>@types/three</code>.
        </p>
      )}
      {html ? (
        <div
          className="code-block"
          tabIndex={0}
          aria-label="Kode sumber TSX"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="code-block" tabIndex={0}>
          <code>{source}</code>
        </pre>
      )}
    </section>
  );
}
