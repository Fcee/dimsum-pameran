import React from 'react';
import { ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/formatters';

export const AbandonedCartBanner: React.FC = () => {
  const { hasAbandonedCart, dismissAbandonedCart, items, subtotal, setIsCartOpen } = useCart();

  if (!hasAbandonedCart || items.length === 0) return null;

  return (
    <div className="bg-cream-200 border-b border-cream-300 px-4 py-2 text-ink-900 shadow-sm relative z-40 transition-all">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-coral-500 text-white flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-coral-600">Pesanan Belum Selesai: </span>
            <span>Anda memiliki {items.length} jenis dimsum ({formatRupiah(subtotal)}) di keranjang.</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-medium text-xs bubble-button shadow-sm"
          >
            <span>Buka Keranjang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={dismissAbandonedCart}
            className="p-1 text-ink-500 hover:text-ink-800 rounded-full transition-colors"
            title="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

