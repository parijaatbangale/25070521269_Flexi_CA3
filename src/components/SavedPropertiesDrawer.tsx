import React from 'react';
import { X, Trash2, Eye, MapPin, Bookmark } from 'lucide-react';
import { Property } from '../types/property.ts';
import { formatINR } from '../utils/formatters.ts';

interface SavedPropertiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onRemoveSaved: (property: Property) => void;
  onSelectProperty: (property: Property) => void;
  onClearAll: () => void;
}

export const SavedPropertiesDrawer: React.FC<SavedPropertiesDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemoveSaved,
  onSelectProperty,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="text-base font-bold text-stone-900 font-display">
              Saved Estates ({savedProperties.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {savedProperties.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-semibold text-stone-700">No saved properties yet</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Click the bookmark icon on any estate card to save and compare later.
              </p>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div
                key={prop._id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex gap-3 group relative hover:border-stone-300 transition-colors"
              >
                <div 
                  onClick={() => {
                    onSelectProperty(prop);
                    onClose();
                  }}
                  className="w-20 h-20 rounded-lg overflow-hidden shrink-0 cursor-pointer bg-stone-200"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-stone-400 font-mono">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{prop.neighborhood}, {prop.city}</span>
                    </div>
                    <h4 
                      onClick={() => {
                        onSelectProperty(prop);
                        onClose();
                      }}
                      className="text-xs font-bold text-stone-900 truncate cursor-pointer hover:text-amber-800"
                    >
                      {prop.title}
                    </h4>
                    <p className="text-sm font-bold font-mono text-stone-900 tabular-nums">
                      {formatINR(prop.price, prop.listingType === 'rent')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono pt-1">
                    <span>{prop.bedrooms}b/{prop.bathrooms}ba · {prop.sqft.toLocaleString()} sqft</span>
                    <button
                      onClick={() => onRemoveSaved(prop)}
                      className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedProperties.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              Clear All Saved
            </button>

            <span className="text-xs font-mono text-stone-400">
              Persisted in Local Storage
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
