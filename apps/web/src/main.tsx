import { StrictMode, lazy, Suspense, Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/api';
import { Shell } from './components/Shell';
import { Loading } from './components/Feedback';
import { Catalogue } from './features/catalogue/Catalogue';
import './styles.css';
const Detail = lazy(() =>
  import('./features/detail/Detail').then((module) => ({
    default: module.Detail,
  })),
);
class AppBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="feedback">
        <h1>Halaman belum bisa ditampilkan</h1>
        <p>Coba muat ulang untuk memulihkan aplikasi.</p>
        <button className="button" onClick={() => location.reload()}>
          Muat ulang
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<Shell />}>
                <Route index element={<Catalogue />} />
                <Route path="animasi/:slug" element={<Detail />} />
                <Route path="demo/:slug" element={<Detail fullscreen />} />
                <Route
                  path="*"
                  element={
                    <div className="feedback">
                      <h1>Halaman tidak ditemukan</h1>
                      <Link className="button" to="/">
                        Kembali ke katalog
                      </Link>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </AppBoundary>
  </StrictMode>,
);
