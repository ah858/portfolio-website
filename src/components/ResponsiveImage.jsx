import { useEffect, useState } from 'react';

const withBase = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

// Base set for inline photos (lighter).
const responsiveImages = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  query: '?w=480;900;1400&format=webp;jpg&as=picture&imagetools'
});

// Posters can carry a higher-res option to stay crisp on large/HiDPI screens.
const posterImages = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  query: '?w=480;900;1400;2000&format=webp;jpg&as=picture&imagetools'
});

const normalizeKey = (src) => {
  const clean = src.replace(/^\//, '').replace(/^public\//, '');
  return `../assets/${clean.replace(/^images\//, 'images/')}`;
};

// Tiny placeholders for progressive loading.
const placeholderImages = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  query: '?w=240&format=webp&as=src&imagetools'
});

const normalizeSources = (sources) => {
  if (Array.isArray(sources)) {
    return sources;
  }

  if (sources && typeof sources === 'object') {
    return Object.entries(sources).map(([format, srcset]) => ({
      type: `image/${format === 'jpg' ? 'jpeg' : format}`,
      srcset
    }));
  }

  return null;
};

const normalizeSet = (value) => {
  const candidate = value?.default ?? value;
  if (!candidate || !candidate.sources || !candidate.img) {
    return null;
  }

  const sources = normalizeSources(candidate.sources);
  const width = candidate.img.width ?? candidate.img.w;
  const height = candidate.img.height ?? candidate.img.h;

  if (!sources?.length || !candidate.img.src || !width || !height) {
    return null;
  }

  return { sources, img: { ...candidate.img, width, height } };
};

const ResponsiveImage = ({
  src,
  alt,
  sizes,
  className,
  loading = 'lazy',
  fill = false,
  poster = false,
  onLoad
}) => {
  const [set, setSet] = useState(null);
  const [placeholder, setPlaceholder] = useState(null);
  const key = normalizeKey(src);
  const loader = poster ? posterImages[key] || responsiveImages[key] : responsiveImages[key];
  const placeholderLoader = placeholderImages[key];
  const imgStyle = {
    width: '100%',
    height: fill ? '100%' : 'auto',
    objectFit: 'cover',
    display: 'block'
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [loadedSet, loadedPlaceholder] = await Promise.all([
        loader ? loader() : Promise.resolve(null),
        placeholderLoader ? placeholderLoader() : Promise.resolve(null)
      ]);
      if (!active) return;
      setSet(normalizeSet(loadedSet));
      setPlaceholder(loadedPlaceholder?.default ?? loadedPlaceholder ?? null);
    };

    load();

    return () => {
      active = false;
    };
  }, [loader, placeholderLoader]);

  const backgroundStyle = placeholder
    ? { backgroundImage: `url(${placeholder})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  if (set) {
    return (
      <picture className={className}>
        {set.sources.map((source) => (
          <source key={source.type} type={source.type} srcSet={source.srcset} sizes={sizes} />
        ))}
        <img
          src={set.img.src}
          width={set.img.width}
          height={set.img.height}
          loading={loading}
          alt={alt}
          onLoad={onLoad}
          style={{ ...imgStyle, ...backgroundStyle }}
        />
      </picture>
    );
  }

  // Fallback for formats not run through imagetools (e.g., SVG) or missing imports/broken sets.
  return <div className={`photo-placeholder ${className || ''}`} aria-hidden="true" />;
};

export default ResponsiveImage;
