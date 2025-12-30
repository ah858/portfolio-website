import { Link } from 'react-router-dom';

const NotFound = ({ message = 'Page not found.' }) => (
  <div className="muted" style={{ maxWidth: '520px', padding: '12px 0' }}>
    <p style={{ margin: '0 0 10px' }}>{message}</p>
    <Link to="/" className="back-link">
      ← Back to albums
    </Link>
  </div>
);

export default NotFound;
