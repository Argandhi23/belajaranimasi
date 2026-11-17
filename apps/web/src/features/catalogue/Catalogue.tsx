import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import type { AnimationPage, Category } from '@belajar/shared';
import { getJson } from '../../lib/api';
import { Loading, Failure } from '../../components/Feedback';
import { Preview } from './Preview';
import { catalogueQuery, catalogueRangeLabel } from './discovery';
export const difficultyNames: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Lanjutan',
};
const baseCatalogueQuery = catalogueQuery(new URLSearchParams());
export function Catalogue() {
  const [params, setParams] = useSearchParams();
  const query = catalogueQuery(params);
  const result = useQuery({
    queryKey: ['animations', query],
    queryFn: ({ signal }) =>
      getJson<AnimationPage>(`/api/animations?${query}`, signal),
  });
  const catalogueTotal = useQuery({
    queryKey: ['animations', baseCatalogueQuery],
    queryFn: ({ signal }) =>
      getJson<AnimationPage>(`/api/animations?${baseCatalogueQuery}`, signal),
  });
  const rangeLabel = catalogueRangeLabel(
    catalogueTotal.data?.total,
    catalogueTotal.isPending,
  );
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: ({ signal }) => getJson<Category[]>('/api/categories', signal),
  });
  const update = (key: string, value: string) => {
    // History updates before React finishes a navigation transition. Read the
    // current URL so rapid consecutive filter actions cannot restore old filters.
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };
  return (
    <div className="page-width">
      <section className="catalogue-intro">
        <div className="intro-copy">
          <h1>
            Punya ide gerak.
            <br /> <span>Temukan tekniknya.</span>
          </h1>
          <p>Jelajahi animasi, pahami cara kerjanya, lalu bawa ke proyekmu.</p>
          <a className="button primary" href="#catalogue-heading">
            Jelajahi animasi <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span className="orbit-ring" />
          <span className="orbit-ring" />
          <span className="orbit-ring" />
          <span className="orbit-ring" />
          <span className="orbit-ring" />
          <span className="orbit-core" />
        </div>
      </section>
      <section aria-label="Pencarian animasi">
        <form
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            update('q', String(data.get('q') || ''));
          }}
        >
          <Search size={21} aria-hidden="true" />
          <label className="sr-only" htmlFor="search">
            Cari teknik atau deskripsikan gerakan
          </label>
          <input
            id="search"
            key={params.get('q')}
            name="q"
            defaultValue={params.get('q') || ''}
            maxLength={200}
            placeholder="Coba: objek diam saat scroll, lalu berputar…"
          />
          <button type="submit">
            Cari <ArrowRight size={16} />
          </button>
        </form>
        <div className="search-hints">
          <span>Coba cari:</span>
          {[
            'diam saat scroll',
            'beda kecepatan',
            'kubus 3D',
            'menggambar garis',
            'bentuk berubah',
          ].map((term) => (
            <button key={term} onClick={() => update('q', term)}>
              {term}
            </button>
          ))}
        </div>
      </section>
      <section
        className="catalogue-section"
        aria-labelledby="catalogue-heading"
      >
        <div className="catalogue-heading">
          <h2 id="catalogue-heading">
            Eksplorasi animasi {rangeLabel && <span>{rangeLabel}</span>}
          </h2>
        </div>
        <div className="filter-bar">
          <div className="category-tabs" role="group" aria-label="Kategori">
            <button
              className={!params.get('category') ? 'active' : ''}
              aria-pressed={!params.get('category')}
              onClick={() => update('category', '')}
            >
              Semua animasi
            </button>
            {(categories.data || [])
              .filter((c) =>
                [
                  'pinning',
                  'scroll-trigger',
                  'parallax',
                  '3d',
                  'svg-morph',
                  'svg-draw',
                  'horizontal',
                  'typography',
                  'flip',
                  'motion-path',
                  'cursor',
                  'stagger',
                  'scroll-pinning',
                  'depth-parallax',
                  'scroll-3d',
                  'scrolltrigger-pinning',
                  'multi-layer-parallax',
                  'scroll-driven-3d',
                ].includes(c.slug),
              )
              .map((category) => (
                <button
                  className={
                    params.get('category') === category.slug ? 'active' : ''
                  }
                  key={category.slug}
                  aria-pressed={params.get('category') === category.slug}
                  onClick={() => update('category', category.slug)}
                >
                  {category.name}
                </button>
              ))}
          </div>
          <label className="difficulty-filter">
            <SlidersHorizontal size={15} />
            <span className="sr-only">Tingkat kesulitan</span>
            <select
              value={params.get('difficulty') || ''}
              onChange={(e) => update('difficulty', e.target.value)}
            >
              <option value="">Semua tingkat</option>
              {Object.entries(difficultyNames).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {params.get('q') && (
          <div className="active-query">
            Hasil untuk “{params.get('q')}”
            <button
              onClick={() => update('q', '')}
              aria-label="Hapus pencarian"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {result.isPending ? (
          <Loading />
        ) : result.isError ? (
          <Failure retry={() => void result.refetch()} />
        ) : result.data.items.length === 0 ? (
          <div className="feedback">
            <h3>Belum ada gerakan yang cocok</h3>
            <p>
              Coba kata yang lebih sederhana, seperti “scroll” atau “kubus”.
            </p>
            <button className="button" onClick={() => setParams({})}>
              Reset filter
            </button>
          </div>
        ) : (
          <>
            <div className="animation-grid">
              {result.data.items.map((animation) => (
                <article className="animation-card" key={animation.id}>
                  <Preview id={animation.demoId} />
                  <div className="card-body">
                    <div className="card-meta">
                      <span>{animation.category.name}</span>
                      <span>{difficultyNames[animation.difficulty]}</span>
                    </div>
                    <Link
                      className="card-link"
                      to={`/animasi/${animation.slug}`}
                    >
                      <h3>{animation.technicalName}</h3>
                      <ArrowRight size={20} aria-hidden="true" />
                    </Link>
                    <p className="card-description">
                      {animation.shortDescription}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="results-footer">
              <span>{result.data.total} eksperimen tersedia.</span>
              {result.data.total > result.data.limit && (
                <div>
                  <button
                    disabled={result.data.page <= 1}
                    onClick={() =>
                      setParams({
                        ...Object.fromEntries(params),
                        page: String(result.data.page - 1),
                      })
                    }
                  >
                    Sebelumnya
                  </button>
                  <button
                    disabled={
                      result.data.page * result.data.limit >= result.data.total
                    }
                    onClick={() =>
                      setParams({
                        ...Object.fromEntries(params),
                        page: String(result.data.page + 1),
                      })
                    }
                  >
                    Berikutnya
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>
      <section className="learning-note">
        <div>
          <h2>Coba teknik pertamamu.</h2>
          <p>
            Setiap eksperimen dilengkapi penjelasan, kode yang bisa dipakai,
            <br className="desktop-break" /> dan prompt AI untuk membantumu
            membangun versi sendiri.
          </p>
        </div>
        <Link to="/animasi/pin-scrub">
          Mulai dari pin & scrub <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
