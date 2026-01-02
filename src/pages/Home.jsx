import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ResponsiveImage from '../components/ResponsiveImage';

const withBase = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const Home = () => {
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const response = await fetch(withBase('data/albums.json'));
        if (!response.ok) throw new Error('Unable to load albums.');
        const payload = await response.json();
        setAlbums(payload);
        setStatus('ready');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    loadAlbums();
  }, []);

  if (status === 'loading') {
    return <div className="muted">Loading albums…</div>;
  }

  if (status === 'error') {
    return <div className="muted">Unable to load albums right now.</div>;
  }

  const featuredSlugs = new Set(['a-moment-to-pause', 'japan-fuji', 'japan-snow']);
  const featuredAlbums = albums.filter((album) => featuredSlugs.has(album.slug));
  const otherAlbums = albums.filter((album) => !featuredSlugs.has(album.slug));

  const renderAlbum = (album) => (
    <Link key={album.slug} to={`/albums/${album.slug}`} className="album-tile">
      <div className="album-poster">
        <ResponsiveImage
          src={album.posterSrc}
          alt={album.title}
          sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          poster
        />
      </div>
      <div className="album-title">{album.title}</div>
    </Link>
  );

  return (
    <section className="home">
      <div className="album-section">
        <div className="album-section-title">Featured</div>
        <div className="album-grid">{featuredAlbums.map(renderAlbum)}</div>
      </div>
      <div className="album-section">
        <div className="album-section-title">All albums</div>
        <div className="album-grid">{otherAlbums.map(renderAlbum)}</div>
      </div>
    </section>
  );
};

export default Home;
