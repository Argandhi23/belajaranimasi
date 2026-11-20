import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import type { AnimationPage, Category } from '@belajar/shared';
import { getJson } from '../../lib/api';
import { Loading, Failure } from '../../components/Feedback';
import { Preview } from './Preview';
import {
  catalogueQuery,
  catalogueRangeLabel,
  filterCatalogueLocally,
  shouldFetchFilteredCatalogue,
} from './discovery';

gsap.registerPlugin(useGSAP);

export const difficultyNames: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Lanjutan',
};
const baseCatalogueQuery = catalogueQuery(new URLSearchParams());
export function Catalogue() {
  const [params, setParams] = useSearchParams();
  const heroOrbit = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = heroOrbit.current;
      if (!container) return;
      const media = gsap.matchMedia();
      media.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          const tl = gsap.timeline({ paused: true });
          tl.to(
            '.orbit-ring',
            {
              scale: 1.07,
              rotation: (index: number) => (index % 2 === 0 ? 10 : -10),
              duration: 2.8,
              stagger: { each: 0.2, from: 'center' },
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            },
            0,
          ).to(
            '.orbit-core',
            {
              rotation: 360,
              duration: 18,
              repeat: -1,
              ease: 'none',
            },
            0,
          );

          let visible = true;
          const sync = () => {
            if (visible && !document.hidden) tl.play();
            else tl.pause();
          };
          const observer = new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false;
            sync();
          });
          observer.observe(container);
          document.addEventListener('visibilitychange', sync);
          sync();
          return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', sync);
          };
        },
        heroOrbit,
      );
      return () => media.revert();
    },
    { scope: heroOrbit },
  );

  const query = catalogueQuery(params);
  const hasTextSearch = Boolean(params.get('q')?.trim());
  const catalogueTotal = useQuery({
    queryKey: ['animations', baseCatalogueQuery],
    queryFn: ({ signal }) =>
      getJson<AnimationPage>(`/api/animations?${baseCatalogueQuery}`, signal),
  });
  const localFiltered = catalogueTotal.data
    ? filterCatalogueLocally(catalogueTotal.data, params)
    : null;
  const needsServerQuery = shouldFetchFilteredCatalogue({
    query,
    baseQuery: baseCatalogueQuery,
    hasTextSearch,
    hasLocalFilter: localFiltered !== null,
    baseSucceeded: catalogueTotal.isSuccess,
  });
  const serverResult = useQuery({
    queryKey: ['animations', query],
    queryFn: ({ signal }) =>
      getJson<AnimationPage>(`/api/animations?${query}`, signal),
    enabled: needsServerQuery,
  });
  const result = needsServerQuery
    ? serverResult
    : {
        isPending: catalogueTotal.isPending,
        isError: catalogueTotal.isError,
        data: localFiltered ?? catalogueTotal.data,
        refetch: catalogueTotal.refetch,
      };
  const pageData = result.data;
  const rangeLabel = catalogueRangeLabel(
    catalogueTotal.data?.total,
    catalogueTotal.isPending,
  );
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: ({ signal }) => getJson<Category[]>('/api/categories', signal),
    staleTime: Infinity,
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
        <div className="hero-orbit" ref={heroOrbit} aria-hidden="true">
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
                  'scrubbing',
                  'scroll-trigger',
                  'parallax',
                  '3d',
                  'timeline',
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
        ) : result.isError || !pageData ? (
          <Failure retry={() => void result.refetch()} />
        ) : pageData.items.length === 0 ? (
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
              {pageData.items.map((animation) => (
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
              <span>{pageData.total} eksperimen tersedia.</span>
              {pageData.total > pageData.limit && (
                <div>
                  <button
                    disabled={pageData.page <= 1}
                    onClick={() =>
                      setParams({
                        ...Object.fromEntries(params),
                        page: String(pageData.page - 1),
                      })
                    }
                  >
                    Sebelumnya
                  </button>
                  <button
                    disabled={pageData.page * pageData.limit >= pageData.total}
                    onClick={() =>
                      setParams({
                        ...Object.fromEntries(params),
                        page: String(pageData.page + 1),
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
