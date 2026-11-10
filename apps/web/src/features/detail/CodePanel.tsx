import { useEffect, useState } from 'react';
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
export function CodePanel({ source }: { source: string }) {
  const [html, setHtml] = useState('');
  useEffect(() => {
    let active = true;
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
  }, [source]);
  return (
    <section className="source-section" aria-labelledby="code-heading">
      <div className="section-title">
        <h2 id="code-heading">Kode sumber</h2>
        <CopyButton text={source} label="Copy Code" />
      </div>
      <p>
        Simpan sebagai komponen <code>.tsx</code> di proyek React + Vite. Instal
        dependensi yang tercantum. Ini adalah source yang sama dengan demo
        langsung.
      </p>
      <p>
        Dependensi dasar: <code>pnpm add gsap @gsap/react</code>. Untuk kubus
        3D, tambahkan <code>pnpm add three @react-three/fiber</code> dan{' '}
        <code>pnpm add -D @types/three</code>. Gunakan React 19 untuk contoh R3F
        ini.
      </p>
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
