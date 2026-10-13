import { CartItem, CustomerOrderInfo } from '../types/cart';
import { StoreConfig } from '../types/store';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateOrderId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ORD-${code}`;
};

export const checkStoreOpen = (
  openStr: string,
  closeStr: string,
  forceStatus?: 'auto' | 'open' | 'closed'
): { isOpen: boolean; statusText: string } => {
  if (forceStatus === 'open') {
    return { isOpen: true, statusText: 'Buka Sekarang (Mode Simulasi)' };
  }
  if (forceStatus === 'closed') {
    return { isOpen: false, statusText: 'Tutup (Pre-Order Aktif)' };
  }

  const now = new Date();
  const [openHour, openMin] = openStr.split(':').map(Number);
  const [closeHour, closeMin] = closeStr.split(':').map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
    return {
      isOpen: true,
      statusText: `Buka (${openStr} - ${closeStr} WIB)`,
    };
  } else {
    return {
      isOpen: false,
      statusText: `Tutup (Buka kembali pukul ${openStr} WIB)`,
    };
  }
};

export interface WhatsAppMessagePayload {
  orderId: string;
  cartItems: CartItem[];
  customerInfo: CustomerOrderInfo;
  subtotal: number;
  discountAmount: number;
  discountLabel?: string;
  totalAmount: number;
  storeConfig: StoreConfig;
  isPreorder: boolean;
}

export const buildWhatsAppMessage = (payload: WhatsAppMessagePayload): string => {
  const {
    orderId,
    cartItems,
    customerInfo,
    subtotal,
    discountAmount,
    discountLabel,
    totalAmount,
    storeConfig,
    isPreorder,
  } = payload;

  const orderTypeTitle = isPreorder
    ? '[PRE-ORDER UNTUK BESOK]'
    : '[PESANAN LANGSUNG BOOTH]';

  const pickupLabel =
    customerInfo.pickupMethod === 'booth_pickup'
      ? 'Ambil Langsung di Booth B-14'
      : customerInfo.pickupMethod === 'dine_in_table'
      ? `Antar ke Meja: ${customerInfo.boothNote || 'Belum diisi'}`
      : `Ojek Online / Alamat: ${customerInfo.deliveryAddress || 'Belum diisi'}`;

  const paymentLabel =
    customerInfo.paymentMethod === 'qris_booth'
      ? 'QRIS di Booth (Statik / Dinamis)'
      : customerInfo.paymentMethod === 'cash_booth'
      ? 'Tunai / Cash di Kasir'
      : 'Transfer Bank BCA / Mandiri';

  let itemsList = '';
  cartItems.forEach((item, index) => {
    itemsList += `${index + 1}. ${item.product.title} x ${item.quantity} porsi\n`;
    if (item.selectedVariants.length > 0) {
      item.selectedVariants.forEach((v) => {
        itemsList += `   * ${v.groupName}: ${v.selectedOption.name}\n`;
      });
    }
    if (item.selectedSpiceLevel) {
      itemsList += `   * Level Pedas: ${item.selectedSpiceLevel.label}\n`;
    }
    if (item.selectedAddOns.length > 0) {
      const addons = item.selectedAddOns.map((a) => a.name).join(', ');
      itemsList += `   * Tambahan: ${addons}\n`;
    }
    if (item.notes.trim()) {
      itemsList += `   * Catatan: "${item.notes.trim()}"\n`;
    }
    itemsList += `   * Subtotal Item: ${formatRupiah(item.totalPrice)}\n\n`;
  });

  const lines = [
    `================================`,
    `PESANAN KATALOG DIMSUM TITIK TEMU`,
    `================================`,
    `Kode Pesanan: #${orderId}`,
    `Status: ${orderTypeTitle}`,
    `Merchant: ${storeConfig.name}`,
    `Lokasi: ${storeConfig.boothLocation}`,
    `Waktu Pesan: ${new Date().toLocaleString('id-ID')}`,
    ``,
    `--- DATA PEMESAN ---`,
    `Nama: ${customerInfo.customerName}`,
    `WhatsApp: ${customerInfo.customerPhone}`,
    `Metode Ambil: ${pickupLabel}`,
    `Metode Bayar: ${paymentLabel}`,
    ``,
    `--- RINCIAN ITEM ---`,
    itemsList.trim(),
    ``,
    `--- RINGKASAN PEMBAYARAN ---`,
    `Subtotal: ${formatRupiah(subtotal)}`,
  ];

  if (discountAmount > 0) {
    lines.push(`Diskon Bundling: -${formatRupiah(discountAmount)} (${discountLabel || 'Promo'})`);
  }

  lines.push(
    `TOTAL TAGIHAN: ${formatRupiah(totalAmount)}`,
    ``,
    `================================`,
    `Mohon konfirmasi ketersediaan dan estimasi waktu penyajian pesanan ini. Terima kasih!`
  );

  return lines.join('\n');
};

export const createWhatsAppUrl = (phone: string, text: string): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

