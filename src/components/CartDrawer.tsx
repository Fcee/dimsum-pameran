import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Percent,
  MapPin,
  Compass,
  ArrowRight,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../context/I18nContext';
import { formatRupiah } from '../utils/formatters';

interface CartDrawerProps {
  onProceedToWhatsApp: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToWhatsApp }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    bundlingStatus,
    totalFinal,
    totalItemsCount,
    customerInfo,
    updateCustomerInfo,
  } = useCart();

  const { isOpen, config } = useStore();
  const { t } = useI18n();

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Simple Geotagging helper (PRD 4.3)
  const handleRequestGeolocation = () => {
    if (!navigator.geolocation) {
      updateCustomerInfo({ boothNote: `${config.boothLocation} (${config.city})` });
      setGeoSuccess(true);
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        setGeoSuccess(true);
        // Tag location with festival booth context
        updateCustomerInfo({
          boothNote: `Koordinat GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (${config.eventName})`,
        });
      },
      () => {
        setGeoLoading(false);
        // Fallback friendly location
        updateCustomerInfo({
          boothNote: `${config.boothLocation} (${config.eventName})`,
        });
        setGeoSuccess(true);
      },
      { timeout: 6000 }
    );
  };

  const handleValidateAndProceed = () => {
    if (!customerInfo.customerName.trim()) {
      setFormError('Mohon isi nama lengkap pemesan.');
      return;
    }
    if (!customerInfo.customerPhone.trim()) {
      setFormError('Mohon isi nomor WhatsApp aktif untuk konfirmasi.');
      return;
    }
    setFormError(null);
    onProceedToWhatsApp();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-cream-200 bg-cream-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-coral-500 text-white flex items-center justify-center shadow-bubbly-coral">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink-900">{t('cart_title')}</h2>
                <span className="text-xs text-ink-500 font-medium">
                  {totalItemsCount} porsi dipesan
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-1.5 rounded-full text-ink-400 hover:text-coral-600 hover:bg-coral-50 transition-colors"
                  title="Kosongkan Keranjang"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full bg-cream-200 hover:bg-cream-300 text-ink-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-cream-100 border-2 border-dashed border-cream-300 mx-auto flex items-center justify-center text-ink-400">
                  <ShoppingBag className="w-10 h-10 text-coral-400" />
                </div>
                <div>
                  <h3 className="font-bold text-ink-800 text-base">{t('cart_empty')}</h3>
                  <p className="text-xs text-ink-500 mt-1 max-w-xs mx-auto">
                    {t('cart_empty_sub')}
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-coral-500 text-white font-bold text-xs bubble-button shadow-bubbly-coral"
                >
                  Jelajahi Menu Sekarang
                </button>
              </div>
            ) : (
              <>
                {/* Dynamic Wholesale / Bundling Status Banner (PRD 4.2) */}
                <div className="rounded-bubble p-3.5 bg-cream-100 border border-cream-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-scallion-600" />
                      <span className="text-xs font-bold text-ink-900">
                        {bundlingStatus.discountPercent > 0
                          ? `${bundlingStatus.label} Aktif!`
                          : 'Promo Paket Bundling Grosir'}
                      </span>
                    </div>
                    {bundlingStatus.discountPercent > 0 && (
                      <span className="text-xs font-black text-scallion-700 bg-scallion-100 px-2 py-0.5 rounded-full">
                        Hemat {bundlingStatus.discountPercent}%
                      </span>
                    )}
                  </div>

                  {bundlingStatus.nextTierMessage && (
                    <p className="text-xs text-coral-700 font-semibold bg-coral-50 p-2 rounded-lg border border-coral-200">
                      {bundlingStatus.nextTierMessage}
                    </p>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3 rounded-bubble border-2 border-cream-200 bg-white shadow-sm space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-14 h-14 rounded-xl object-cover border border-cream-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-ink-900 leading-snug">
                              {item.product.title}
                            </h4>
                            
                            {/* Variant & Addons Info */}
                            <div className="text-[11px] text-ink-500 space-y-0.5 mt-0.5">
                              {item.selectedVariants.map((v) => (
                                <div key={v.groupId}>
                                  {v.groupName}: <span className="font-medium text-ink-700">{v.selectedOption.name}</span>
                                </div>
                              ))}
                              {item.selectedSpiceLevel && (
                                <div>
                                  Pedas: <span className="font-medium text-coral-600">{item.selectedSpiceLevel.label}</span>
                                </div>
                              )}
                              {item.selectedAddOns.length > 0 && (
                                <div>
                                  Tambahan: <span className="font-medium text-ink-700">{item.selectedAddOns.map((a) => a.name).join(', ')}</span>
                                </div>
                              )}
                              {item.notes && (
                                <div className="italic text-ink-600">
                                  Catatan: "{item.notes}"
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-ink-400 hover:text-coral-600 p-1 rounded-full"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Stepper & Total */}
                      <div className="flex items-center justify-between pt-2 border-t border-cream-100">
                        <div className="flex items-center gap-1.5 bg-cream-50 rounded-full border border-cream-200 px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-white text-ink-800 flex items-center justify-center bubble-button text-xs font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-ink-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-white text-ink-800 flex items-center justify-center bubble-button text-xs font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-coral-600">
                          {formatRupiah(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Checkout Information Form (PRD 4.3) */}
                <div className="pt-2 border-t border-cream-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-ink-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-scallion-600" />
                      <span>{t('customer_info')}</span>
                    </h3>
                    <span className="text-[11px] text-ink-400">Data untuk nota WhatsApp</span>
                  </div>

                  {formError && (
                    <div className="p-2.5 rounded-lg bg-coral-50 border border-coral-200 text-coral-700 text-xs font-semibold">
                      {formError}
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-800 block">
                      {t('customer_name')} *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.customerName}
                      onChange={(e) => updateCustomerInfo({ customerName: e.target.value })}
                      placeholder={t('customer_name_placeholder')}
                      className="w-full px-3 py-2.5 rounded-bubble bg-cream-50 border border-cream-300 text-ink-900 text-base sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral-400"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-800 block">
                      {t('customer_phone')} *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.customerPhone}
                      onChange={(e) => updateCustomerInfo({ customerPhone: e.target.value })}
                      placeholder={t('customer_phone_placeholder')}
                      className="w-full px-3 py-2.5 rounded-bubble bg-cream-50 border border-cream-300 text-ink-900 text-base sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral-400"
                    />
                  </div>

                  {/* Pickup Method */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-ink-800 block">
                        {t('pickup_type')}
                      </label>
                      <button
                        type="button"
                        onClick={handleRequestGeolocation}
                        disabled={geoLoading}
                        className="inline-flex items-center gap-1 text-[11px] text-coral-600 font-bold hover:underline"
                        title="Deteksi Lokasi Otomatis (PRD 4.3)"
                      >
                        <Compass className="w-3 h-3" />
                        <span>{geoLoading ? 'Mendeteksi...' : 'Isi Lokasi Otomatis'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <label
                        className={`p-2.5 rounded-bubble border-2 flex items-center justify-between cursor-pointer transition-all ${
                          customerInfo.pickupMethod === 'booth_pickup'
                            ? 'border-coral-500 bg-coral-50/50'
                            : 'border-cream-200 bg-white'
                        }`}
                        onClick={() => updateCustomerInfo({ pickupMethod: 'booth_pickup' })}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-coral-500" />
                          <div className="text-xs">
                            <span className="font-bold text-ink-900 block">Ambil di Booth B-14</span>
                            <span className="text-[11px] text-ink-500">Antrean ekspres di booth tanpa antri kasir</span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="pickup"
                          checked={customerInfo.pickupMethod === 'booth_pickup'}
                          onChange={() => {}}
                          className="text-coral-500"
                        />
                      </label>

                      <label
                        className={`p-2.5 rounded-bubble border-2 flex items-center justify-between cursor-pointer transition-all ${
                          customerInfo.pickupMethod === 'dine_in_table'
                            ? 'border-coral-500 bg-coral-50/50'
                            : 'border-cream-200 bg-white'
                        }`}
                        onClick={() => updateCustomerInfo({ pickupMethod: 'dine_in_table' })}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-scallion-600" />
                          <div className="text-xs">
                            <span className="font-bold text-ink-900 block">Antar ke Meja Pameran</span>
                            <span className="text-[11px] text-ink-500">Diantar staf kami ke meja duduk festival</span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="pickup"
                          checked={customerInfo.pickupMethod === 'dine_in_table'}
                          onChange={() => {}}
                          className="text-coral-500"
                        />
                      </label>

                      <label
                        className={`p-2.5 rounded-bubble border-2 flex items-center justify-between cursor-pointer transition-all ${
                          customerInfo.pickupMethod === 'delivery_instant'
                            ? 'border-coral-500 bg-coral-50/50'
                            : 'border-cream-200 bg-white'
                        }`}
                        onClick={() => updateCustomerInfo({ pickupMethod: 'delivery_instant' })}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-ink-600" />
                          <div className="text-xs">
                            <span className="font-bold text-ink-900 block">Titik Temu Ojol / Kirim</span>
                            <span className="text-[11px] text-ink-500">Driver ojol jemput di lobi pameran</span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="pickup"
                          checked={customerInfo.pickupMethod === 'delivery_instant'}
                          onChange={() => {}}
                          className="text-coral-500"
                        />
                      </label>
                    </div>

                    {/* Additional note for table / location */}
                    <div className="pt-1">
                      <input
                        type="text"
                        value={customerInfo.boothNote || ''}
                        onChange={(e) => updateCustomerInfo({ boothNote: e.target.value })}
                        placeholder={
                          customerInfo.pickupMethod === 'dine_in_table'
                            ? 'Nomor Meja Anda (Contoh: Meja 12 samping panggung)'
                            : customerInfo.pickupMethod === 'delivery_instant'
                            ? 'Alamat / Titik temu lobi pameran'
                            : 'Catatan tambahan penjemputan booth'
                        }
                        className="w-full px-3 py-2.5 rounded-bubble bg-cream-50 border border-cream-300 text-ink-900 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-coral-400"
                      />
                      {geoSuccess && (
                        <span className="text-[10px] text-scallion-700 font-bold block mt-1">
                          Lokasi pameran berhasil diverifikasi otomatis
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-800 block">
                      Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {[
                        { id: 'qris_booth', label: 'QRIS Booth' },
                        { id: 'cash_booth', label: 'Tunai Kasir' },
                        { id: 'transfer_bank', label: 'Transfer BCA' },
                      ].map((pay) => (
                        <button
                          key={pay.id}
                          type="button"
                          onClick={() => updateCustomerInfo({ paymentMethod: pay.id as any })}
                          className={`py-2 px-1 rounded-bubble border-2 text-[11px] font-bold transition-all ${
                            customerInfo.paymentMethod === pay.id
                              ? 'border-coral-500 bg-coral-50 text-coral-800'
                              : 'border-cream-200 bg-white text-ink-700 hover:border-cream-300'
                          }`}
                        >
                          {pay.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </>
            )}

          </div>

          {/* Footer Checkout Summary with Mobile Safe Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-cream-200 bg-cream-50 space-y-3 pb-safe sm:pb-5">
              
              {/* Gamification perk reminder */}
              <div className="flex items-center justify-between text-xs text-scallion-700 bg-scallion-50 px-3 py-1.5 rounded-full border border-scallion-200">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Coins className="w-3.5 h-3.5" />
                  +100 Koin Dimsum
                </span>
                <span className="text-[11px]">Diperoleh setelah kirim WA</span>
              </div>

              {/* Price Details */}
              <div className="space-y-1.5 text-xs text-ink-700">
                <div className="flex justify-between">
                  <span>{t('subtotal')} ({totalItemsCount} porsi)</span>
                  <span className="font-bold">{formatRupiah(subtotal)}</span>
                </div>

                {bundlingStatus.discountAmount > 0 && (
                  <div className="flex justify-between text-scallion-700 font-bold">
                    <span>{bundlingStatus.label}</span>
                    <span>-{formatRupiah(bundlingStatus.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-extrabold text-ink-900 pt-2 border-t border-cream-200">
                  <span>{t('total_pay')}</span>
                  <span className="text-coral-600 text-lg font-black">
                    {formatRupiah(totalFinal)}
                  </span>
                </div>
              </div>

              {/* Action Button: Opens WhatsApp Confirmation */}
              <button
                onClick={handleValidateAndProceed}
                className={`w-full py-3.5 px-4 rounded-full text-white font-extrabold text-sm bubble-button shadow-bubbly-coral flex items-center justify-center gap-2 ${
                  isOpen ? 'bg-coral-500 hover:bg-coral-600' : 'bg-scallion-600 hover:bg-scallion-700'
                }`}
              >
                <span>{isOpen ? t('checkout_btn') : t('preorder_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

