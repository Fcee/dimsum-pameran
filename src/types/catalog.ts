export type DimsumCategory = 'all' | 'kukus' | 'goreng' | 'mentai' | 'platter' | 'minuman';

export interface VariantOption {
  id: string;
  name: string;
  priceAdd: number;
  description?: string;
}

export interface VariantGroup {
  id: string;
  groupName: string;
  required: boolean;
  options: VariantOption[];
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
  recommended?: boolean;
}

export interface SpiceLevelOption {
  level: number;
  label: string;
  desc: string;
}

export interface ProductItem {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  category: DimsumCategory;
  basePrice: number;
  pieceCount: number; // e.g. 4 pcs
  image: string;
  stockStatus: 'in_stock' | 'limited' | 'sold_out' | 'preorder';
  badge?: string;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isChefSpecial?: boolean;
  prepTimeMinutes: number;
  variantGroups?: VariantGroup[];
  spiceLevels?: SpiceLevelOption[];
  addOns?: AddOnOption[];
}

