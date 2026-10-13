import React from 'react';
import { X, Coins, Sparkles, Award, Gift, Check, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../context/I18nContext';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({ isOpen, onClose }) => {
  const { loyaltyPoints, config } = useStore();
  const { t } = useI18n();

  if (!isOpen) return null;

  // Determine loyalty level
  let badgeName = 'Pencinta Dimsum Pemula';
  let badgeLevel = 1;
  let nextGoal = 300;

  if (loyaltyPoints >= 1000) {
    badgeName = 'Sultan Dimsum Pameran';
    badgeLevel = 4;
    nextGoal = 1000;
  } else if (loyaltyPoints >= 500) {
    badgeName = 'Master Hakau & Mentai';
    badgeLevel = 3;
    nextGoal = 1000;
  } else if (loyaltyPoints >= 300) {
    badgeName = 'Sahabat Siomay Spesial';
    badgeLevel = 2;
    nextGoal = 500;
  }

  const perks = [
    {
      title: 'Free Cup Chili Oil (30ml)',
      requiredPoints: 200,
      claimed: loyaltyPoints >= 200,
      desc: 'Tunjukkan koin ini ke kasir booth untuk cocolan gratis.',
    },
    {
      title: 'Diskon Spesial Rp 10.000',
      requiredPoints: 500,
      claimed: loyaltyPoints >= 500,
      desc: 'Kupon potongan langsung untuk pembelian paket platter.',
    },
    {
      title: 'Free 1 Porsi Bakpao Lava',
      requiredPoints: 800,
      claimed: loyaltyPoints >= 800,
      desc: 'Bonus pencuci mulut manis gurih isi telur asin.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative z-10 bg-white w-full max-w-md max-h-[92vh] rounded-t-bubble-xl sm:rounded-bubble-xl shadow-2xl border-t-2 sm:border-2 border-cream-300 flex flex-col overflow-hidden overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-cream-400 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />
        {/* Header (Always anchored on top) */}
        <div className="p-4 sm:p-5 border-b border-cream-200 bg-cream-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-coral-500" />
            <h3 className="font-bold text-lg text-ink-900">{t('loyalty_title')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-cream-200 hover:bg-cream-300 text-ink-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 overscroll-contain">
          
          {/* Card Summary */}
          <div className="rounded-bubble-lg bg-gradient-to-br from-coral-500 to-coral-600 p-5 text-white shadow-bubbly-coral relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-20">
              <Coins className="w-24 h-24" />
            </div>

            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-extrabold text-coral-100">
                  {config.name} Loyalty
                </span>
                <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold">
                  Level {badgeLevel}
                </span>
              </div>

              <div>
                <span className="text-xs text-coral-100 block">Koin Aktif Anda:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{loyaltyPoints}</span>
                  <span className="text-sm font-bold text-coral-200">Koin</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/20 flex items-center gap-2 text-xs font-semibold text-coral-50">
                <Award className="w-4 h-4 shrink-0 text-coral-200" />
                <span>Pangkat: {badgeName}</span>
              </div>
            </div>
          </div>

          {/* How to Earn */}
          <div className="p-3.5 rounded-bubble bg-cream-100 border border-cream-300 space-y-1">
            <span className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>Cara Mendapatkan Koin:</span>
            </span>
            <p className="text-xs text-ink-700 leading-relaxed">
              {t('loyalty_desc')}
            </p>
          </div>

          {/* Perks list */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-ink-900 block">
              Daftar Hadiah Penukaran Booth:
            </span>

            <div className="space-y-2">
              {perks.map((perk, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-bubble border-2 flex items-center justify-between text-xs ${
                    perk.claimed
                      ? 'border-scallion-500 bg-scallion-50/50'
                      : 'border-cream-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        perk.claimed
                          ? 'bg-scallion-500 text-white'
                          : 'bg-cream-200 text-ink-400'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-ink-900 block">{perk.title}</span>
                      <span className="text-[11px] text-ink-500">{perk.desc}</span>
                    </div>
                  </div>

                  <span
                    className={`font-black px-2 py-0.5 rounded-full shrink-0 ${
                      perk.claimed
                        ? 'bg-scallion-100 text-scallion-800'
                        : 'bg-cream-200 text-ink-600'
                    }`}
                  >
                    {perk.requiredPoints} Koin
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Footer with Mobile Safe Area (Always visible & clickable) */}
        <div className="p-4 border-t border-cream-200 bg-cream-50 text-center pb-safe sm:pb-4 shrink-0 relative z-20 shadow-md">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-extrabold text-sm bubble-button shadow-bubbly-coral cursor-pointer min-h-[44px]"
          >
            Tutup & Kembali ke Katalog
          </button>
        </div>
      </div>
    </div>
  );
};

