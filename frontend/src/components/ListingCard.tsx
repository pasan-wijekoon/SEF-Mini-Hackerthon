import { Link } from 'react-router-dom';
import type { Listing } from '../types/listing';

const forWhomLabel: Record<Listing['forWhom'], string> = {
  people: '🧑 People',
  animals: '🐾 Animals',
  both: '🧑🐾 People & Animals',
};

function formatWindow(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  return `${s.toLocaleTimeString([], opts)} – ${e.toLocaleTimeString([], opts)}`;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const isClaimed = listing.status === 'claimed';

  return (
    <Link to={`/listings/${listing._id}`} className="card">
      <div className="card-head">
        <h3 className="card-title">{listing.foodItem}</h3>
        <span className={`badge badge-${listing.status}`}>{listing.status}</span>
      </div>

      <p className="card-donor">{listing.donorName}</p>

      <ul className="card-meta">
        <li>📦 {listing.quantity} {listing.quantityUnit}</li>
        <li>📍 {listing.location}</li>
        <li>{forWhomLabel[listing.forWhom]}</li>
        <li>⏰ {formatWindow(listing.pickupWindowStart, listing.pickupWindowEnd)}</li>
      </ul>

      <span className={`card-cta ${isClaimed ? 'card-cta-disabled' : ''}`}>
        {isClaimed ? 'Already claimed' : 'View & Claim →'}
      </span>
    </Link>
  );
}
