import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Send,
  Copy,
  Check,
  Coins,
  Sparkles,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../context/I18nContext';
import {
  generateOrderId,
  buildWhatsAppMessage,
  createWhatsAppUrl,
  formatRupiah
} from '../utils/formatters';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose }) => {
  const { items, subtotal, bundlingStatus, totalFinal, customerInfo, clearCart } = useCart();
  const { config, selectedRouter, setSelectedRouter, rotateRouter, addLoyaltyPoints, isOpen: isStoreOpen } = useStore();
  const { t } = useI18n();

  const [copied, setCopied] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  // Generate a persistent order ID for this session
  const orderId = useMemo(() => generateOrderId(), [isOpen]);

  if (!isOpen) return null;

  const waMessage = buildWhatsAppMessage({
    orderId,
    cartItems: items,
    customerInfo,
    subtotal,
    discountAmount: bundlingStatus.discountAmount,
    discountLabel: bundlingStatus.label,
    totalAmount: totalFinal,
    storeConfig: config,
    isPreorder: !isStoreOpen,
  });

  const targetWhatsAppUrl = createWhatsAppUrl(selectedRouter.phone, waMessage);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(waMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleOpenWhatsApp = () => {
    // Fire cute celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF6B6B', '#2E8B57', '#FDBA74'],
      });
    } catch (e) {
      // ignore
    }

    // Add loyalty points (+100 points) as specified in PRD 4.1
    addLoyaltyPoints(100);

    // Rotate router for next order (round-robin multi-admin)
    rotateRouter();

    setOrderSent(true);

    // Open WhatsApp
    window.open(targetWhatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCompleteOrder = () => {
    clearCart();
    setOrderSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative z-10 bg-white w-full max-w-lg max-h-[92vh] rounded-t-bubble-xl sm:rounded-bubble-xl shadow-2xl border-t-2 sm:border-2 border-cream-300 flex flex-col overflow-hidden overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-cream-400 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cream-200 bg-cream-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-scallion-500 text-white flex items-center justify-center shadow-bubbly-scallion">
              <Send className="w-5 h-5 ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-ink-900">Konfirmasi Pesanan WhatsApp</h3>
                <span className="text-xs bg-coral-100 text-coral-700 px-2 py-0.5 rounded-full font-bold">
                  #{orderId}
                </span>
              </div>
              <p className="text-xs text-ink-500">
                Penyelesaian pesanan tanpa biaya admin pembayaran (Zero Fees)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-cream-200 hover:bg-cream-300 text-ink-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Admin WhatsApp Router Selection (PRD 4.3 Multi-Admin Routing) */}
          <div className="p-3.5 rounded-bubble bg-cream-100 border border-cream-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-coral-500" />
                <span>Router Admin WhatsApp (Smart Round-Robin):</span>
              </span>
              <span className="text-[10px] bg-white text-ink-600 px-2 py-0.5 rounded-full font-semibold border border-cream-300">
                Otomatis
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {config.whatsappRouters.map((router) => {
                const isSelected = selectedRouter.id === router.id;
                return (
                  <button
                    key={router.id}
                    type="button"
                    onClick={() => setSelectedRouter(router)}
                    className={`p-2.5 rounded-bubble border-2 text-left transition-all ${
                      isSelected
                        ? 'border-scallion-500 bg-white shadow-sm'
                        : 'border-cream-300 bg-cream-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-900">{router.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-scallion-600" />}
                    </div>
                    <span className="text-[11px] text-ink-500 block">{router.role}</span>
                    <span className="text-[10px] text-scallion-700 font-bold block mt-0.5">
                      +{router.phone}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gamification Points Highlight */}
          <div className="flex items-center justify-between p-3 rounded-bubble bg-coral-50 border border-coral-200 text-xs">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-coral-600" />
              <div>
                <span className="font-bold text-coral-800 block">Bonus +100 Koin Dimsum</span>
                <span className="text-[11px] text-coral-700">Tersimpan otomatis di browser Anda setelah kirim</span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-coral-400" />
          </div>

          {/* Message Text Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ink-800">
                Pratinjau Format Pesanan (Tanpa Emoji)
              </label>
              <button
                onClick={handleCopyText}
                className="inline-flex items-center gap-1 text-xs text-coral-600 font-bold hover:underline"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-scallion-600" />
                    <span className="text-scallion-600">Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks Nota</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3.5 rounded-bubble bg-ink-900 text-cream-100 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-48 border border-ink-800 select-all whitespace-pre-wrap">
              {waMessage}
            </pre>
          </div>

          {/* Summary Box */}
          <div className="p-3.5 rounded-bubble bg-cream-50 border border-cream-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-ink-500 block">Total Tagihan Final:</span>
              <span className="text-base font-extrabold text-coral-600">{formatRupiah(totalFinal)}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-ink-500 block">Atas Nama:</span>
              <span className="text-xs font-bold text-ink-900">{customerInfo.customerName}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions with Mobile Safe Padding */}
        <div className="p-4 sm:p-5 border-t border-cream-200 bg-cream-50 space-y-2 pb-safe sm:pb-5">
          {!orderSent ? (
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3.5 px-4 rounded-full bg-scallion-600 hover:bg-scallion-700 text-white font-extrabold text-sm bubble-button shadow-bubbly-scallion flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 ml-0.5" />
              <span>Buka WhatsApp & Kirim ke {selectedRouter.name}</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="p-3 rounded-bubble bg-scallion-100 border border-scallion-300 text-scallion-800 text-xs font-bold text-center">
                WhatsApp sedang dibuka di tab baru! Pesanan Anda telah tercatat dengan ID #{orderId}.
              </div>
              <button
                onClick={handleCompleteOrder}
                className="w-full py-3 px-4 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs bubble-button shadow-bubbly-coral flex items-center justify-center gap-1.5"
              >
                <span>Selesaikan & Bersihkan Keranjang</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-scallion-600" />
            <span>Format pesan dibuat standar tanpa emoji sesuai sistem kasir pameran.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

