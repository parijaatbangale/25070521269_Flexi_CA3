import React from 'react';
import { Search, MapPin, Building2, ArrowRight } from 'lucide-react';
import { Property } from '../types/property.ts';
import { formatINR } from '../utils/formatters.ts';

interface HeroSectionProps {
  onSearch: (city: string, type: string, maxPrice: string) => void;
  featuredProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  cities: string[];
  types: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  featuredProperty,
  onSelectProperty,
  cities,
  types
}) => {
  const [selectedCity, setSelectedCity] = React.useState('All');
  const [selectedType, setSelectedType] = React.useState('All');
  const [selectedBudget, setSelectedBudget] = React.useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedCity, selectedType, selectedBudget);
    const element = document.getElementById('properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-stone-900 text-stone-100 overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-stone-800">
      {/* Subtle architectural background grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Search */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-4">
              <span>Curated Prime Real Estate</span>
              <span aria-hidden="true">·</span>
              <span>Private Client Portfolio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-display text-white leading-[1.1] mb-6 [text-wrap:balance]">
              Architectural masterworks and premier estates.
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl mb-8">
              Explore an exclusive portfolio of contemporary villas, penthouse sky residences, and coastal retreats with verified titles, transparent transaction data, and private showings.
            </p>

            {/* Quick Property Search Bar */}
            <form
              onSubmit={handleQuickSearch}
              className="bg-stone-800/90 p-3 sm:p-4 rounded-xl border border-stone-700/80 shadow-2xl backdrop-blur-md max-w-2xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                {/* City */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-stone-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Location</span>
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-stone-900 border border-stone-700 text-stone-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="All">All Locations</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property Type */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-stone-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-amber-400" />
                    <span>Type</span>
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-stone-900 border border-stone-700 text-stone-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="All">All Property Types</option>
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Max Budget */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-stone-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="text-amber-400 font-bold">₹</span>
                    <span>Max Price</span>
                  </label>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="bg-stone-900 border border-stone-700 text-stone-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="">Any Budget</option>
                    <option value="1000000">Under ₹10 Lakh (Rent / Lease)</option>
                    <option value="150000000">Under ₹15 Crore</option>
                    <option value="300000000">Under ₹30 Crore</option>
                    <option value="500000000">Under ₹50 Crore</option>
                    <option value="1000000000">Under ₹100 Crore</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-stone-950 font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Portfolio</span>
              </button>
            </form>
          </div>

          {/* Right Column: Featured Architectural Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            {featuredProperty && (
              <div 
                onClick={() => onSelectProperty(featuredProperty)}
                className="group relative bg-stone-800 rounded-2xl overflow-hidden border border-stone-700/80 shadow-2xl transition-all duration-300 hover:border-amber-400/60 cursor-pointer w-full max-w-md"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={featuredProperty.images[0]}
                    alt={featuredProperty.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
                  
                  {/* Clean unboxed tag */}
                  <div className="absolute top-4 left-4 text-xs font-semibold tracking-wider uppercase text-amber-400 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded">
                    Featured Masterpiece
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs text-amber-300 font-medium mb-1">
                      {featuredProperty.neighborhood}, {featuredProperty.city}
                    </p>
                    <h3 className="text-xl font-bold font-display tracking-tight text-white mb-2 line-clamp-1">
                      {featuredProperty.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white font-mono tabular-nums">
                        {formatINR(featuredProperty.price, featuredProperty.listingType === 'rent')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400 group-hover:translate-x-1 transition-transform">
                        <span>View Estate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card footer metadata */}
                <div className="p-4 bg-stone-850 flex items-center justify-between text-xs text-stone-300 border-t border-stone-700/60 font-mono">
                  <span>{featuredProperty.bedrooms} Beds</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredProperty.bathrooms} Baths</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{featuredProperty.sqft.toLocaleString()} sqft</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-semibold">₹{featuredProperty.pricePerSqft.toLocaleString('en-IN')}/sqft</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full-width proof / metrics strip below hero */}
        <div className="mt-14 pt-8 border-t border-stone-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-300">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">₹240 Cr+</p>
            <p className="text-xs text-stone-400 mt-1">Total Portfolio Value</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">100%</p>
            <p className="text-xs text-stone-400 mt-1">Verified Architectural Deeds</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">18 Days</p>
            <p className="text-xs text-stone-400 mt-1">Average Days to Match</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">99.4%</p>
            <p className="text-xs text-stone-400 mt-1">Client Satisfaction Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};
