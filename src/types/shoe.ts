export type GenderCategory = 'men' | 'women' | 'unisex';

export type ShoeCategory =
  | 'High-Sole Sneakers'
  | 'Chunky Sneakers'
  | 'Platform Sneakers'
  | 'Casual Shoes'
  | 'Streetwear Sneakers'
  | 'Running-Inspired Shoes'
  | 'Fashion Sneakers'
  | 'Limited Edition';

export interface ColorOption {
  name: string;
  hex: string;
  accentHex?: string;
  shoeImage: string;
  modelImage: string;
  preset3dId: 'cobalt' | 'violet' | 'terracotta' | 'emerald' | 'crimson' | 'ochre';
}

export interface SizeStock {
  us: number;
  eu: number;
  uk: number;
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  roleOrCity: string;
  avatarInitials: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  shoePurchased: string;
  fitFeedback: 'True to Size' | 'Runs Slightly Large' | 'Snug Architecture';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  gender: GenderCategory;
  category: ShoeCategory;
  price: number;
  discountPrice?: number;
  soleHeightMm: number;
  weightGrams: number;
  description: string;
  editorialTagline: string;
  materials: string[];
  shippingInfo: string;
  returnInfo: string;
  /**
   * [0] = Studio Front/Angle Shoe Image
   * [1] = Fashion Model Wearing THIS Exact Shoe
   * [2] = Studio Side Profile of THIS Exact Shoe
   * [3] = Macro Sole & Material Detail of THIS Exact Shoe
   */
  images: string[];
  modelImage: string;
  modelName: string;
  modelHeightAndSize: string;
  modelAnimationStyle: 'walking' | 'running' | 'turning' | 'jumping' | 'streetwear';
  preset3dId: 'cobalt' | 'violet' | 'terracotta' | 'emerald' | 'crimson' | 'ochre';
  video: {
    caption: string;
    specsHighlight: string;
    accentColor: string;
  };
  colors: ColorOption[];
  sizes: SizeStock[];
  rating: number;
  reviewsCount: number;
  reviews: ProductReview[];
  isTrending: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isLimited?: boolean;
  stock: number;
}

export interface CartItem {
  productId: string;
  selectedColor: string;
  selectedSizeUs: number;
  quantity: number;
  addedAt: number;
}

export interface UserPreferences {
  sizeSystem: 'US' | 'EU' | 'UK';
  preferredGender: 'all' | 'men' | 'women';
  reducedMotionOverride: boolean;
  promoCodeApplied?: string;
  newsletterSubscribed?: boolean;
  subscriberEmail?: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  avatarInitials: string;
  preferredGender: 'all' | 'men' | 'women';
  defaultSizeUs: number;
  memberSince: string;
  altitudePoints: number;
  vipTier: 'Collector' | 'Atelier VIP' | 'Founder Circle';
}

export interface FilterState {
  gender: 'all' | 'men' | 'women' | 'unisex';
  category: string;
  searchQuery: string;
  priceRange: [number, number];
  selectedSizeUs: number | null;
  selectedColor: string | null;
  minRating: number | null;
  badgeFilter: 'all' | 'trending' | 'new' | 'bestseller' | 'limited';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'sole-height';
}

export interface OrderReceipt {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: 'Card' | 'Apple Pay' | 'Cash on Delivery';
  items: {
    product: Product;
    quantity: number;
    selectedColor: string;
    selectedSizeUs: number;
  }[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
}

export type ActivePage =
  | { view: 'home' }
  | {
      view: 'shop';
      presetGender?: 'all' | 'men' | 'women' | 'unisex';
      presetCategory?: string;
      presetBadge?: FilterState['badgeFilter'];
    }
  | { view: 'men' }
  | { view: 'women' }
  | { view: 'product'; slug: string }
  | { view: 'about' };
