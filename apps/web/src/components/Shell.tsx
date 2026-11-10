import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Moon, Sun, ArrowUpRight } from 'lucide-react';
function savedTheme() {
  try {
    return (
      localStorage.getItem('ba-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
  } catch {
    return 'light';
  }
}
export function Shell() {
  const [theme, setTheme] = useState(savedTheme);
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('ba-theme', theme);
    } catch {
      /* Storage is optional. */
    }
  }, [theme]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Lewati navigasi
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Belajar Animasi, beranda">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
            </span>
            belajar<span className="brand-light">animasi</span>
            <span className="brand-period">.</span>
          </Link>
          <nav aria-label="Navigasi utama">
            <Link className="nav-catalogue" to="/">
              Eksplorasi
            </Link>
            <a className="nav-about" href="/#tentang">
              Tentang <ArrowUpRight size={14} />
            </a>
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={
                theme === 'dark'
                  ? 'Aktifkan tema terang'
                  : 'Aktifkan tema gelap'
              }
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer" id="tentang">
        <div>
          <Link className="footer-brand" to="/">
            Belajar Animasi.
          </Link>
          <p>Kenali tekniknya. Pahami geraknya. Bangun versimu.</p>
        </div>
        <p>
          Ruang belajar terbuka untuk developer Indonesia.
          <br />
          <span>React · GSAP · Three.js</span>
        </p>
      </footer>
    </>
  );
}
