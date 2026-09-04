import type { ForWhom, ListingFilters } from '../types/listing';

interface FilterBarProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const update = (patch: Partial<ListingFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="filterbar">
      <input
        className="filter-input"
        type="text"
        placeholder="Search food (e.g. bread, rice)…"
        value={filters.foodType ?? ''}
        onChange={(e) => update({ foodType: e.target.value || undefined })}
      />

      <input
        className="filter-input"
        type="text"
        placeholder="Location (e.g. Colombo, Kandy)…"
        value={filters.location ?? ''}
        onChange={(e) => update({ location: e.target.value || undefined })}
      />

      <select
        className="filter-select"
        value={filters.forWhom ?? ''}
        onChange={(e) => update({ forWhom: (e.target.value || undefined) as ForWhom | undefined })}
      >
        <option value="">For whom — any</option>
        <option value="people">People</option>
        <option value="animals">Animals</option>
        <option value="both">Both</option>
      </select>

      <button
        type="button"
        className="filter-clear"
        onClick={() => onChange({})}
      >
        Clear
      </button>
    </div>
  );
}
