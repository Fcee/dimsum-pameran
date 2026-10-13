import { ProductItem, VariantOption, AddOnOption, SpiceLevelOption } from './catalog';

export interface SelectedItemVariant {
  groupId: string;
  groupName: string;
  selectedOption: VariantOption;
}

export interface CartItem {
  cartItemId: string; // unique string including variant fingerprint
  product: ProductItem;
  quantity: number;
  selectedVariants: SelectedItemVariant[];
  selectedSpiceLevel?: SpiceLevelOption;
  selectedAddOns: AddOnOption[];
  notes: string;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerOrderInfo {
  customerName: string;
  customerPhone: string;
  pickupMethod: 'booth_pickup' | 'dine_in_table' | 'delivery_instant';
  boothNote?: string; // e.g. "Meja Pameran No 12" or "Titip di kasir B14"
  deliveryAddress?: string;
  paymentMethod: 'qris_booth' | 'cash_booth' | 'transfer_bank';
}

