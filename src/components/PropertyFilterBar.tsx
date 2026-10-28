import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, Map, RotateCcw, X } from 'lucide-react';
import { FilterState } from '../types/property.ts';

interface PropertyFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  totalCount: number;
  types: string[];
  cities: string[];
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
}

export const PropertyFilterBar: React.FC<PropertyFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  types,
  cities,
  viewMode,
  onViewModeChange
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const luxuryAmenities = [
    'Infinity Pool',
    'Wine Cellar',
    'Smart Home Automation',
    'Private Yacht Dock',
    'Panoramic Views',
    'Private Spa & Sauna',
    'EV Fast Charger',
    'Home Cinema'
  ];

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities || [];
    if (current.includes(amenity)) {
      onFilterChange({ amenities: current.filter(a => a !== amenity) });
    } else {
      onFilterChange({ amenities: [...current, amenity] });
    }
  };

  const hasActiveFilters = 
    filters.q !== '' ||
    filters.listingType !== 'all' ||
    filters.propertyType !== 'All' ||
    filters.city !== 'All' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.beds !== '' ||
    filters.baths !== '' ||
    (filters.amenities && filters.amenities.length > 0);

  return (
    <div className="bg-white border-b border-stone-200 py-6 sticky top-20 z-30 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Row 1: Search & Core Segments */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search bar & Type tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => onFilterChange({ q: e.target.value })}
                placeholder="Search by neighborhood, city, architect, or features..."
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-10 pr-9 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
              />
              {filters.q && (
                <button
                  onClick={() => onFilterChange({ q: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Listing Type Segmented Control */}
            <div className="flex items-center p-1 bg-stone-100 rounded-lg shrink-0 border border-stone-200/80">
              <button
                onClick={() => onFilterChange({ listingType: 'all' })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  filters.listingType === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => onFilterChange({ listingType: 'sale' })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  filters.listingType === 'sale'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                For Sale
              </button>
              <button
                onClick={() => onFilterChange({ listingType: 'rent' })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  filters.listingType === 'rent'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Lease / Rent
              </button>
            </div>
          </div>

          {/* Controls Right: City filter, Sort, Advanced Filter Toggle, View Toggle */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 lg:pb-0">
            {/* City Selector */}
            <select
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-900 transition-colors shrink-0"
            >
              <option value="All">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <div className="relative shrink-0 flex items-center">
              <select
                value={filters.sort}
                onChange={(e) => onFilterChange({ sort: e.target.value })}
                className="bg-stone-50 border border-stone-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-900 transition-colors appearance-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="sqft-desc">Largest Space (Sqft)</option>
                <option value="newest">Recently Listed</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Advanced Filters Button */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                showAdvanced || hasActiveFilters
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              )}
            </button>

            {/* View Mode Toggle: Grid vs Map */}
            <div className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200 shrink-0">
              <button
                onClick={() => onViewModeChange('grid')}
                title="Grid Card View"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('map')}
                title="Map & Neighborhood View"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Property Type Pills / Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => onFilterChange({ propertyType: 'All' })}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              filters.propertyType === 'All'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Types
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange({ propertyType: type })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filters.propertyType === type
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvanced && (
          <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
            {/* Min Price */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Min Price (INR ₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 50000000 (₹5 Cr)"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : '' })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-mono tabular-nums text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Max Price (INR ₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 500000000 (₹50 Cr)"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : '' })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-mono tabular-nums text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Minimum Bedrooms
              </label>
              <select
                value={filters.beds}
                onChange={(e) => onFilterChange({ beds: e.target.value ? Number(e.target.value) : '' })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900"
              >
                <option value="">Any Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
                <option value="6">6+ Bedrooms</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Minimum Bathrooms
              </label>
              <select
                value={filters.baths}
                onChange={(e) => onFilterChange({ baths: e.target.value ? Number(e.target.value) : '' })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900"
              >
                <option value="">Any Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
                <option value="5">5+ Bathrooms</option>
                <option value="6">6+ Bathrooms</option>
              </select>
            </div>

            {/* Amenities Multi-select */}
            <div className="sm:col-span-2 lg:col-span-4 pt-2">
              <label className="block text-xs font-medium text-stone-600 mb-2">
                Prime Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {luxuryAmenities.map((amenity) => {
                  const isSelected = (filters.amenities || []).includes(amenity);
                  return (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1 text-xs rounded-md border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-stone-950 border-amber-500 font-semibold shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Filters */}
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        )}

        {/* Count and metadata indicator */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="font-semibold text-stone-900 font-mono tabular-nums">{totalCount}</span>
            <span>architectural listings</span>
            {hasActiveFilters && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-medium">Filtered</span>
              </>
            )}
          </div>

          <div className="text-xs text-stone-400 font-mono">
            Verified Residential Portfolio
          </div>
        </div>
      </div>
    </div>
  );
};
