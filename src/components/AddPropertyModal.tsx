import React, { useState } from 'react';
import { X, Plus, Sparkles, Building2, MapPin, DollarSign, Check, Eye } from 'lucide-react';
import { Property } from '../types/property.ts';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyAdded: (newProperty: Property) => void;
}

const PRESET_PHOTO_SETS = [
  {
    name: 'Goan Portuguese Heritage Villa',
    urls: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
    ]
  },
  {
    name: 'Mumbai Sea-Facing Sky Penthouse',
    urls: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
    ]
  },
  {
    name: "Lutyens' Diplomatic Bungalow",
    urls: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80'
    ]
  },
  {
    name: 'Kerala Backwater Nalukettu Sanctuary',
    urls: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1600&q=80'
    ]
  }
];

const AVAILABLE_AMENITIES = [
  'Infinity Pool',
  'Wine Cellar',
  'Smart Home Automation',
  'Private Yacht Dock',
  'Panoramic Views',
  'Private Spa & Sauna',
  'EV Fast Charger',
  'Home Cinema',
  'Fire Pit Terrace',
  'Chef\'s Kitchen',
  'Private Elevator',
  'Rooftop Terrace'
];

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onPropertyAdded
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('185000000');
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [propertyType, setPropertyType] = useState<any>('Portuguese Heritage Villa');
  const [bedrooms, setBedrooms] = useState('4');
  const [bathrooms, setBathrooms] = useState('4.5');
  const [sqft, setSqft] = useState('5200');
  const [lotSize, setLotSize] = useState('0.65 acres');
  const [yearBuilt, setYearBuilt] = useState('2023');
  const [garage, setGarage] = useState('3');
  
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [zipCode, setZipCode] = useState('400006');
  
  const [hoaFee, setHoaFee] = useState('35000');
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Infinity Pool',
    'Smart Home Automation',
    'Panoramic Views'
  ]);
  
  const [selectedPhotoPresetIndex, setSelectedPhotoPresetIndex] = useState(0);
  const [customImageUrl, setCustomImageUrl] = useState('');
  
  const [agentName, setAgentName] = useState('Aarav Singhania');
  const [agentEmail, setAgentEmail] = useState('aarav.singhania@auraestates.in');
  const [agentPhone, setAgentPhone] = useState('+91 98201 44892');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !address || !city) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const imagesToUse = customImageUrl.trim()
      ? [customImageUrl.trim(), ...PRESET_PHOTO_SETS[selectedPhotoPresetIndex].urls]
      : PRESET_PHOTO_SETS[selectedPhotoPresetIndex].urls;

    try {
      const payload = {
        title,
        price: Number(price),
        currency: 'INR',
        status: listingType === 'sale' ? 'For Sale' : 'For Rent',
        listingType,
        propertyType,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        sqft: Number(sqft),
        lotSize,
        yearBuilt: Number(yearBuilt),
        garage: Number(garage),
        address,
        neighborhood: neighborhood || city,
        city,
        state,
        zipCode,
        hoaFee: Number(hoaFee) || 0,
        propertyTaxAnnual: Math.round(Number(price) * 0.008),
        description: description || `Exceptional ${propertyType} situated in coveted ${neighborhood || city}. Masterfully built with seamless indoor-outdoor living, refined materiality, and breathtaking natural light.`,
        highlights: [
          'Mastercrafted architectural finishes throughout',
          'Expansive verandas and panoramic views',
          'Private landscaped grounds with bespoke entertaining spaces',
          'Turnkey luxury smart living system'
        ],
        amenities: selectedAmenities,
        images: imagesToUse,
        agent: {
          name: agentName,
          email: agentEmail,
          phone: agentPhone,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          brokerage: 'AURA Private Client Group India',
          rating: 4.98,
          salesCount: 42
        }
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success && result.data) {
        onPropertyAdded(result.data);
        onClose();
      } else {
        setErrorMsg(result.error || 'Failed to list property');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex justify-center p-0 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold font-display text-white">
              List Your Property on AURA Estates
            </h2>
            <span className="text-xs text-stone-400 font-mono hidden sm:inline">
              (Exclusive Private Portfolio)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[85vh]">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Core Details */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-display">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>1. Property Classification & Asking Price</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Property Title / Estate Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Malabar Hill Arabian Sea Sky Villa"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Asking Price (INR ₹) *
                </label>
                <div className="relative">
                  <span className="font-semibold text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 text-sm">₹</span>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 185000000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-3 py-2 text-sm font-mono font-semibold text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Listing Type
                </label>
                <select
                  value={listingType}
                  onChange={(e: any) => setListingType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900"
                >
                  <option value="sale">For Sale (Freehold)</option>
                  <option value="rent">Luxury Lease / Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Property Category
                </label>
                <select
                  value={propertyType}
                  onChange={(e: any) => setPropertyType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900"
                >
                  <option value="Portuguese Heritage Villa">Portuguese Heritage Villa</option>
                  <option value="Luxury Sky Penthouse">Luxury Sky Penthouse</option>
                  <option value="Diplomatic Bungalow">Diplomatic Bungalow</option>
                  <option value="Coastal Pavilion">Coastal Pavilion</option>
                  <option value="Backwater Nalukettu">Backwater Nalukettu</option>
                  <option value="Architectural Residence">Architectural Residence</option>
                  <option value="Restored Heritage Haveli">Restored Heritage Haveli</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Monthly Society Dues / HOA (INR ₹)
                </label>
                <input
                  type="number"
                  placeholder="35000"
                  value={hoaFee}
                  onChange={(e) => setHoaFee(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-display">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>2. Location & Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14 Ridge Road, Walkeshwar"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Neighborhood / Enclave
                </label>
                <input
                  type="text"
                  placeholder="e.g. Malabar Hill"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  placeholder="Maharashtra"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  PIN / Postal Code
                </label>
                <input
                  type="text"
                  placeholder="400006"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Specs */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 font-display">
              3. Architectural Dimensions & Layout
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="1"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Living Sqft</label>
                <input
                  type="number"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Lot Size</label>
                <input
                  type="text"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Year Built</label>
                <input
                  type="number"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Garage Spaces</label>
                <input
                  type="number"
                  value={garage}
                  onChange={(e) => setGarage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2 font-display">
              4. Prime Amenities
            </h3>
            <p className="text-xs text-stone-500 mb-3">Select the luxury features that distinguish this estate.</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-all cursor-pointer ${
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

          {/* Section 5: Photography Selection */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 font-display">
              5. Photography Suite
            </h3>
            <p className="text-xs text-stone-500 mb-3">
              Choose an architectural photography collection or supply custom imagery.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {PRESET_PHOTO_SETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhotoPresetIndex(idx)}
                  className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedPhotoPresetIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-stone-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.urls[0]}
                    alt={preset.name}
                    referrerPolicy="no-referrer"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-2 bg-stone-50 text-[11px] font-semibold text-stone-800 truncate">
                    {preset.name}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Custom Hero Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/property-hero.jpg"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          {/* Section 6: Description */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2 font-display">
              6. Editorial Narrative
            </h3>
            <textarea
              rows={3}
              placeholder="Describe the architectural language, light exposure, materials, private vistas, and neighborhood prominence..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900 resize-none"
            />
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
            <div className="text-xs text-stone-500 font-mono">
              Verified MLS & Escrow Record Generated
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm disabled:opacity-50"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{submitting ? 'Publishing Listing...' : 'Publish Listing'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
