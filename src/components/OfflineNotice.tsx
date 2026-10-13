import React from 'react';
import { WifiOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../context/I18nContext';

export const OfflineNotice: React.FC = () => {
  const { isOnline } = useStore();
  const { t } = useI18n();

  if (isOnline) return null;

  return (
    <div className="bg-coral-500 text-white px-4 py-2.5 shadow-md flex items-center justify-center gap-2 text-sm font-medium sticky top-0 z-50">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>{t('offline_notice')}</span>
    </div>
  );
};

