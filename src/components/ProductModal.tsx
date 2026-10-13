import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Flame, Clock, Utensils, ShoppingBag, Sparkles } from 'lucide-react';
import { ProductItem, VariantOption, AddOnOption, SpiceLevelOption } from '../types/catalog';
import { CartItem, SelectedItemVariant } from '../types/cart';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { formatRupiah } from '../utils/formatters';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addItem, setIsCartOpen } = useCart();
  const { t } = useI18n();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariants, setSelectedVariants] = useState<SelectedItemVariant[]>([]);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<SpiceLevelOption | undefined>(undefined);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [notes, setNotes] = useState<string>('');

  // Reset defaults when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNotes('');

      // Set default variants (first option of each group)
      const defaultVars: SelectedItemVariant[] = (product.variantGroups || []).map((vg) => ({
        groupId: vg.id,
        groupName: vg.groupName,
        selectedOption: vg.options[0],
      }));
      setSelectedVariants(defaultVars);

      // Set default spice level
      if (product.spiceLevels && product.spiceLevels.length > 0) {
        setSelectedSpiceLevel(product.spiceLevels[0]);
      } else {
        setSelectedSpiceLevel(undefined);
      }

      // Reset add-ons
      setSelectedAddOns([]);
    }
  }, [product]);

  if (!product) return null;

  // Calculate prices
  const variantPriceAdd = selectedVariants.reduce((sum, v) => sum + v.selectedOption.priceAdd, 0);
  const addOnsPriceAdd = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.basePrice + variantPriceAdd + addOnsPriceAdd;
  const totalPrice = unitPrice * quantity;

  const handleSelectVariantOption = (groupId: string, groupName: string, option: VariantOption) => {
    setSelectedVariants((prev) => {
      const filtered = prev.filter((v) => v.groupId !== groupId);
      return [...filtered, { groupId, groupName, selectedOption: option }];
    });
  };

  const handleToggleAddOn = (addon: AddOnOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddToCart = () => {
    // Generate unique fingerprint
    const variantFingerprint = selectedVariants
      .sort((a, b) => a.groupId.localeCompare(b.groupId))
      .map((v) => `${v.groupId}:${v.selectedOption.id}`)
      .join('|');
    const spiceFingerprint = selectedSpiceLevel ? `spice:${selectedSpiceLevel.level}` : '';
    const addonFingerprint = selectedAddOns
      .map((a) => a.id)
      .sort()
      .join(',');
    const cartItemId = `${product.id}_${variantFingerprint}_${spiceFingerprint}_${addonFingerprint}`;

    const newCartItem: CartItem = {
      cartItemId,
      product,
      quantity,
      selectedVariants,
      selectedSpiceLevel,
      selectedAddOns,
      notes,
      unitPrice,
      totalPrice,
    };

    addItem(newCartItem);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative bg-white w-full max-w-xl max-h-[85dvh] sm:max-h-[90vh] rounded-t-bubble-xl sm:rounded-bubble-xl shadow-2xl border-t-2 sm:border-2 border-cream-300 flex flex-col overflow-hidden z-10 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Handle Drag Indicator */}
        <div className="w-12 h-1 bg-cream-400 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-cream-200 flex items-center justify-between bg-cream-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg text-ink-900 truncate">{product.title}</span>
            <span className="text-[11px] sm:text-xs bg-cream-200 text-ink-700 px-2 py-0.5 rounded-full font-bold shrink-0">
              {product.pieceCount} pcs
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-cream-200 hover:bg-cream-300 text-ink-700 transition-colors shrink-0"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          
          {/* Product Hero Image & Summary */}
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-start">
            <img
              src={product.image}
              alt={product.title}
              className="w-full sm:w-36 h-36 object-cover rounded-bubble border-2 border-cream-200 shrink-0"
            />
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                {product.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-ink-600">
                <span className="inline-flex items-center gap-1 font-semibold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  Estimasi Siap: {product.prepTimeMinutes} Menit
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-scallion-700 bg-scallion-50 px-2 py-0.5 rounded-full">
                  <Utensils className="w-3 h-3" />
                  Kukusan Higienis
                </span>
              </div>
            </div>
          </div>

          {/* Variant Groups (Nested Matrix) */}
          {product.variantGroups && product.variantGroups.map((vg) => {
            const currentSelected = selectedVariants.find((v) => v.groupId === vg.id);

            return (
              <div key={vg.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-ink-900 flex items-center gap-1.5">
                    <span>{vg.groupName}</span>
                    {vg.required && (
                      <span className="text-[9px] sm:text-[10px] bg-coral-100 text-coral-700 font-extrabold px-1.5 py-0.5 rounded-full">
                        Wajib
                      </span>
                    )}
                  </label>
                  <span className="text-[11px] text-ink-400">Pilih salah satu</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {vg.options.map((opt) => {
                    const isSelected = currentSelected?.selectedOption.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectVariantOption(vg.id, vg.groupName, opt)}
                        className={`p-3 rounded-bubble border-2 text-left transition-all flex flex-col justify-between min-h-[48px] ${
                          isSelected
                            ? 'border-coral-500 bg-coral-50/50 shadow-sm'
                            : 'border-cream-200 bg-white hover:border-cream-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-coral-700' : 'text-ink-900'}`}>
                            {opt.name}
                          </span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-coral-500 bg-coral-500 text-white' : 'border-ink-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                        {opt.description && (
                          <span className="text-[11px] text-ink-500 mt-1">{opt.description}</span>
                        )}
                        {opt.priceAdd > 0 && (
                          <span className="text-[11px] font-bold text-coral-600 mt-1">
                            +{formatRupiah(opt.priceAdd)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Spice Levels */}
          {product.spiceLevels && product.spiceLevels.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-ink-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-coral-500" />
                <span>Pilihan Tingkat Pedas / Chili Oil</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {product.spiceLevels.map((sp) => {
                  const isSelected = selectedSpiceLevel?.level === sp.level;
                  return (
                    <button
                      key={sp.level}
                      type="button"
                      onClick={() => setSelectedSpiceLevel(sp)}
                      className={`p-2.5 rounded-bubble border-2 text-center transition-all min-h-[44px] ${
                        isSelected
                          ? 'border-coral-500 bg-coral-50 text-coral-800 font-bold shadow-sm'
                          : 'border-cream-200 bg-white text-ink-800 hover:border-cream-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{sp.label}</div>
                      <div className="text-[10px] sm:text-[11px] text-ink-500 line-clamp-1 mt-0.5">{sp.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Matrix */}
          {product.addOns && product.addOns.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-ink-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-scallion-600" />
                  <span>Tambahan Saus & Cocolan (Opsional)</span>
                </label>
                <span className="text-[11px] text-ink-400">Boleh lebih dari satu</span>
              </div>

              <div className="space-y-2">
                {product.addOns.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);

                  return (
                    <label
                      key={addon.id}
                      onClick={() => handleToggleAddOn(addon)}
                      className={`p-2.5 sm:p-3 rounded-bubble border-2 flex items-center justify-between cursor-pointer transition-all min-h-[48px] ${
                        isChecked
                          ? 'border-scallion-500 bg-scallion-50/40'
                          : 'border-cream-200 bg-white hover:border-cream-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-scallion-500 border-scallion-600 text-white'
                              : 'border-ink-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-ink-900 block">{addon.name}</span>
                          {addon.recommended && (
                            <span className="text-[9px] sm:text-[10px] font-bold text-scallion-700 uppercase">
                              Paling Pas Dipadukan
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-coral-600 shrink-0">
                        +{formatRupiah(addon.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes for kitchen / booth */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-ink-900 block">
              Catatan Khusus ke Booth
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Saus dipisah, tanpa ebi, atau sendok ekstra..."
              className="w-full px-3.5 py-2.5 rounded-bubble bg-cream-50 border border-cream-300 text-ink-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
          </div>

        </div>

        {/* Footer Subtotal & Add Button with Mobile Safe Padding */}
        <div className="p-3 sm:p-4 border-t border-cream-200 bg-cream-50 flex items-center justify-between gap-3 pb-safe sm:pb-4 shrink-0 z-10">
          
          {/* Quantity Stepper */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white rounded-full border-2 border-cream-300 p-1 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-ink-800 flex items-center justify-center bubble-button"
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 sm:w-7 text-center font-bold text-xs sm:text-sm text-ink-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-ink-800 flex items-center justify-center bubble-button"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-3.5 sm:px-4 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-extrabold text-xs sm:text-sm bubble-button shadow-bubbly-coral flex items-center justify-between min-h-[48px]"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Tambah Pesanan</span>
            </div>
            <span className="bg-white/20 px-2.5 py-1 rounded-full text-xs font-black">
              {formatRupiah(totalPrice)}
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};
