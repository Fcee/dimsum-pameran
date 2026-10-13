import React, { useState } from 'react';
import {
  X,
  Settings,
  Clock,
  Save,
  RefreshCw,
  Download,
  Phone,
  Store,
  Palette,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../context/I18nContext';

interface AdminConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminConfigDrawer: React.FC<AdminConfigDrawerProps> = ({ isOpen, onClose }) => {
  const { config, updateConfig, resetConfig, simulatedStatus, setSimulatedStatus } = useStore();
  const { t } = useI18n();

  const [name, setName] = useState(config.name);
  const [tagline, setTagline] = useState(config.tagline);
  const [boothLocation, setBoothLocation] = useState(config.boothLocation);
  const [eventName, setEventName] = useState(config.eventName);
  const [openTime, setOpenTime] = useState(config.operatingHours.open);
  const [closeTime, setCloseTime] = useState(config.operatingHours.close);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updateConfig({
      name,
      tagline,
      boothLocation,
      eventName,
      operatingHours: {
        ...config.operatingHours,
        open: openTime,
        close: closeTime,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'storeConfig.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-cream-200 bg-cream-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-ink-900 text-white flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-ink-900">{t('admin_config_title')}</h3>
                <p className="text-xs text-ink-500">Konfigurasi Jamstack JSON (PRD 3 & 4.1)</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-cream-200 hover:bg-cream-300 text-ink-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            
            {savedSuccess && (
              <div className="p-3 rounded-bubble bg-scallion-100 border border-scallion-300 text-scallion-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-scallion-700" />
                <span>Pengaturan berhasil disimpan ke penyimpanan lokal!</span>
              </div>
            )}

            {/* Smart Availability Simulator (PRD 4.2) */}
            <div className="p-3.5 rounded-bubble bg-coral-50 border border-coral-200 space-y-2">
              <label className="text-xs font-bold text-coral-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-coral-600" />
                <span>Uji Ketersediaan Booth (Smart Availability):</span>
              </label>
              <p className="text-[11px] text-coral-700 leading-relaxed">
                Ubah status untuk menguji bagaimana katalog beralih otomatis ke mode Pre-Order saat booth tutup.
              </p>

              <div className="grid grid-cols-3 gap-1.5 pt-1 text-xs">
                {[
                  { id: 'auto', label: 'Otomatis' },
                  { id: 'open', label: 'Paksa Buka' },
                  { id: 'closed', label: 'Paksa Tutup' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSimulatedStatus(mode.id as any)}
                    className={`py-1.5 px-2 rounded-full border text-xs font-bold transition-all ${
                      simulatedStatus === mode.id
                        ? 'bg-coral-500 border-coral-600 text-white shadow-sm'
                        : 'bg-white border-coral-200 text-coral-800 hover:bg-coral-100'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* General Merchant Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4 text-coral-500" />
                <span>Identitas Toko & Pameran</span>
              </h4>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink-700 block">Nama UMKM</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-bubble bg-cream-50 border border-cream-300 text-ink-900 text-xs font-medium focus:ring-2 focus:ring-coral-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink-700 block">Tagline Slogan</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-bubble bg-cream-50 border border-cream-300 text-ink-900 text-xs font-medium focus:ring-2 focus:ring-coral-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink-700 block">Lokasi Booth Pameran</label>
                <input
                  type="text"
                  value={boothLocation}
                  onChange={(e) => setBoothLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-bubble bg-cream-50 border border-cream-300 text-ink-900 text-xs font-medium focus:ring-2 focus:ring-coral-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink-700 block">Nama Event Pameran</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3 py-2 rounded-bubble bg-cream-50 border border-cream-300 text-ink-900 text-xs font-medium focus:ring-2 focus:ring-coral-400"
                />
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-3 pt-2 border-t border-cream-200">
              <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-coral-500" />
                <span>Jam Buka & Tutup Booth</span>
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink-700 block">Jam Buka</label>
                  <input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-bubble bg-cream-50 border border-cream-300 text-ink-900 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink-700 block">Jam Tutup</label>
                  <input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-bubble bg-cream-50 border border-cream-300 text-ink-900 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Theme 3 Colors Palette Info */}
            <div className="space-y-2 pt-2 border-t border-cream-200">
              <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-coral-500" />
                <span>Palet 3 Warna Lucu (Fixed Base UI)</span>
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-bubble bg-coral-50 border border-coral-200">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B6B] mx-auto mb-1 border" />
                  <span className="font-bold text-coral-800 block">Coral Dimsum</span>
                  <span className="text-[10px] text-ink-400">#FF6B6B</span>
                </div>
                <div className="p-2 rounded-bubble bg-cream-50 border border-cream-200">
                  <div className="w-6 h-6 rounded-full bg-[#FFF9F0] mx-auto mb-1 border" />
                  <span className="font-bold text-ink-800 block">Cream Bambu</span>
                  <span className="text-[10px] text-ink-400">#FFF9F0</span>
                </div>
                <div className="p-2 rounded-bubble bg-scallion-50 border border-scallion-200">
                  <div className="w-6 h-6 rounded-full bg-[#2E8B57] mx-auto mb-1 border" />
                  <span className="font-bold text-scallion-800 block">Scallion Hijau</span>
                  <span className="text-[10px] text-ink-400">#2E8B57</span>
                </div>
              </div>
            </div>

            {/* Export & Reset Actions */}
            <div className="space-y-2 pt-2 border-t border-cream-200">
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full py-2.5 px-3 rounded-full bg-cream-200 hover:bg-cream-300 text-ink-800 text-xs font-bold flex items-center justify-center gap-1.5 bubble-button border border-cream-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File storeConfig.json (Decap CMS)</span>
              </button>

              <button
                type="button"
                onClick={resetConfig}
                className="w-full py-2 px-3 rounded-full text-ink-500 hover:text-coral-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Kembalikan ke Setelan Awal</span>
              </button>
            </div>

          </div>

          {/* Footer Save with Mobile Safe Padding */}
          <div className="p-4 sm:p-5 border-t border-cream-200 bg-cream-50 pb-safe sm:pb-5">
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 rounded-full bg-coral-500 hover:bg-coral-600 text-white font-extrabold text-sm bubble-button shadow-bubbly-coral flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Toko</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

