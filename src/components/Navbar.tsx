import React from 'react';
import { Bookmark, Calendar, Database, Plus } from 'lucide-react';
import { DatabaseStats } from '../types/property.ts';

interface NavbarProps {
  onOpenListProperty: () => void;
  onOpenMortgage: () => void;
  onOpenSaved: () => void;
  onOpenTours: () => void;
  onOpenNeighborhoods: () => void;
  onOpenDbStats: () => void;
  savedCount: number;
  toursCount: number;
  dbStats: DatabaseStats | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenListProperty,
  onOpenMortgage,
  onOpenSaved,
  onOpenTours,
  onOpenNeighborhoods,
  onOpenDbStats,
  savedCount,
  toursCount,
  dbStats
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <a
          href="#"
          className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 bg-amber-400 rotate-45 inline-block"></span>
          <span>AURA ESTATES</span>
        </a>

        {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <a
            href="#properties"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Properties
          </a>
          <button
            onClick={onOpenNeighborhoods}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Neighborhoods
          </button>
          <button
            onClick={onOpenMortgage}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Home Loan
          </button>
          <button
            onClick={onOpenSaved}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-stone-400" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="text-xs text-amber-400 font-semibold tabular-nums">
                ({savedCount})
              </span>
            )}
          </button>
          <button
            onClick={onOpenTours}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-stone-400" />
            <span>Tours</span>
            {toursCount > 0 && (
              <span className="text-xs text-amber-400 font-semibold tabular-nums">
                ({toursCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-stone-300 bg-stone-800/80 rounded border border-stone-700/80"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span className="tabular-nums font-medium text-stone-200">
              {dbStats ? `${dbStats.collections.properties} Properties Active` : 'Curated Portfolio'}
            </span>
          </div>

          <button
            onClick={onOpenListProperty}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-md transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List Property</span>
          </button>
        </div>
      </div>
    </header>
  );
};
