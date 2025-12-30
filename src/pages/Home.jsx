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

  return (
    <section className="home">
      <div className="album-grid">
        {albums.map((album) => (
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
        ))}
      </div>
    </section>
  );
};

export default Home;
