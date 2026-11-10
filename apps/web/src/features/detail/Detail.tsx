import { Suspense, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowUpRight, MoveDown } from 'lucide-react';
import type { Animation } from '@belajar/shared';
import { demos } from '@belajar/animation-demos';
import { getJson, ApiError } from '../../lib/api';
import { Failure, Loading } from '../../components/Feedback';
import { difficultyNames } from '../catalogue/Catalogue';
import { isDemoId } from '../catalogue/discovery';
import { CodePanel, CopyButton } from './CodePanel';
export function Detail({ fullscreen = false }: { fullscreen?: boolean }) {
  const { slug = '' } = useParams();
  const result = useQuery({
    queryKey: ['animation', slug],
    queryFn: ({ signal }) =>
      getJson<Animation>(`/api/animations/${encodeURIComponent(slug)}`, signal),
  });
  const [source, setSource] = useState('');
  const [sourceError, setSourceError] = useState(false);
  const demoId = result.data?.demoId;
  useEffect(() => {
    let active = true;
    setSource('');
    setSourceError(false);
    if (demoId && isDemoId(demoId))
      void demos[demoId]
        .loadSource()
        .then((text) => {
          if (active) setSource(text);
        })
        .catch(() => {
          if (active) setSourceError(true);
        });
    return () => {
      active = false;
    };
  }, [demoId]);
  useEffect(() => {
    document.title = result.data
      ? `${result.data.technicalName} — Belajar Animasi`
      : 'Belajar Animasi — Eksplorasi gerak';
    return () => {
      document.title = 'Belajar Animasi — Eksplorasi gerak';
    };
  }, [result.data]);
  if (result.isPending) return <Loading />;
  if (result.isError)
    return result.error instanceof ApiError && result.error.status === 404 ? (
      <div className="feedback">
        <h1>Animasi tidak ditemukan</h1>
        <Link className="button" to="/">
          Kembali ke katalog
        </Link>
      </div>
    ) : (
      <Failure retry={() => void result.refetch()} />
    );
  const animation = result.data;
  const Demo = isDemoId(animation.demoId)
    ? demos[animation.demoId].Component
    : null;
  return (
    <>
      <div className="page-width detail-header">
        <Link className="back-link" to={fullscreen ? `/animasi/${slug}` : '/'}>
          <ArrowLeft size={16} />
          {fullscreen ? 'Kembali ke penjelasan' : 'Semua animasi'}
        </Link>
        <div className="detail-meta">
          <span>{animation.category.name}</span>
          <span>{difficultyNames[animation.difficulty]}</span>
        </div>
        <h1>{animation.technicalName}</h1>
        <p>
          {animation.indonesianName} — {animation.shortDescription}
        </p>
        <div className="detail-actions">
          {fullscreen ? (
            <a className="button primary" href="#demo">
              Mulai scroll <MoveDown size={16} />
            </a>
          ) : (
            <Link className="button primary" to={`/demo/${slug}`}>
              Buka demo layar penuh <ArrowUpRight size={16} />
            </Link>
          )}
          <a className="button" href="#penjelasan">
            Pelajari teknik
          </a>
        </div>
      </div>
      <section
        id="demo"
        aria-label={`Demo ${animation.technicalName}`}
        className="live-demo"
      >
        <Suspense fallback={<Loading />}>
          {Demo ? (
            <Demo />
          ) : (
            <p className="feedback">Demo ini belum tersedia.</p>
          )}
        </Suspense>
      </section>
      <div className="page-width detail-content" id="penjelasan">
        <section className="explanation">
          <div>
            <span className="mono">MEMAHAMI GERAK</span>
            <h2>{animation.indonesianName}</h2>
            {animation.explanation
              .split('\n')
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
          <aside>
            <h3>Di balik animasi</h3>
            <dl>
              <dt>Tingkat</dt>
              <dd>{difficultyNames[animation.difficulty]}</dd>
              <dt>Teknologi & plugin</dt>
              <dd>{animation.libraries.join(' · ')}</dd>
              <dt>Kata kunci</dt>
              <dd>{animation.tags.join(', ')}</dd>
            </dl>
            <p className="access-note">
              Preferensi kurangi gerakan di perangkatmu otomatis menampilkan
              versi statis yang tetap bisa dipelajari.
            </p>
          </aside>
        </section>
        <section className="prompt-section">
          <div className="section-title">
            <h2>Bangun versimu dengan AI</h2>
            <CopyButton text={animation.aiPrompt} label="Copy AI Prompt" />
          </div>
          <p>
            Salin instruksi ini ke asisten coding pilihanmu. Tidak ada
            permintaan AI yang dijalankan oleh situs ini.
          </p>
          <pre className="prompt-text" tabIndex={0}>
            {animation.aiPrompt}
          </pre>
        </section>
        {!Demo ? (
          <p>Kode untuk demo ini belum tersedia.</p>
        ) : source ? (
          <CodePanel source={source} />
        ) : sourceError ? (
          <p role="alert">
            Kode belum dapat dimuat. Muat ulang halaman untuk mencoba lagi.
          </p>
        ) : (
          <p role="status">Memuat source demo…</p>
        )}
        <Link className="back-link" to="/">
          <ArrowLeft size={16} />
          Jelajahi animasi lainnya
        </Link>
      </div>
    </>
  );
}
