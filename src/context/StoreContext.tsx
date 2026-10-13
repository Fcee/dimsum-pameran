import React, { createContext, useContext, useState, useEffect } from 'react';
import initialConfig from '../data/storeConfig.json';
import { StoreConfig, WhatsAppRouter } from '../types/store';
import { checkStoreOpen } from '../utils/formatters';

interface StoreContextType {
  config: StoreConfig;
  updateConfig: (newConfig: Partial<StoreConfig>) => void;
  resetConfig: () => void;
  isOpen: boolean;
  statusText: string;
  simulatedStatus: 'auto' | 'open' | 'closed';
  setSimulatedStatus: (status: 'auto' | 'open' | 'closed') => void;
  selectedRouter: WhatsAppRouter;
  setSelectedRouter: (router: WhatsAppRouter) => void;
  rotateRouter: () => WhatsAppRouter;
  loyaltyPoints: number;
  addLoyaltyPoints: (points: number) => void;
  isOnline: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('dimsum_store_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically sync whatsappRouters if old default routers were saved
        if (
          !parsed.whatsappRouters ||
          parsed.whatsappRouters[0]?.phone === '6281288991122' ||
          parsed.whatsappRouters[0]?.name === 'Kak Maya'
        ) {
          parsed.whatsappRouters = (initialConfig as StoreConfig).whatsappRouters;
          localStorage.setItem('dimsum_store_config', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved config', e);
      }
    }
    return initialConfig as StoreConfig;
  });

  const [simulatedStatus, setSimulatedStatus] = useState<'auto' | 'open' | 'closed'>('auto');
  const [routerIndex, setRouterIndex] = useState<number>(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    const saved = localStorage.getItem('dimsum_loyalty_points');
    return saved ? parseInt(saved, 10) : 150; // starts with welcome gift 150 points
  });

  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { isOpen, statusText } = checkStoreOpen(
    config.operatingHours.open,
    config.operatingHours.close,
    simulatedStatus
  );

  const selectedRouter =
    config.whatsappRouters[routerIndex] || config.whatsappRouters[0];

  const setSelectedRouter = (router: WhatsAppRouter) => {
    const idx = config.whatsappRouters.findIndex((r) => r.id === router.id);
    if (idx !== -1) setRouterIndex(idx);
  };

  // Round-robin router implementation as required in PRD 4.3
  const rotateRouter = (): WhatsAppRouter => {
    const nextIdx = (routerIndex + 1) % config.whatsappRouters.length;
    setRouterIndex(nextIdx);
    return config.whatsappRouters[nextIdx];
  };

  const updateConfig = (newConfig: Partial<StoreConfig>) => {
    setConfig((prev) => {
      const merged = { ...prev, ...newConfig };
      localStorage.setItem('dimsum_store_config', JSON.stringify(merged));
      return merged;
    });
  };

  const resetConfig = () => {
    localStorage.removeItem('dimsum_store_config');
    setConfig(initialConfig as StoreConfig);
  };

  const addLoyaltyPoints = (points: number) => {
    setLoyaltyPoints((prev) => {
      const updated = prev + points;
      localStorage.setItem('dimsum_loyalty_points', updated.toString());
      return updated;
    });
  };

  return (
    <StoreContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        isOpen,
        statusText,
        simulatedStatus,
        setSimulatedStatus,
        selectedRouter,
        setSelectedRouter,
        rotateRouter,
        loyaltyPoints,
        addLoyaltyPoints,
        isOnline,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

