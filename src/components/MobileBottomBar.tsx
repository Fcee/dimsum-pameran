import React from 'react';
import {
  UtensilsCrossed,
  Coins,
  MapPin,
  Settings,
  ShoppingBag,
  ArrowRight,
  Percent
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatters';

interface MobileBottomBarProps {
  onOpenLoyalty: () => void;
  onOpenSettings: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenLoyalty,
  onOpenSettings,
}) => {
  const { totalItemsCount, totalFinal, subtotal, bundlingStatus, setIsCartOpen } = useCart();
  const { loyaltyPoints, config } = useStore();

  const scrollToMenu = () => {
    const el = document.getElementById('menu-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToBooth = () => {
    const el = document.getElementById('booth-info');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      
      {/* Floating Cart Call-To-Action Pill (When items in cart) */}
      {totalItemsCount > 0 && (
        <div className="px-3 pb-2 pointer-events-auto">
          <div
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-coral-500 text-white rounded-full p-2.5 px-4 shadow-2xl border-2 border-white/80 flex items-center justify-between cursor-pointer bubble-button"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full bg-white text-coral-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ink-900 text-white text-[10px] font-black flex items-center justify-center">
                  {totalItemsCount}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold leading-none">
                    {formatRupiah(totalFinal)}
                  </span>
                  {bundlingStatus.discountAmount > 0 && (
                    <span className="text-[10px] line-through text-coral-200">
                      {formatRupiah(subtotal)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-coral-100 font-medium block">
                  {totalItemsCount} Porsi Dimsum Dipilih
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full text-xs font-black">
              <span>Keranjang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Quick-Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md border-t border-cream-300 shadow-lg pointer-events-auto pb-safe">
        <div className="grid grid-cols-4 h-14 items-center text-center">
          
          {/* Menu Catalog Button */}
          <button
            onClick={scrollToMenu}
            className="flex flex-col items-center justify-center text-ink-700 hover:text-coral-600 active:scale-95 transition-transform"
          >
            <UtensilsCrossed className="w-5 h-5 text-coral-500" />
            <span className="text-[10px] font-bold mt-0.5">Daftar Menu</span>
          </button>

          {/* Loyalty Points Button */}
          <button
            onClick={onOpenLoyalty}
            className="flex flex-col items-center justify-center text-ink-700 hover:text-coral-600 active:scale-95 transition-transform"
          >
            <div className="relative">
              <Coins className="w-5 h-5 text-scallion-600" />
              <span className="absolute -top-1 -right-2 bg-coral-500 text-white text-[8px] font-extrabold px-1 rounded-full">
                {loyaltyPoints}
              </span>
            </div>
            <span className="text-[10px] font-bold mt-0.5">Koin Hadiah</span>
          </button>

          {/* Booth Info Button */}
          <button
            onClick={scrollToBooth}
            className="flex flex-col items-center justify-center text-ink-700 hover:text-coral-600 active:scale-95 transition-transform"
          >
            <MapPin className="w-5 h-5 text-coral-500" />
            <span className="text-[10px] font-bold mt-0.5">Booth B-14</span>
          </button>

          {/* Settings / Config Button */}
          <button
            onClick={onOpenSettings}
            className="flex flex-col items-center justify-center text-ink-700 hover:text-coral-600 active:scale-95 transition-transform"
          >
            <Settings className="w-5 h-5 text-ink-600" />
            <span className="text-[10px] font-bold mt-0.5">Toko UMKM</span>
          </button>

        </div>
      </div>

    </div>
  );
};

