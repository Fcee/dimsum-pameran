import React from 'react';
import { Layers, Flame, Sparkles, UtensilsCrossed, Package, Coffee } from 'lucide-react';
import { DimsumCategory } from '../types/catalog';
import { useI18n } from '../context/I18nContext';

interface CategoryFilterProps {
  activeCategory: DimsumCategory;
  onSelectCategory: (cat: DimsumCategory) => void;
  categoryCounts: Record<DimsumCategory, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const { t } = useI18n();

  const categories: { id: DimsumCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t('category_all'), icon: <Layers className="w-4 h-4" /> },
    { id: 'kukus', label: t('category_kukus'), icon: <Flame className="w-4 h-4" /> },
    { id: 'goreng', label: t('category_goreng'), icon: <Sparkles className="w-4 h-4" /> },
    { id: 'mentai', label: t('category_mentai'), icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'platter', label: t('category_platter'), icon: <Package className="w-4 h-4" /> },
    { id: 'minuman', label: t('category_minuman'), icon: <Coffee className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = categoryCounts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`bubble-button shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm border-2 transition-all ${
              isActive
                ? 'bg-coral-500 border-coral-600 text-white shadow-bubbly-coral translate-y-[-2px]'
                : 'bg-white border-cream-300 text-ink-800 hover:border-coral-300 hover:bg-coral-50/50'
            }`}
          >
            <span className={isActive ? 'text-white' : 'text-coral-500'}>{cat.icon}</span>
            <span>{cat.label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                isActive ? 'bg-white/25 text-white' : 'bg-cream-200 text-ink-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

