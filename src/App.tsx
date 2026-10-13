import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import dimsumCatalogData from './data/dimsumCatalog.json';
import { ProductItem, DimsumCategory } from './types/catalog';
import { I18nProvider, useI18n } from './context/I18nContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { OfflineNotice } from './components/OfflineNotice';
import { AbandonedCartBanner } from './components/AbandonedCartBanner';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar, SortOption, SpiceFilterOption } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppModal } from './components/WhatsAppModal';
import { LoyaltyModal } from './components/LoyaltyModal';
import { AdminConfigDrawer } from './components/AdminConfigDrawer';
import { MobileBottomBar } from './components/MobileBottomBar';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Layers,
  Sparkles,
  ArrowUp,
  Heart
} from 'lucide-react';

const catalogItems: ProductItem[] = dimsumCatalogData as ProductItem[];

const MainCatalogApp: React.FC = () => {
  const { t } = useI18n();
  const { config, isOpen } = useStore();
  const { customizingProduct, setCustomizingProduct } = useCart();

  // Modals state
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Filters & Search state
  const [selectedCategory, setSelectedCategory] = useState<DimsumCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [spiceFilter, setSpiceFilter] = useState<SpiceFilterOption>('all');

  // Fuse.js client-side search engine instance (PRD 3 & 4.2)
  const fuse = useMemo(() => {
    return new Fuse(catalogItems, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'shortDesc', weight: 0.25 },
        { name: 'category', weight: 0.15 },
        { name: 'badge', weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = catalogItems;

    // 1. Search Query filter via Fuse.js
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery.trim());
      result = searchResults.map((r) => r.item);
    }

    // 2. Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 3. Spice filter
    if (spiceFilter === 'mild') {
      result = result.filter(
        (item) => !item.spiceLevels || item.spiceLevels.some((s) => s.level === 0)
      );
    } else if (spiceFilter === 'spicy') {
      result = result.filter(
        (item) => item.spiceLevels && item.spiceLevels.some((s) => s.level > 0)
      );
    }

    // 4. Sorting
    const sorted = [...result];
    switch (sortBy) {
      case 'popular':
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.basePrice - a.basePrice);
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategory, spiceFilter, sortBy, fuse]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<DimsumCategory, number> = {
      all: catalogItems.length,
      kukus: 0,
      goreng: 0,
      mentai: 0,
      platter: 0,
      minuman: 0,
    };
    catalogItems.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });
    return counts;
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-bubble text-ink-900 selection:bg-coral-200 selection:text-coral-900 pb-24 md:pb-0">
      
      {/* 1. Offline Notice Banner (PRD 4.1 PWA) */}
      <OfflineNotice />

      {/* 2. Abandoned Cart Recovery (PRD 4.3) */}
      <AbandonedCartBanner />

      {/* 3. Navigation Header */}
      <Navbar
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        onOpenSettings={() => setIsAdminOpen(true)}
      />

      {/* 4. Hero Banner with Expo Booth Identity */}
      <HeroBanner />

      {/* 5. Main Catalog Section */}
      <main id="menu-catalog" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-coral-600 uppercase tracking-widest bg-coral-50 px-2.5 py-0.5 rounded-full border border-coral-200">
                Pilihan Dimsum Booth B-14
              </span>
              <span className="text-xs text-ink-500 font-semibold">
                Tersedia {filteredProducts.length} Pilihan
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mt-1">
              Daftar Menu & Racikan Istimewa
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-ink-600 max-w-md">
            Pilih varian kukus hangat siap santap di festival atau frozen pack praktis untuk stok di rumah.
          </p>
        </div>

        {/* Category Pills Filter */}
        <CategoryFilter
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* Faceted Search & Sort Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          spiceFilter={spiceFilter}
          onSpiceFilterChange={setSpiceFilter}
          totalResults={filteredProducts.length}
        />

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 pt-2">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={(p) => setCustomizingProduct(p)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-bubble-xl border-2 border-cream-200 p-12 text-center space-y-4 max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-cream-100 mx-auto flex items-center justify-center text-coral-500">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-ink-900">Menu Tidak Ditemukan</h3>
              <p className="text-xs text-ink-600 mt-1">
                Tidak ada menu dimsum yang cocok dengan kata kunci atau filter yang Anda pilih.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSpiceFilter('all');
              }}
              className="px-4 py-2 rounded-full bg-coral-500 text-white font-bold text-xs bubble-button shadow-bubbly-coral"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        )}

      </main>

      {/* 6. Footer Section */}
      <footer id="booth-info" className="mt-16 bg-cream-200/80 border-t-2 border-cream-300 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Brand column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-bubble bg-coral-500 text-white flex items-center justify-center shadow-bubbly-coral">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11h18M3 16h18M5 6a7 7 0 0 1 14 0v5H5V6zM4 11v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-ink-900">{config.name}</h3>
                  <p className="text-xs text-ink-600">{config.tagline}</p>
                </div>
              </div>

              <p className="text-xs text-ink-700 leading-relaxed max-w-sm">
                Katalog digital resmi UMKM untuk pameran kuliner. Sistem pemesanan mandiri nir-biaya server berbasis arsitektur Jamstack dengan gerbang WhatsApp.
              </p>
            </div>

            {/* Operational & Booth Info */}
            <div className="md:col-span-4 space-y-2">
              <h4 className="font-bold text-sm text-ink-900 uppercase tracking-wider">
                Lokasi & Jam Booth
              </h4>
              <div className="space-y-1.5 text-xs text-ink-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-coral-600 shrink-0" />
                  <span>{config.boothLocation} ({config.eventName})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-scallion-700 shrink-0" />
                  <span>Setiap Hari: {config.operatingHours.open} - {config.operatingHours.close} WIB</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-scallion-700 shrink-0" />
                  <span>Sertifikasi Higienis & Halal LPPOM</span>
                </div>
              </div>
            </div>

            {/* Admin WhatsApp list */}
            <div className="md:col-span-3 space-y-2">
              <h4 className="font-bold text-sm text-ink-900 uppercase tracking-wider">
                Layanan Pelanggan
              </h4>
              <div className="space-y-1 text-xs text-ink-700">
                {config.whatsappRouters.map((router) => (
                  <div key={router.id} className="flex items-center justify-between py-1 border-b border-cream-300">
                    <span className="font-medium">{router.name} ({router.role})</span>
                    <span className="text-scallion-700 font-bold">+{router.phone}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Back to Top */}
          <div className="pt-6 border-t border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500">
            <div className="flex items-center gap-1.5">
              <span>{config.merchantId} • Dibuat dengan cinta untuk UMKM Kuliner Indonesia</span>
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-ink-800 font-bold hover:bg-coral-50 hover:text-coral-600 border border-cream-300 transition-colors bubble-button"
            >
              <span>Kembali ke Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </footer>

      {/* 7. Product Deep Customization Modal */}
      <ProductModal
        product={customizingProduct}
        onClose={() => setCustomizingProduct(null)}
      />

      {/* 8. Cart Slide-over Drawer */}
      <CartDrawer
        onProceedToWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* 9. Smart WhatsApp Router Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* 10. Gamification Loyalty Points Modal */}
      <LoyaltyModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
      />

      {/* 11. Admin Decap CMS Dynamic Config Drawer */}
      <AdminConfigDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* 12. Mobile Sticky Bottom Action Bar & Navigation Dock */}
      <MobileBottomBar
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        onOpenSettings={() => setIsAdminOpen(true)}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <I18nProvider>
        <CartProvider>
          <MainCatalogApp />
        </CartProvider>
      </I18nProvider>
    </StoreProvider>
  );
};

export default App;

