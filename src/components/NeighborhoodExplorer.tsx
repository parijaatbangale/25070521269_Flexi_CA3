import React, { useState } from 'react';
import { MapPin, Navigation, Eye, CheckCircle2, Building, Compass } from 'lucide-react';
import { Property } from '../types/property.ts';
import { formatINR } from '../utils/formatters.ts';

interface NeighborhoodExplorerProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

const NEIGHBORHOOD_GUIDES: Record<string, {
  tagline: string;
  vibe: string;
  walkScore: number;
  landmarks: string[];
  vibeColor: string;
}> = {
  'Malabar Hill': {
    tagline: "Mumbai's Premier Sea-Facing Ridge",
    vibe: 'Secluded heritage luxury, Arabian Sea vistas, elite diplomatic residences',
    walkScore: 82,
    landmarks: ['Hanging Gardens', 'Walkeshwar Temple Tank', 'Marine Drive Queen\'s Necklace (5 min)'],
    vibeColor: 'text-emerald-700 bg-emerald-50'
  },
  'Assagao': {
    tagline: "Goa's Most Fashionable Heritage Enclave",
    vibe: 'Restored Portuguese villas, tree-lined quiet lanes, artisanal gastronomy',
    walkScore: 72,
    landmarks: ['Gunpowder Restaurant', 'Subko Coffee Assagao', 'Vagator Beach (10 min)'],
    vibeColor: 'text-cyan-700 bg-cyan-50'
  },
  "Lutyens' Delhi": {
    tagline: "Imperial Capital Diplomatic Zone",
    vibe: 'Stately colonial architecture, 2-acre private estates, wide tree-lined avenues',
    walkScore: 88,
    landmarks: ['Lodhi Gardens', 'Delhi Golf Club', 'India Gate & Khan Market'],
    vibeColor: 'text-amber-800 bg-amber-50'
  },
  'Alibaug Coast': {
    tagline: "Mumbai's Coastal Riviera & Plantation Enclave",
    vibe: 'Speedboat connectivity, pristine coconut groves, private beach access',
    walkScore: 65,
    landmarks: ['Mandwa Speedboat Jetty (10 min)', 'Boardwalk by Flamboyante', 'Awas Beach'],
    vibeColor: 'text-indigo-700 bg-indigo-50'
  },
  'Jubilee Hills': {
    tagline: "Hyderabad's Granite Ridge Hilltop Mansions",
    vibe: 'Cantilevered contemporary villas, elite clubs, Tollywood and tech titan residences',
    walkScore: 76,
    landmarks: ['Durgam Cheruvu Cable Bridge', 'KBR National Park', 'Hyderabad Golf Club'],
    vibeColor: 'text-teal-700 bg-teal-50'
  },
  'Kumarakom Backwaters': {
    tagline: "Vembanad Lake Private Waterfront Shores",
    vibe: 'Traditional Nalukettu timber architecture, private boat moorings, Ayurvedic tranquility',
    walkScore: 60,
    landmarks: ['Kumarakom Bird Sanctuary', 'Vembanad Lake Marina', 'Taj Kumarakom Resort'],
    vibeColor: 'text-orange-800 bg-orange-50'
  },
  'Civil Lines': {
    tagline: "Jaipur's Aristocratic Sandstone Heritage",
    vibe: 'Hand-carved jharokhas, marble courtyards, peaceful VIP sector',
    walkScore: 92,
    landmarks: ['Raj Bhawan', 'Statue Circle', 'Rambagh Golf Club (8 min)'],
    vibeColor: 'text-rose-800 bg-rose-50'
  },
  'Koramangala': {
    tagline: "Bengaluru's Premier Biophilic Tech Hub",
    vibe: 'Award-winning green architecture, tree-lined avenues, elite founder enclaves',
    walkScore: 95,
    landmarks: ['Third Wave Coffee Roasters', 'Koramangala Club', 'Indiranagar 100ft Rd (8 min)'],
    vibeColor: 'text-blue-800 bg-blue-50'
  },
  'Worli Sea Face': {
    tagline: "Mumbai's Iconic Sea Link Skyline Promenade",
    vibe: 'Panoramic sunsets over the Arabian Sea, direct sea link access, ultra-luxury high-rises',
    walkScore: 90,
    landmarks: ['Bandra-Worli Sea Link', 'Four Seasons Hotel', 'Worli Promenade'],
    vibeColor: 'text-purple-800 bg-purple-50'
  }
};

