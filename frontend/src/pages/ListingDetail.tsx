import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Listing } from '../types/listing';
import { getListing, claimListing } from '../api/listingsApi';

const forWhomLabel: Record<Listing['forWhom'], string> = {
  people: 'People',
  animals: 'Animals',
  both: 'People & Animals',
};

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [claimedBy, setClaimedBy] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);

    getListing(id)
      .then((data) => active && setListing(data))
      .catch(() => active && setError('Listing not found.'))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [id]);

  const handleClaim = async () => {
    if (!id) return;
    if (claimedBy.trim().length < 2) {
      setClaimError('Please enter your name or organization.');
      return;
    }
    setClaimError(null);
    setClaiming(true);
    try {
      await claimListing(id, claimedBy.trim());
      navigate(`/listings/${id}/confirmed`, { state: { claimedBy: claimedBy.trim() } });
    } catch {
      setClaimError('Could not claim this listing. It may already be taken.');
      setClaiming(false);
    }
  };

  if (loading) return <div className="page"><p className="state-msg">Loading…</p></div>;
  if (error || !listing) {
    return (
      <div className="page">
        <p className="state-msg state-error">{error ?? 'Listing not found.'}</p>
        <Link to="/browse" className="btn-link">← Back to Browse</Link>
      </div>
    );
  }

  const isAvailable = listing.status === 'available';

  return (
    <div className="page">
      <Link to="/browse" className="btn-link">← Back to Browse</Link>

      <div className="detail-card">
        <div className="detail-head">
          <h1>{listing.foodItem}</h1>
          <span className={`badge badge-${listing.status}`}>{listing.status}</span>
        </div>

        <p className="detail-donor">from <strong>{listing.donorName}</strong> ({listing.donorType})</p>

        <dl className="detail-grid">
          <div><dt>Quantity</dt><dd>{listing.quantity} {listing.quantityUnit}</dd></div>
          <div><dt>For</dt><dd>{forWhomLabel[listing.forWhom]}</dd></div>
          <div><dt>Location</dt><dd>{listing.location}</dd></div>
          <div><dt>Pickup window</dt><dd>
            {new Date(listing.pickupWindowStart).toLocaleString()} –{' '}
            {new Date(listing.pickupWindowEnd).toLocaleTimeString()}
          </dd></div>
          {listing.notes && <div className="detail-full"><dt>Notes</dt><dd>{listing.notes}</dd></div>}
        </dl>

        {isAvailable ? (
          <div className="claim-box">
            <label htmlFor="claimedBy" className="claim-label">
              Claim this food — enter your name or organization:
            </label>
            <input
              id="claimedBy"
              className="filter-input"
              type="text"
              placeholder="e.g. Robin Hood Army SL - Colombo"
              value={claimedBy}
              onChange={(e) => setClaimedBy(e.target.value)}
            />
            {claimError && <p className="state-error">{claimError}</p>}
            <button
              type="button"
              className="btn-primary"
              onClick={handleClaim}
              disabled={claiming}
            >
              {claiming ? 'Claiming…' : 'Claim This'}
            </button>
            <p className="claim-note">
              Contact details are shown after you claim, so you can arrange pickup.
            </p>
          </div>
        ) : (
          <div className="claim-box">
            <p className="state-msg">
              This listing has already been {listing.status}
              {listing.claimedBy ? ` by ${listing.claimedBy}` : ''}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
