import React, { useState } from 'react';
import {
  ShoppingBag,
  Coins,
  Settings,
  Globe,
  MapPin,
  Clock,
  Menu,
  X,
  UtensilsCrossed,
  Percent,
  Sparkles,
  ArrowRight,
  Phone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../context/I18nContext';
import { formatRupiah } from '../utils/formatters';

interface NavbarProps {
  onOpenLoyalty: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLoyalty, onOpenSettings }) => {
  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();
  const { config, isOpen, statusText, loyaltyPoints } = useStore();
  const { locale, setLocale, t } = useI18n();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-cream-200/90 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Navbar Bar */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* 1. Brand & Booth Identity */}
          <div
            onClick={() => scrollToSection('top')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
          >
            {/* Cute Steamer Icon with Subtle Steam */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-bubble bg-coral-500 text-white flex items-center justify-center shadow-bubbly-coral relative shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11h18M3 16h18M5 6a7 7 0 0 1 14 0v5H5V6zM4 11v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
              </svg>
              <span className="absolute -top-1 left-2 w-1.5 h-1.5 rounded-full bg-coral-400 steam-anim" />
              <span className="absolute -top-2 left-5 w-2 h-2 rounded-full bg-coral-400 steam-anim-delayed" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-ink-900 leading-none">
                  {config.name}
                </h1>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-coral-100 text-coral-700 border border-coral-200">
                  {config.merchantId}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 text-[11px] text-ink-600 mt-1">
                <span className="inline-flex items-center gap-1 font-semibold text-coral-600">
                  <MapPin className="w-3 h-3" />
                  <span>{config.boothLocation.split('-')[1]?.trim() || config.boothLocation}</span>
                </span>
                <span className="text-cream-400">•</span>
                <span className="inline-flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-scallion-500 animate-pulse' : 'bg-coral-400'}`} />
                  <span className="font-medium text-ink-700 hidden sm:inline">{statusText}</span>
                  <span className="font-medium text-ink-700 sm:hidden">{isOpen ? 'Buka' : 'Pre-Order'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 2. Desktop Navigation Links (Lengkap & Terbuka di Website) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => scrollToSection('top')}
              className="px-3.5 py-2 rounded-full text-sm font-bold text-ink-800 hover:text-coral-600 hover:bg-cream-100 bubble-button transition-colors"
            >
              Beranda
            </button>

            <button
              onClick={() => scrollToSection('menu-catalog')}
              className="px-3.5 py-2 rounded-full text-sm font-bold text-ink-800 hover:text-coral-600 hover:bg-cream-100 bubble-button transition-colors flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4 text-coral-500" />
              <span>Daftar Menu</span>
            </button>

            <button
              onClick={() => scrollToSection('promo-grosir')}
              className="px-3.5 py-2 rounded-full text-sm font-bold text-ink-800 hover:text-coral-600 hover:bg-cream-100 bubble-button transition-colors flex items-center gap-1.5"
            >
              <Percent className="w-4 h-4 text-scallion-600" />
              <span>Promo Grosir</span>
            </button>

            <button
              onClick={() => scrollToSection('booth-info')}
              className="px-3.5 py-2 rounded-full text-sm font-bold text-ink-800 hover:text-coral-600 hover:bg-cream-100 bubble-button transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-coral-500" />
              <span>Lokasi Stan</span>
            </button>
          </nav>

          {/* 3. Desktop Actions & Controls */}
          <div className="hidden md:flex items-center gap-2 xl:gap-3">
            
            {/* Loyalty Points Pill Button */}
            <button
              onClick={onOpenLoyalty}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-ink-800 text-xs sm:text-sm font-bold bubble-button border border-cream-300 shadow-sm"
              title="Koin Hadiah Dimsum"
            >
              <Coins className="w-4 h-4 text-coral-500" />
              <span>{loyaltyPoints} Koin</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-ink-800 text-xs font-bold bubble-button border border-cream-300"
              title="Ganti Bahasa (ID / EN)"
            >
              <Globe className="w-3.5 h-3.5 text-scallion-600" />
              <span className="uppercase">{locale}</span>
            </button>

            {/* Merchant Settings / CMS Drawer */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full bg-cream-100 hover:bg-cream-200 text-ink-700 hover:text-ink-900 bubble-button border border-cream-300"
              title="Pengaturan Jam & Toko UMKM"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-extrabold text-sm bubble-button shadow-bubbly-coral"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{totalItemsCount > 0 ? formatRupiah(subtotal) : 'Keranjang'}</span>
              
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-coral-600 text-xs font-black flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>

          </div>

          {/* 4. Mobile Clean Controls (Tertata Rapi, Tidak Menumpuk) */}
          <div className="flex md:hidden items-center gap-2">
            
            {/* Mobile Quick Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white bubble-button shadow-bubbly-coral"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-coral-600 text-[10px] font-black flex items-center justify-center shadow-sm border border-coral-500">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2.5 rounded-full bg-cream-100 hover:bg-cream-200 text-ink-800 border border-cream-300 bubble-button"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

      </div>

      {/* 5. Mobile Navigation Dropdown Menu (Rapi & Terstruktur) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-200 bg-white/98 shadow-xl animate-fadeIn">
          <div className="px-4 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Booth Identity Card in Mobile Menu */}
            <div className="p-3 rounded-bubble bg-cream-100 border border-cream-300 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-coral-600 uppercase block">{config.eventName}</span>
                <span className="text-sm font-extrabold text-ink-900">{config.boothLocation}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                isOpen ? 'bg-scallion-100 text-scallion-700' : 'bg-coral-100 text-coral-700'
              }`}>
                {statusText}
              </span>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <button
                onClick={() => scrollToSection('top')}
                className="w-full text-left px-3.5 py-2.5 rounded-bubble hover:bg-cream-100 text-sm font-bold text-ink-900 flex items-center justify-between"
              >
                <span>Beranda</span>
                <ArrowRight className="w-4 h-4 text-ink-400" />
              </button>

              <button
                onClick={() => scrollToSection('menu-catalog')}
                className="w-full text-left px-3.5 py-2.5 rounded-bubble hover:bg-cream-100 text-sm font-bold text-ink-900 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <UtensilsCrossed className="w-4 h-4 text-coral-500" />
                  <span>Daftar Menu Dimsum</span>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-400" />
              </button>

              <button
                onClick={() => scrollToSection('promo-grosir')}
                className="w-full text-left px-3.5 py-2.5 rounded-bubble hover:bg-cream-100 text-sm font-bold text-ink-900 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Percent className="w-4 h-4 text-scallion-600" />
                  <span>Promo Grosir Pameran (Hemat 15%)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-400" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoyalty();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-bubble hover:bg-cream-100 text-sm font-bold text-ink-900 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-coral-500" />
                  <span>Koin Hadiah Dimsum</span>
                </div>
                <span className="text-xs bg-coral-100 text-coral-700 font-extrabold px-2 py-0.5 rounded-full">
                  {loyaltyPoints} Koin
                </span>
              </button>

              <button
                onClick={() => scrollToSection('booth-info')}
                className="w-full text-left px-3.5 py-2.5 rounded-bubble hover:bg-cream-100 text-sm font-bold text-ink-900 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-coral-500" />
                  <span>Lokasi Booth & Petunjuk Arah</span>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-400" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-bubble hover:bg-cream-100 text-sm font-bold text-ink-900 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-ink-600" />
                  <span>Pengaturan UMKM (Decap CMS)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-400" />
              </button>
            </div>

            {/* Language Switcher in Mobile Drawer */}
            <div className="pt-2 border-t border-cream-200 flex items-center justify-between">
              <span className="text-xs font-bold text-ink-700 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-scallion-600" />
                <span>Pilihan Bahasa:</span>
              </span>
              <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1 border border-cream-300">
                <button
                  onClick={() => setLocale('id')}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                    locale === 'id' ? 'bg-coral-500 text-white shadow-sm' : 'text-ink-700'
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => setLocale('en')}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                    locale === 'en' ? 'bg-coral-500 text-white shadow-sm' : 'text-ink-700'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Direct Admin WhatsApp Quick Touch */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${config.whatsappRouters[0]?.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-full bg-scallion-600 text-white text-xs font-bold flex items-center justify-center gap-2 bubble-button shadow-bubbly-scallion"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Chat Admin Booth ({config.whatsappRouters[0]?.name})</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
