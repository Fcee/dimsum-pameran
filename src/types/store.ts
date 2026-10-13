export interface OperatingHours {
  timezone: string;
  open: string;  // e.g. "09:00"
  close: string; // e.g. "22:00"
  daysOpen: string[]; // e.g. ["Senin", "Selasa", ...]
}

export interface WhatsAppRouter {
  id: string;
  name: string;
  phone: string; // international format without + or with 62
  role: string;
  avatarColor: string;
}

export interface BundlingRule {
  minQty: number;
  discountPercent: number;
  label: string;
  description: string;
}

export interface ThemeColors {
  primary: string;   // cute coral
  secondary: string; // steamer cream
  accent: string;    // scallion jade
}

export interface StoreConfig {
  merchantId: string;
  name: string;
  tagline: string;
  boothLocation: string;
  eventName: string;
  city: string;
  operatingHours: OperatingHours;
  whatsappRouters: WhatsAppRouter[];
  bundlingRules: BundlingRule[];
  theme: {
    preset: string;
    colors: ThemeColors;
    fontFamily: string;
  };
  pickupOptions: {
    id: string;
    label: string;
    estimatedTime: string;
    extraFee: number;
    description: string;
  }[];
}

