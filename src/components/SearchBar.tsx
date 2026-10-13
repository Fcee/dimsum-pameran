import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Flame } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating';
export type SpiceFilterOption = 'all' | 'mild' | 'spicy';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  spiceFilter: SpiceFilterOption;
  onSpiceFilterChange: (spice: SpiceFilterOption) => void;
  totalResults: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  spiceFilter,
  onSpiceFilterChange,
  totalResults,
}) => {
  const { t } = useI18n();

  return (
    <div className="bg-white rounded-bubble-lg border-2 border-cream-200 p-3 sm:p-4 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400">
            <Search className="w-4 h-4 text-coral-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-cream-50 border border-cream-300 text-ink-900 placeholder:text-ink-400 text-base sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral-400 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-400 hover:text-ink-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          
          {/* Spice Filter Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={spiceFilter}
              onChange={(e) => onSpiceFilterChange(e.target.value as SpiceFilterOption)}
              className="w-full sm:w-auto appearance-none pl-8 pr-8 py-2 rounded-full bg-cream-100 hover:bg-cream-200 border border-cream-300 text-ink-800 text-xs sm:text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-coral-400"
            >
              <option value="all">Semua Pedas</option>
              <option value="mild">Original (Tanpa Pedas)</option>
              <option value="spicy">Varian Pedas & Chili Oil</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-coral-500">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-ink-500">
              <SlidersHorizontal className="w-3 h-3" />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full sm:w-auto appearance-none pl-8 pr-8 py-2 rounded-full bg-cream-100 hover:bg-cream-200 border border-cream-300 text-ink-800 text-xs sm:text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-coral-400"
            >
              <option value="popular">Paling Populer</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-scallion-600">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-ink-500">
              <SlidersHorizontal className="w-3 h-3" />
            </div>
          </div>

        </div>

      </div>

      {/* Active Search & Result Count Bar */}
      {(searchQuery || spiceFilter !== 'all') && (
        <div className="flex items-center justify-between pt-1 border-t border-cream-200 text-xs text-ink-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span>Ditemukan <strong className="text-coral-600">{totalResults}</strong> menu dimsum</span>
            {searchQuery && (
              <span className="bg-coral-100 text-coral-700 px-2 py-0.5 rounded-full font-bold">
                "{searchQuery}"
              </span>
            )}
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              onSpiceFilterChange('all');
            }}
            className="text-coral-600 hover:text-coral-700 font-bold hover:underline"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};

