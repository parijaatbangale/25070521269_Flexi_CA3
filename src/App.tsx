/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { PropertyFilterBar } from './components/PropertyFilterBar.tsx';
import { PropertyCard } from './components/PropertyCard.tsx';
import { PropertyDetailModal } from './components/PropertyDetailModal.tsx';
import { AddPropertyModal } from './components/AddPropertyModal.tsx';
import { NeighborhoodExplorer } from './components/NeighborhoodExplorer.tsx';
import { MortgageModal } from './components/MortgageModal.tsx';
import { SavedPropertiesDrawer } from './components/SavedPropertiesDrawer.tsx';
import { ToursDrawer } from './components/ToursDrawer.tsx';
import { DatabaseInspectorModal } from './components/DatabaseInspectorModal.tsx';
import { Property, FilterState, DatabaseStats } from './types/property.ts';
import { Building, Sparkles, Database, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    q: '',
    listingType: 'all',
    propertyType: 'All',
    city: 'All',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    sort: 'featured',
    amenities: []
  });

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Modal / Drawer states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isMortgageOpen, setIsMortgageOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isToursDrawerOpen, setIsToursDrawerOpen] = useState(false);
  const [isDbInspectorOpen, setIsDbInspectorOpen] = useState(false);

  // Saved Properties state (LocalStorage)
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('aura_saved_properties');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // DB Stats
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [toursCount, setToursCount] = useState(0);

  // Load Properties from API
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.q) queryParams.set('q', filters.q);
      if (filters.listingType !== 'all') queryParams.set('status', filters.listingType === 'sale' ? 'For Sale' : 'For Rent');
      if (filters.propertyType !== 'All') queryParams.set('type', filters.propertyType);
      if (filters.city !== 'All') queryParams.set('city', filters.city);
      if (filters.minPrice !== '') queryParams.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== '') queryParams.set('maxPrice', filters.maxPrice.toString());
      if (filters.beds !== '') queryParams.set('beds', filters.beds.toString());
      if (filters.baths !== '') queryParams.set('baths', filters.baths.toString());
      if (filters.sort) queryParams.set('sort', filters.sort);

      const res = await fetch(`/api/properties?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        let list: Property[] = data.data;
        // Filter by amenities client-side if any selected
        if (filters.amenities && filters.amenities.length > 0) {
          list = list.filter((p) =>
            filters.amenities.every((am) => p.amenities.some((a) => a.toLowerCase().includes(am.toLowerCase())))
          );
        }
        setProperties(list);
      }
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const fetchDbStats = async () => {
    try {
      const res = await fetch('/api/db/stats');
      const data = await res.json();
      if (data.success) {
        setDbStats(data.data);
        setToursCount(data.data.collections.tours || 0);
      }
    } catch (e) {
      console.warn('Failed to load DB stats', e);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  useEffect(() => {
    fetchDbStats();
  }, []);

  // Save to LocalStorage
  const handleToggleSave = (prop: Property) => {
    setSavedPropertyIds((prev) => {
      const exists = prev.includes(prop._id);
      const next = exists ? prev.filter((id) => id !== prop._id) : [...prev, prop._id];
      try {
        localStorage.setItem('aura_saved_properties', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleClearSaved = () => {
    setSavedPropertyIds([]);
    try {
      localStorage.removeItem('aura_saved_properties');
    } catch (e) {
      console.error(e);
    }
  };

  // Distinct cities and property types
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return Array.from(set);
  }, [properties]);

  const availableTypes = useMemo(() => {
    return [
      'Portuguese Heritage Villa',
      'Luxury Sky Penthouse',
      'Diplomatic Bungalow',
      'Coastal Pavilion',
      'Backwater Nalukettu',
      'Architectural Residence',
      'Restored Heritage Haveli'
    ];
  }, []);

  const savedPropertiesList = useMemo(() => {
    return properties.filter((p) => savedPropertyIds.includes(p._id));
  }, [properties, savedPropertyIds]);

  const featuredProperty = useMemo(() => {
    return properties.find((p) => p.featured) || properties[0] || null;
  }, [properties]);

  const handleHeroQuickSearch = (city: string, type: string, budget: string) => {
    setFilters((prev) => ({
      ...prev,
      city: city || 'All',
      propertyType: type || 'All',
      maxPrice: budget ? Number(budget) : ''
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      listingType: 'all',
      propertyType: 'All',
      city: 'All',
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: '',
      sort: 'featured',
      amenities: []
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onOpenListProperty={() => setIsAddPropertyOpen(true)}
        onOpenMortgage={() => setIsMortgageOpen(true)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenTours={() => setIsToursDrawerOpen(true)}
        onOpenNeighborhoods={() => {
          setViewMode('map');
          const el = document.getElementById('properties');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenDbStats={() => setIsDbInspectorOpen(true)}
        savedCount={savedPropertyIds.length}
        toursCount={toursCount}
        dbStats={dbStats}
      />

      {/* Hero Section */}
      <HeroSection
        onSearch={handleHeroQuickSearch}
        featuredProperty={featuredProperty}
        onSelectProperty={(prop) => setSelectedProperty(prop)}
        cities={availableCities.length > 0 ? availableCities : ['Mumbai', 'Goa', 'New Delhi', 'Alibaug', 'Hyderabad', 'Kottayam', 'Jaipur', 'Bengaluru']}
        types={availableTypes}
      />

      {/* Main Catalog & Filter Anchor */}
      <main id="properties" className="flex-1">
        {/* Sticky Filter Bar */}
        <PropertyFilterBar
          filters={filters}
          onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
          onReset={handleResetFilters}
          totalCount={properties.length}
          types={availableTypes}
          cities={availableCities.length > 0 ? availableCities : ['Mumbai', 'Goa', 'New Delhi', 'Alibaug', 'Hyderabad', 'Kottayam', 'Jaipur', 'Bengaluru']}
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
        />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-8 h-8 border-2 border-stone-900 border-t-amber-400 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-mono">Loading curated estate portfolio...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm font-semibold text-red-600">Unable to load property listings</p>
              <p className="text-xs text-stone-500 font-mono">{error}</p>
              <button
                onClick={fetchProperties}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Retry Query
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <NeighborhoodExplorer
              properties={properties}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
            />
          ) : properties.length === 0 ? (
            <div className="py-24 text-center space-y-4 bg-white rounded-2xl border border-stone-200 p-8">
              <Building className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-bold font-display text-stone-900">
                No Properties Found
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                No listings matched your criteria. Try broadening your price parameters or resetting the filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {properties.map((prop) => (
                <PropertyCard
                  key={prop._id}
                  property={prop}
                  onSelect={(p) => setSelectedProperty(p)}
                  isSaved={savedPropertyIds.includes(prop._id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Trust & Brokerage Assurance Section */}
      <section className="bg-stone-900 text-stone-100 py-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-stone-800/60 rounded-xl border border-stone-700/60 space-y-3">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold font-display text-white">
                Verified Title & Escrow Security
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Every residential estate on AURA undergoes comprehensive municipal title diligence, historical zoning verification, and certified ownership authentication before public listing.
              </p>
            </div>

            <div className="p-6 bg-stone-800/60 rounded-xl border border-stone-700/60 space-y-3">
              <Building className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold font-display text-white">
                Architectural Heritage & Integrity
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Every property profile includes comprehensive architectural dossiers, precision floor layouts, materials cataloging, and verified municipal appraisal records.
              </p>
            </div>

            <div className="p-6 bg-stone-800/60 rounded-xl border border-stone-700/60 space-y-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold font-display text-white">
                Private Client Concierge
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Schedule discrete private viewings, request architectural blueprints, or arrange helicopter site visits with our dedicated licensed advisory team in each major metropolitan hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-amber-400 rotate-45 inline-block"></span>
            <span className="font-bold text-white font-display text-sm tracking-tight">
              AURA ESTATES
            </span>
            <span className="text-stone-600">·</span>
            <span>Online Property & Real Estate Platform</span>
          </div>

          <div className="flex items-center gap-6 text-stone-400">
            <button
              onClick={() => setIsDbInspectorOpen(true)}
              className="hover:text-stone-200 transition-colors cursor-pointer flex items-center gap-1 font-mono"
            >
              <span>System Infrastructure</span>
            </button>
            <button
              onClick={() => setIsMortgageOpen(true)}
              className="hover:text-stone-200 transition-colors cursor-pointer"
            >
              Home Loan / EMI Calculator
            </button>
            <button
              onClick={() => setIsAddPropertyOpen(true)}
              className="hover:text-stone-200 transition-colors cursor-pointer"
            >
              List Property
            </button>
          </div>

          <div className="text-stone-500 font-mono text-[11px]">
            &copy; {new Date().getFullYear()} AURA Estates. Luxury Real Estate India.
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isSaved={savedPropertyIds.includes(selectedProperty._id)}
          onToggleSave={handleToggleSave}
          onTourBooked={() => {
            fetchDbStats();
          }}
        />
      )}

      {isAddPropertyOpen && (
        <AddPropertyModal
          isOpen={isAddPropertyOpen}
          onClose={() => setIsAddPropertyOpen(false)}
          onPropertyAdded={(newProp) => {
            setProperties((prev) => [newProp, ...prev]);
            setSelectedProperty(newProp);
            fetchDbStats();
          }}
        />
      )}

      {isMortgageOpen && (
        <MortgageModal
          isOpen={isMortgageOpen}
          onClose={() => setIsMortgageOpen(false)}
          defaultPrice={selectedProperty ? selectedProperty.price : 185000000}
        />
      )}

      {isSavedDrawerOpen && (
        <SavedPropertiesDrawer
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          savedProperties={savedPropertiesList}
          onRemoveSaved={handleToggleSave}
          onSelectProperty={(p) => setSelectedProperty(p)}
          onClearAll={handleClearSaved}
        />
      )}

      {isToursDrawerOpen && (
        <ToursDrawer
          isOpen={isToursDrawerOpen}
          onClose={() => setIsToursDrawerOpen(false)}
        />
      )}

      {isDbInspectorOpen && (
        <DatabaseInspectorModal
          isOpen={isDbInspectorOpen}
          onClose={() => setIsDbInspectorOpen(false)}
          dbStats={dbStats}
          properties={properties}
          onReseed={() => {
            fetchProperties();
            fetchDbStats();
          }}
        />
      )}
    </div>
  );
}
