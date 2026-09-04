import { useEffect, useState } from 'react';
import type { Listing, ListingFilters } from '../types/listing';
import { getListings } from '../api/listingsApi';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/FilterBar';

export default function BrowseListings() {
  const [filters, setFilters] = useState<ListingFilters>({});
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getListings(filters)
      .then((data) => {
        if (active) setListings(data);
      })
      .catch(() => {
        if (active) setError('Could not load listings. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <div className="page">
      <header className="page-head">
        <h1>Available Food Near You</h1>
        <p className="page-sub">Browse surplus food and claim what you can use.</p>
      </header>

      <FilterBar filters={filters} onChange={setFilters} />

      {loading && <p className="state-msg">Loading listings…</p>}
      {error && <p className="state-msg state-error">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <p className="state-msg">No listings match your filters. Try clearing them.</p>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="card-grid">
          {listings.map((l) => (
            <ListingCard key={l._id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
