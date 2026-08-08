export type JerseyCategory = 'Club' | 'National' | 'Retro Collection' | 'Limited Drop' | 'Streetwear Edition';

export type EraTag = '80s Classic' | '90s Era' | '2000s Vintage' | 'Modern Retro';

export interface Jersey {
  id: string;
  name: string;
  clubOrCountry: string;
  season: string;
  category: JerseyCategory;
  price: number;
  originalPrice?: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimitedDrop?: boolean;
  tag?: string; // e.g. "RARE GRAIL", "CHAMPIONS '99", "JADU ICON"
  rating: number;
  reviewsCount: number;
  mainImage: string;
  galleryImages: string[];
  description: string;
  historyDetails: string;
  fabricInfo: string;
  fit: 'Standard Fit' | 'Relaxed Vintage' | 'Slim Athletic';
  availableSizes: ('M' | 'L' | 'XL' | 'XXL')[];
  inStock: boolean;
}

export interface CartItem {
  jersey: Jersey;
  size: 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
}

export interface OrderCheckoutData {
  fullName: string;
  roomNumber: string; // e.g., A102, B215, C307
  telegramHandleOrPhone: string;
  notes?: string;
  deliveryMethod: 'STANDARD' | 'EXPRESS';
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  checkoutInfo: OrderCheckoutData;
  deliveryMethod: 'STANDARD' | 'EXPRESS';
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'DELIVERED';
}
