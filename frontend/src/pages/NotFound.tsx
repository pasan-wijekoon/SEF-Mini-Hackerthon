import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page">
      <div className="notfound">
        <h1 className="notfound-code">404</h1>
        <p className="notfound-msg">This page couldn't be found — maybe it was already claimed and cleared away.</p>
        <Link to="/browse" className="btn-primary">Back to Browse</Link>
      </div>
    </div>
  );
}
