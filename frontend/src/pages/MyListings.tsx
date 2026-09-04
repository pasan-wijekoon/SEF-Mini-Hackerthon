import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRole } from '../context/RoleContext';

type Listing = {
  _id: string;
  donorName: string;
  donorType: string;
  foodItem: string;
  quantity: number;
  quantityUnit: string;
  forWhom: string;
  location: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  contactNumber: string;
  notes?: string;
  status: 'available' | 'claimed' | 'expired' | 'cancelled';
  claimedBy?: string;
  claimedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export function MyListings() {
  const { role } = useRole();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get('/api/v1/listings?donor=me');
      setListings(response.data.data || []);
    } catch (err) {
      setError('Failed to load your listings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'claimed' | 'cancelled') => {
    try {
      await axios.patch(`/api/v1/listings/${id}`, { status: newStatus });
      setListings((prev) =>
        prev.map((listing) =>
          listing._id === id ? { ...listing, status: newStatus } : listing
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update listing');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await axios.delete(`/api/v1/listings/${id}`);
      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete listing');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-LK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'status-available';
      case 'claimed':
        return 'status-claimed';
      case 'expired':
        return 'status-expired';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (role !== 'donor') {
    return (
      <div className="page-container">
        <div className="access-denied">
          <h2>Donor Access Required</h2>
          <p>Please switch to Donor role to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="listings-page">
        <div className="page-header">
          <h1 className="page-title">My Listings</h1>
          <p className="page-subtitle">Manage your posted food listings</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {isLoading ? (
          <div className="loading">Loading your listings...</div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <p>You haven't posted any listings yet.</p>
            <a href="/donate" className="btn btn-primary">
              Post Your First Listing
            </a>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div key={listing._id} className="listing-card my-listing-card">
                <div className="listing-header">
                  <h3 className="listing-title">{listing.foodItem}</h3>
                  <span className={`status-badge ${getStatusClass(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>

                <div className="listing-details">
                  <div className="detail-row">
                    <span className="detail-label">Quantity:</span>
                    <span>{listing.quantity} {listing.quantityUnit}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">For:</span>
                    <span>{listing.forWhom}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span>{listing.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Pickup:</span>
                    <span>
                      {formatDate(listing.pickupWindowStart)} - {formatDate(listing.pickupWindowEnd)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Contact:</span>
                    <span>{listing.contactNumber}</span>
                  </div>
                  {listing.notes && (
                    <div className="detail-row">
                      <span className="detail-label">Notes:</span>
                      <span>{listing.notes}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">Posted:</span>
                    <span>{formatDate(listing.createdAt)}</span>
                  </div>
                </div>

                <div className="listing-actions">
                  {listing.status === 'available' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(listing._id, 'claimed')}
                        className="btn btn-sm btn-success"
                      >
                        Mark Claimed
                      </button>
                      <button
                        onClick={() => handleStatusChange(listing._id, 'cancelled')}
                        className="btn btn-sm btn-warning"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {listing.status === 'available' && (
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  )}
                  {listing.status === 'claimed' && listing.claimedBy && (
                    <div className="claimed-info">
                      Claimed by: <strong>{listing.claimedBy}</strong> at {formatDate(listing.claimedAt!)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}