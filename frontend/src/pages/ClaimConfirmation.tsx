import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import type { Listing } from '../types/listing';
import { getListing } from '../api/listingsApi';

export default function ClaimConfirmation() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const claimedBy = (location.state as { claimedBy?: string } | null)?.claimedBy;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    getListing(id)
      .then((data) => active && setListing(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <div className="page"><p className="state-msg">Loading…</p></div>;
  if (!listing) {
    return (
      <div className="page">
        <p className="state-msg state-error">Listing not found.</p>
        <Link to="/browse" className="btn-link">← Back to Browse</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="confirm-card">
        <div className="confirm-check">✓</div>
        <h1>Claim confirmed!</h1>
        <p className="confirm-sub">
          You've claimed <strong>{listing.foodItem}</strong> from{' '}
          <strong>{listing.donorName}</strong>
          {claimedBy ? <> as <strong>{claimedBy}</strong></> : null}.
        </p>

        <div className="confirm-contact">
          <h2>Arrange pickup</h2>
          <ul>
            <li>📞 <strong>Contact:</strong> <a href={`tel:${listing.contactNumber}`}>{listing.contactNumber}</a></li>
            <li>📍 <strong>Location:</strong> {listing.location}</li>
            <li>⏰ <strong>Pickup by:</strong> {new Date(listing.pickupWindowEnd).toLocaleString()}</li>
          </ul>
          <p className="confirm-note">
            Please call the donor soon to confirm and collect before the pickup window closes.
          </p>
        </div>

        <Link to="/browse" className="btn-primary">Browse more food</Link>
      </div>
    </div>
  );
}