export const NeighborhoodExplorer: React.FC<NeighborhoodExplorerProps> = ({
  properties,
  onSelectProperty
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?._id || '');

  React.useEffect(() => {
    if (properties.length > 0 && (!selectedPropertyId || !properties.some(p => p._id === selectedPropertyId))) {
      setSelectedPropertyId(properties[0]._id);
    }
  }, [properties, selectedPropertyId]);

  const activeProperty = properties.find(p => p._id === selectedPropertyId) || properties[0];

  const guide = activeProperty ? NEIGHBORHOOD_GUIDES[activeProperty.neighborhood] || {
    tagline: 'Coveted Residential Enclave',
    vibe: 'Prestigious architecture and prime accessibility',
    walkScore: 70,
    landmarks: ['Premier dining', 'Boutique shopping', 'Cultural centers'],
    vibeColor: 'text-stone-800 bg-stone-100'
  } : null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-6 bg-stone-900 text-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Compass className="w-4 h-4" />
            <span>Geographic Distribution</span>
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            Neighborhood Dossiers & Property Spatial Matrix
          </h3>
        </div>

        <div className="text-xs text-stone-400 font-mono">
          Interactive Geospatial Coordinates
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left 4 Cols: Property Pin List */}
        <div className="lg:col-span-5 border-r border-stone-200 divide-y divide-stone-100 max-h-[560px] overflow-y-auto">
          {properties.map((prop) => {
            const isSelected = prop._id === selectedPropertyId;
            return (
              <div
                key={prop._id}
                onClick={() => setSelectedPropertyId(prop._id)}
                className={`p-4 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected ? 'bg-amber-50/70 border-l-4 border-l-amber-500' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                      <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{prop.neighborhood}, {prop.city}</span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 truncate">
                      {prop.title}
                    </h4>
                    <p className="text-xs font-mono font-semibold text-stone-700 tabular-nums">
                      {formatINR(prop.price, prop.listingType === 'rent')}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-stone-400 block">
                    {prop.bedrooms}b/{prop.bathrooms}ba
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {prop.coordinates.lat.toFixed(2)}°N
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: Active Dossier & Visual Pin Map */}
        {activeProperty && (
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-stone-50 space-y-6">
            <div>
              {/* Neighborhood Banner */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${guide?.vibeColor} mb-2`}>
                    {activeProperty.neighborhood} Enclave
                  </span>
                  <h4 className="text-2xl font-bold font-display text-stone-900">
                    {guide?.tagline}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    {guide?.vibe}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 text-center font-mono shrink-0">
                  <p className="text-xl font-bold text-stone-900 tabular-nums">{guide?.walkScore}/100</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider">Walk Score</p>
                </div>
              </div>

              {/* Spatial Coordinates Box */}
              <div className="p-4 bg-stone-900 text-stone-200 rounded-xl mb-6 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="flex items-center gap-1.5 text-stone-400">
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span>GPS Coordinates</span>
                  </span>
                  <span className="text-amber-400 font-bold tabular-nums">
                    {activeProperty.coordinates.lat}° N, {activeProperty.coordinates.lng}° E
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-300">
                  <span>Full Address</span>
                  <span className="text-right truncate max-w-[260px]">{activeProperty.address}, {activeProperty.city}</span>
                </div>
              </div>

              {/* Highlights & Landmarks */}
              <div>
                <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 font-display">
                  Prominent Neighborhood Anchors
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {guide?.landmarks.map((landmark, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-700 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{landmark}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Property Card Preview */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={activeProperty.images[0]}
                    alt={activeProperty.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-stone-900">{activeProperty.title}</h5>
                  <p className="text-xs text-stone-500 font-mono">
                    {formatINR(activeProperty.price, activeProperty.listingType === 'rent')} · {activeProperty.bedrooms} Beds · {activeProperty.sqft.toLocaleString()} sqft
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectProperty(activeProperty)}
                className="w-full sm:w-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Listing</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
