import type { Listing, ListingFilters } from '../types/listing';
import { mockListings } from './mockListings';

// Base URL of the backend API (PRD §11). Override with VITE_API_URL in .env.
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';

// Toggle: build against mocks until the backend is wired up.
// Set VITE_USE_MOCKS=false in .env once the real API is ready.
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

// ---- Mock helpers -----------------------------------------------------------

function filterMocks(filters: ListingFilters = {}): Listing[] {
  return mockListings.filter((l) => {
    if (filters.foodType && !l.foodItem.toLowerCase().includes(filters.foodType.toLowerCase())) {
      return false;
    }
    if (filters.location && !l.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.forWhom && l.forWhom !== filters.forWhom) return false;
    // Default: only show available unless a status filter is provided (PRD §11)
    const wantStatus = filters.status ?? 'available';
    if (l.status !== wantStatus) return false;
    return true;
  });
}

function buildQuery(filters: ListingFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.foodType) params.set('foodType', filters.foodType);
  if (filters.location) params.set('location', filters.location);
  if (filters.forWhom) params.set('forWhom', filters.forWhom);
  if (filters.status) params.set('status', filters.status);
  const q = params.toString();
  return q ? `?${q}` : '';
}

// ---- API functions ----------------------------------------------------------

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  if (USE_MOCKS) return filterMocks(filters);

  const res = await fetch(`${API_BASE}/listings${buildQuery(filters)}`);
  if (!res.ok) throw new Error('Failed to load listings');
  const json = await res.json();
  return json.data as Listing[];
}

export async function getListing(id: string): Promise<Listing> {
  if (USE_MOCKS) {
    const found = mockListings.find((l) => l._id === id);
    if (!found) throw new Error('Listing not found');
    return found;
  }

  const res = await fetch(`${API_BASE}/listings/${id}`);
  if (!res.ok) throw new Error('Listing not found');
  const json = await res.json();
  return json.data as Listing;
}

// Recipient claims a listing (PRD §11: PATCH /listings/:id/claim)
export async function claimListing(id: string, claimedBy: string): Promise<Listing> {
  if (USE_MOCKS) {
    const found = mockListings.find((l) => l._id === id);
    if (!found) throw new Error('Listing not found');
    found.status = 'claimed';
    found.claimedBy = claimedBy;
    found.claimedAt = new Date().toISOString();
    return found;
  }

  const res = await fetch(`${API_BASE}/listings/${id}/claim`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claimedBy }),
  });
  if (!res.ok) throw new Error('Failed to claim listing');
  const json = await res.json();
  return json.data as Listing;
}
