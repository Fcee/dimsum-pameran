import React from 'react';
import { Sparkles, Percent, ShieldCheck, Flame, Clock, MapPin, ArrowDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../context/I18nContext';

export const HeroBanner: React.FC = () => {
  const { config, isOpen, statusText } = useStore();
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden pt-4 pb-6 sm:pt-6 sm:pb-8 md:pt-10 md:pb-12 bg-gradient-to-b from-cream-100 via-cream-50 to-cream-100">
      
      {/* Decorative cute bubble background elements */}
      <div className="absolute top-4 right-10 w-48 h-48 bg-coral-100/60 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 left-12 w-56 h-56 bg-scallion-100/60 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-coral-200/70 rounded-bubble-lg sm:rounded-bubble-xl p-4 sm:p-8 lg:p-10 shadow-card-soft">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              
              {/* Event Badge */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-600 text-[11px] sm:text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  {config.eventName}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-cream-200 text-ink-700 text-[11px] sm:text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-coral-500" />
                  {config.boothLocation}
                </span>

                <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${
                  isOpen ? 'bg-scallion-100 text-scallion-700' : 'bg-coral-100 text-coral-700'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  {statusText}
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 leading-tight">
                Dimsum Lembut Segar, <br />
                <span className="text-coral-500">Mengepul Hangat</span> dari Kukusan!
              </h2>

              {/* Subtitle */}
              <p className="text-ink-700 text-xs sm:text-base max-w-xl leading-relaxed">
                {config.tagline}. Dibuat harian dari daging ayam dan udang segar berkualitas, dengan cocolan chili oil aromatik dan saus mentai bakar khas booth kami.
              </p>

              {/* Wholesale Bundling Ticker (PRD 4.2) */}
              <div id="promo-grosir" className="pt-2">
                <div className="p-3.5 rounded-bubble bg-cream-100 border border-cream-300 flex flex-wrap items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-scallion-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <span className="text-xs font-bold text-scallion-700 uppercase tracking-wider block">
                      Promo Grosir Pameran:
                    </span>
                    <p className="text-xs sm:text-sm text-ink-800 font-medium">
                      Beli 3 porsi diskon 10% • Beli 5 porsi diskon 15% otomatis di keranjang!
                    </p>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs sm:text-sm text-ink-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-scallion-600" />
                  <span>100% Halal & Tanpa Pengawet</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-coral-500" />
                  <span>Kukus & Goreng Fresh di Booth</span>
                </div>
              </div>

            </div>

            {/* Right Steamer Visual Presentation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                
                {/* Main Card with Warm Steamer Visual */}
                <div className="relative rounded-bubble-xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-cream-100 to-cream-200">
                  <img
                    src="https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=700&q=80"
                    alt="Dimsum Kukus Segar"
                    className="w-full h-44 sm:h-64 object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Floating Highlight Pill */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-bubble p-3 shadow-md border border-cream-300 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-coral-600 block">Siap Saji di Booth B-14</span>
                      <span className="text-sm font-bold text-ink-900">Dimsum Mentai & Siomay Panas</span>
                    </div>
                    <a
                      href="#menu-catalog"
                      className="px-3 py-1.5 rounded-full bg-coral-500 text-white font-bold text-xs inline-flex items-center gap-1 bubble-button"
                    >
                      <span>Lihat Menu</span>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Decorative floating badge */}
                <div className="absolute -top-3 -right-3 bg-coral-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-bubbly-coral border-2 border-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Hangat & Gurih</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

