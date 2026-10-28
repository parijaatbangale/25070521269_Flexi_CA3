import React from 'react';
import { Bookmark, ChevronLeft, ChevronRight, MapPin, Eye } from 'lucide-react';
import { Property } from '../types/property.ts';
import { formatINR } from '../utils/formatters.ts';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  isSaved: boolean;
  onToggleSave: (property: Property) => void;
  onQuickTour?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  isSaved,
  onToggleSave
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
  ];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(property);
  };

  return (
    <article
      onClick={() => onSelect(property)}
      className="group bg-white rounded-xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Visual Slot: 65% height, 4:3 or 16:10 aspect */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={images[currentImageIndex]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
          }}
        />

        {/* Status / Category tag (unboxed subtle overlay) */}
        <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-md text-stone-100 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
          {property.propertyType}
        </div>

        {/* Bookmark Heart / Pin Button */}
        <button
          onClick={handleBookmark}
          aria-label={isSaved ? "Remove from saved" : "Save property"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isSaved
              ? 'bg-amber-400 text-stone-950 shadow-sm'
              : 'bg-stone-900/60 text-stone-200 hover:bg-stone-900/90 hover:text-white'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-stone-950' : ''}`} />
        </button>

        {/* Carousel Navigation Arrows if multiple images */}
        {images.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-stone-900/70 text-white hover:bg-stone-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-stone-900/70 text-white hover:bg-stone-900 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Pagination dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-amber-400 w-3' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Slot */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Location & Status Line */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="flex items-center gap-1 font-medium truncate max-w-[200px]">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="truncate">{property.neighborhood}, {property.city}</span>
            </span>
            <span className="font-semibold text-stone-700 uppercase tracking-wider text-[11px]">
              {property.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-stone-900 font-display line-clamp-1 group-hover:text-amber-800 transition-colors">
            {property.title}
          </h3>

          {/* Address Line */}
          <p className="text-xs text-stone-400 mt-0.5 truncate">
            {property.address}
          </p>
        </div>

        {/* Unboxed Metadata with · separator */}
        <div className="flex items-center gap-2 text-xs text-stone-600 font-mono border-t border-stone-100 pt-3">
          <span>{property.bedrooms} Beds</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{property.bathrooms} Baths</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="tabular-nums">{property.sqft.toLocaleString()} sqft</span>
        </div>

        {/* Price and Action Row */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-lg font-bold text-stone-900 font-mono tabular-nums leading-none">
              {formatINR(property.price, property.listingType === 'rent')}
            </p>
            <p className="text-[11px] text-stone-400 mt-1 font-mono">
              ₹{property.pricePerSqft.toLocaleString('en-IN')}/sqft
            </p>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </span>
        </div>
      </div>
    </article>
  );
};
