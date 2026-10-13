import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CustomerOrderInfo } from '../types/cart';
import { ProductItem } from '../types/catalog';
import { useStore } from './StoreContext';

interface BundlingStatus {
  discountPercent: number;
  discountAmount: number;
  label: string;
  nextTierMessage: string | null;
  portionsNeededForNext: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  bundlingStatus: BundlingStatus;
  totalFinal: number;
  customerInfo: CustomerOrderInfo;
  updateCustomerInfo: (patch: Partial<CustomerOrderInfo>) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  customizingProduct: ProductItem | null;
  setCustomizingProduct: (p: ProductItem | null) => void;
  hasAbandonedCart: boolean;
  dismissAbandonedCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useStore();

  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dimsum_cart_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart items', e);
      }
    }
    return [];
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerOrderInfo>(() => {
    const saved = localStorage.getItem('dimsum_customer_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse customer info', e);
      }
    }
    return {
      customerName: '',
      customerPhone: '',
      pickupMethod: 'booth_pickup',
      boothNote: '',
      paymentMethod: 'qris_booth',
    };
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<ProductItem | null>(null);
  const [hasAbandonedCart, setHasAbandonedCart] = useState<boolean>(() => {
    const saved = localStorage.getItem('dimsum_cart_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('dimsum_cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('dimsum_customer_info', JSON.stringify(customerInfo));
  }, [customerInfo]);

  const dismissAbandonedCart = () => {
    setHasAbandonedCart(false);
  };

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      // Check if identical item already in cart (same product + identical variant fingerprint)
      const existingIndex = prev.findIndex((i) => i.cartItemId === newItem.cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const current = updated[existingIndex];
        const newQty = current.quantity + newItem.quantity;
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: current.unitPrice * newQty,
        };
        return updated;
      }
      return [...prev, newItem];
    });
    setHasAbandonedCart(false);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setHasAbandonedCart(false);
    localStorage.removeItem('dimsum_cart_items');
  };

  const updateCustomerInfo = (patch: Partial<CustomerOrderInfo>) => {
    setCustomerInfo((prev) => ({ ...prev, ...patch }));
  };

  // Calculations
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Dynamic bundling logic (PRD 4.2)
  const calculateBundling = (): BundlingStatus => {
    if (totalItemsCount === 0) {
      return {
        discountPercent: 0,
        discountAmount: 0,
        label: '',
        nextTierMessage: null,
        portionsNeededForNext: 3,
      };
    }

    // Sort rules descending by minQty
    const sortedRules = [...(config.bundlingRules || [])].sort((a, b) => b.minQty - a.minQty);
    const matchedRule = sortedRules.find((rule) => totalItemsCount >= rule.minQty);

    let discountPercent = matchedRule ? matchedRule.discountPercent : 0;
    let label = matchedRule ? matchedRule.label : '';
    let discountAmount = Math.round(subtotal * (discountPercent / 100));

    let nextTierMessage: string | null = null;
    let portionsNeededForNext = 0;

    if (!matchedRule) {
      const firstRule = sortedRules[sortedRules.length - 1];
      if (firstRule) {
        portionsNeededForNext = firstRule.minQty - totalItemsCount;
        nextTierMessage = `Tambah ${portionsNeededForNext} porsi lagi untuk diskon ${firstRule.discountPercent}% (${firstRule.label})!`;
      }
    } else if (matchedRule.minQty === 3) {
      const highestRule = sortedRules[0];
      if (highestRule && totalItemsCount < highestRule.minQty) {
        portionsNeededForNext = highestRule.minQty - totalItemsCount;
        nextTierMessage = `Tambah ${portionsNeededForNext} porsi lagi untuk upgrade ke diskon ${highestRule.discountPercent}%!`;
      }
    }

    return {
      discountPercent,
      discountAmount,
      label,
      nextTierMessage,
      portionsNeededForNext,
    };
  };

  const bundlingStatus = calculateBundling();
  const totalFinal = Math.max(0, subtotal - bundlingStatus.discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItemsCount,
        subtotal,
        bundlingStatus,
        totalFinal,
        customerInfo,
        updateCustomerInfo,
        isCartOpen,
        setIsCartOpen,
        customizingProduct,
        setCustomizingProduct,
        hasAbandonedCart,
        dismissAbandonedCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

