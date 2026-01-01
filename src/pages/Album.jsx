import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ResponsiveImage from '../components/ResponsiveImage';
import NotFound from './NotFound';

const withBase = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const Album = () => {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [status, setStatus] = useState('loading');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const response = await fetch(withBase(`data/${slug}.json`));
        if (!response.ok) throw new Error('Unable to load album.');
        const payload = await response.json();
        setAlbum(payload);
        setStatus('ready');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    loadAlbum();
  }, [slug]);

  const openLightbox = useCallback((src, caption) => {
    setLightbox({ src, caption });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox]);

  const handleKeyActivate = (e, src, caption) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(src, caption);
    }
  };

  if (status === 'loading') {
    return <div className="muted">Loading album…</div>;
  }

  if (status === 'error' || !album) {
    return <NotFound message="Album not found." />;
  }

  const firstVisualIndex = album.blocks?.findIndex(
    (b) => b.type === 'photo' || b.type === 'photoCluster'
  );

  const renderBlock = (block, index) => {
    const isHero = index === firstVisualIndex || block.span === 'wide';
    const sizes = isHero
      ? '(max-width: 720px) 100vw, (max-width: 1200px) 90vw, 90vw'
      : '(max-width: 720px) 100vw, (max-width: 1200px) 45vw, 30vw';

    if (block.type === 'text') {
      return (
        <div className="masonry-item text-block full-span" key={index}>
          <p>{block.content}</p>
        </div>
      );
    }

    if (block.type === 'photo') {
      return (
        <figure
          className={`masonry-item photo-card clickable ${isHero ? 'hero' : ''}`}
          key={index}
          role="button"
          tabIndex={0}
          onClick={() => openLightbox(block.src, block.caption)}
          onKeyDown={(e) => handleKeyActivate(e, block.src, block.caption)}
        >
          <ResponsiveImage src={block.src} alt={block.caption || 'Photo'} sizes={sizes} />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    }

    if (block.type === 'photoCluster' && Array.isArray(block.photos)) {
      const photoCount = block.photos.length;
      const clusterStyle = photoCount === 2 ? { maxWidth: '800px', margin: '0 auto' } : undefined;
      const clusterClass = `masonry-item cluster-card ${isHero ? 'hero' : ''} ${
        photoCount === 1 ? 'single-cluster' : ''
      }`;
      return (
        <div className={clusterClass} key={index} style={clusterStyle}>
          {block.photos.map((photo, idx) => (
            <figure
              className="photo-card nested clickable"
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => openLightbox(photo.src, photo.caption)}
              onKeyDown={(e) => handleKeyActivate(e, photo.src, photo.caption)}
            >
              <ResponsiveImage
                src={photo.src}
                alt={photo.caption || 'Photo'}
                sizes="(max-width: 720px) 100vw, (max-width: 1200px) 40vw, 28vw"
              />
              {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      );
    }

    if (block.type === 'fieldnotes') {
      return (
        <div className="masonry-item fieldnotes full-span" key={index}>
          <div className="fieldnotes-label">Field notes</div>
          <p>{block.content}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="album">
      <div className="album-header">
        <div className="album-kicker">Photo essay</div>
        <h1 className="page-title">{album.albumTitle}</h1>
      </div>
      <div className="masonry">{album.blocks?.map(renderBlock)}</div>
      {lightbox ? (
        <div className="lightbox" onClick={closeLightbox} role="presentation">
          <div
            className="lightbox-inner"
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged photo"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" type="button" onClick={closeLightbox} aria-label="Close">
              ×
            </button>
            <ResponsiveImage
              className="lightbox-img"
              src={lightbox.src}
              alt={lightbox.caption || 'Photo'}
              sizes="100vw"
              loading="eager"
            />
            {lightbox.caption ? <div className="lightbox-caption">{lightbox.caption}</div> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Album;
