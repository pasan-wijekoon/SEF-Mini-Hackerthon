// Shared Listing type — mirrors backend Mongoose schema (PRD §10.2)

export type DonorType = 'hotel' | 'bakery' | 'restaurant' | 'household' | 'other';
export type QuantityUnit = 'kg' | 'packets' | 'plates' | 'loaves' | 'items';
export type ForWhom = 'people' | 'animals' | 'both';
export type ListingStatus = 'available' | 'claimed' | 'expired' | 'cancelled';

export interface Listing {
  _id: string;
  donorName: string;
  donorType: DonorType;
  foodItem: string;
  quantity: number;
  quantityUnit: QuantityUnit;
  forWhom: ForWhom;
  location: string;
  pickupWindowStart: string; // ISO date string
  pickupWindowEnd: string; // ISO date string
  contactNumber: string;
  notes?: string;
  status: ListingStatus;
  claimedBy?: string;
  claimedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Filters for GET /listings query params (PRD §11)
export interface ListingFilters {
  foodType?: string; // text search on foodItem
  location?: string; // text search on location
  forWhom?: ForWhom; // exact
  status?: ListingStatus; // exact
}
