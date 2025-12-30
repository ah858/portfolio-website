import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Album = lazy(() => import('./pages/Album'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PHOTOGRAPHER = 'Akil Hashmi';

const App = () => {
  const location = useLocation();
  const onAlbumPage = location.pathname.includes('/albums/');

  return (
    <div className="page-shell">
      <header className="top-bar">
        <Link to="/" className="brand">
          {PHOTOGRAPHER}
        </Link>
        {onAlbumPage ? (
          <Link to="/" className="back-link">
            ← Back to albums
          </Link>
        ) : null}
      </header>

      <main className="content">
        <Suspense fallback={<div className="muted">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/albums/:slug" element={<Album />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
