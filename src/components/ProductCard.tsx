import React from 'react';
import { Star, Clock, Utensils, Plus, SlidersHorizontal, Sparkles } from 'lucide-react';
import { ProductItem } from '../types/catalog';
import { CartItem } from '../types/cart';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { formatRupiah } from '../utils/formatters';

interface ProductCardProps {
  product: ProductItem;
  onOpenModal: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const { addItem } = useCart();
  const { t } = useI18n();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    const selectedVariants = (product.variantGroups || []).map((vg) => ({
      groupId: vg.id,
      groupName: vg.groupName,
      selectedOption: vg.options[0],
    }));

    const selectedSpiceLevel = product.spiceLevels && product.spiceLevels.length > 0
      ? product.spiceLevels[0]
      : undefined;

    const variantPriceAdd = selectedVariants.reduce((sum, v) => sum + v.selectedOption.priceAdd, 0);
    const unitPrice = product.basePrice + variantPriceAdd;

    const variantFingerprint = selectedVariants.map((v) => `${v.groupId}:${v.selectedOption.id}`).join('|');
    const spiceFingerprint = selectedSpiceLevel ? `spice:${selectedSpiceLevel.level}` : '';
    const cartItemId = `${product.id}_${variantFingerprint}_${spiceFingerprint}`;

    const newCartItem: CartItem = {
      cartItemId,
      product,
      quantity: 1,
      selectedVariants,
      selectedSpiceLevel,
      selectedAddOns: [],
      notes: '',
      unitPrice,
      totalPrice: unitPrice,
    };

    addItem(newCartItem);
  };

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="bubble-card bg-white rounded-bubble sm:rounded-bubble-lg border-2 border-cream-200 overflow-hidden shadow-card-soft hover:border-coral-300 flex flex-col justify-between cursor-pointer group transition-all"
    >
      <div>
        
        {/* Product Image Area - Responsive Height */}
        <div className="relative w-full h-36 sm:h-48 bg-cream-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            {product.badge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-coral-500 text-white shadow-sm border border-white/60">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {product.badge}
              </span>
            )}
            {product.isChefSpecial && !product.badge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-scallion-500 text-white shadow-sm border border-white/60">
                {t('badge_chef')}
              </span>
            )}
          </div>

          {/* Prep time badge */}
          <div className="absolute bottom-2 right-2 bg-ink-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-coral-400" />
            <span>{product.prepTimeMinutes} mnt</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          
          {/* Metadata Row: Rating & Pcs */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-ink-500">
            <div className="flex items-center gap-1 font-bold text-ink-800">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-coral-400 text-coral-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="font-normal text-ink-400 text-[10px] sm:text-xs">({product.reviewCount})</span>
            </div>

            <div className="flex items-center gap-1 font-medium bg-cream-100 text-ink-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
              <Utensils className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-coral-500" />
              <span>{product.pieceCount} pcs</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-ink-900 group-hover:text-coral-600 transition-colors line-clamp-2 leading-snug min-h-[2.5rem] sm:min-h-[2.8rem]">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-[11px] sm:text-xs text-ink-600 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {product.shortDesc}
          </p>

        </div>

      </div>

      {/* Footer Area: Price & Action Buttons */}
      <div className="p-3 sm:p-4 pt-0">
        <div className="pt-2 sm:pt-3 border-t border-cream-200 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-2">
          
          {/* Price: Always fully visible without clipping */}
          <div className="w-full sm:w-auto">
            <span className="text-[10px] sm:text-[11px] text-ink-400 block font-semibold uppercase tracking-wider leading-none mb-1">
              Mulai Dari
            </span>
            <span className="text-base sm:text-lg font-black text-coral-600 block leading-tight">
              {formatRupiah(product.basePrice)}
            </span>
          </div>

          {/* Actions: Full width and touch friendly on mobile */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
            {/* Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              className="p-2 rounded-full bg-cream-100 hover:bg-cream-200 text-coral-600 bubble-button border border-cream-300 shrink-0"
              title={t('btn_quick_add')}
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Customize / Select Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(product);
              }}
              className="flex-1 sm:flex-none px-3 py-2 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs bubble-button shadow-bubbly-coral flex items-center justify-center gap-1.5 min-h-[36px]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t('btn_add')}</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
