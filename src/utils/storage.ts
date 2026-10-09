import {
  CartItem,
  OrderReceipt,
  ProductReview,
  UserAccount,
  UserPreferences,
} from '../types/shoe';

const STORAGE_KEYS = {
  CART: 'altura_cart_v1',
  WISHLIST: 'altura_wishlist_v1',
  RECENTLY_VIEWED: 'altura_recently_viewed_v1',
  PREFERENCES: 'altura_preferences_v1',
  RECENT_SEARCHES: 'altura_recent_searches_v1',
  CUSTOM_REVIEWS: 'altura_custom_reviews_v1',
  AUTH_USER: 'altura_auth_user_v1',
  REGISTERED_USERS: 'altura_registered_users_v1',
  ORDER_HISTORY: 'altura_order_history_v1',
} as const;

export interface StoredUserRecord extends UserAccount {
  passwordHash: string;
}

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export function getStorageItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota or private browsing storage errors safely
  }
}

// Cart helpers
export function loadCart(): CartItem[] {
  return getStorageItem<CartItem[]>(STORAGE_KEYS.CART, []);
}

export function saveCart(items: CartItem[]): void {
  setStorageItem(STORAGE_KEYS.CART, items);
}

// Wishlist helpers
export function loadWishlist(): string[] {
  return getStorageItem<string[]>(STORAGE_KEYS.WISHLIST, ['alt-001', 'alt-002']);
}

export function saveWishlist(ids: string[]): void {
  setStorageItem(STORAGE_KEYS.WISHLIST, ids);
}

// Recently viewed helpers (keeps latest 6-8 unique products, newest first)
export function loadRecentlyViewed(): string[] {
  return getStorageItem<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, [
    'alt-001',
    'alt-002',
    'alt-005',
    'alt-003',
  ]);
}

export function addRecentlyViewed(productId: string): string[] {
  const current = loadRecentlyViewed();
  const updated = [
    productId,
    ...current.filter((id) => id !== productId),
  ].slice(0, 8);
  setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, updated);
  return updated;
}

// Preferences helpers
const DEFAULT_PREFERENCES: UserPreferences = {
  sizeSystem: 'US',
  preferredGender: 'all',
  reducedMotionOverride: false,
  newsletterSubscribed: false,
};

export function loadPreferences(): UserPreferences {
  return {
    ...DEFAULT_PREFERENCES,
    ...getStorageItem<Partial<UserPreferences>>(STORAGE_KEYS.PREFERENCES, {}),
  };
}

export function savePreferences(prefs: UserPreferences): void {
  setStorageItem(STORAGE_KEYS.PREFERENCES, prefs);
}

// Recent searches helpers
export function loadRecentSearches(): string[] {
  return getStorageItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES, [
    'Cobalt Monolith',
    '60mm Platform',
    'Limited Edition',
    'Women Violet',
  ]);
}

export function addRecentSearch(term: string): string[] {
  const clean = term.trim();
  if (!clean) return loadRecentSearches();
  const current = loadRecentSearches();
  const updated = [
    clean,
    ...current.filter((item) => item.toLowerCase() !== clean.toLowerCase()),
  ].slice(0, 6);
  setStorageItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
  return updated;
}

// Custom user-submitted reviews per product
export function loadCustomReviews(): Record<string, ProductReview[]> {
  return getStorageItem<Record<string, ProductReview[]>>(
    STORAGE_KEYS.CUSTOM_REVIEWS,
    {}
  );
}

export function addCustomReview(
  productId: string,
  review: ProductReview
): Record<string, ProductReview[]> {
  const current = loadCustomReviews();
  const productReviews = current[productId] || [];
  const updated = {
    ...current,
    [productId]: [review, ...productReviews],
  };
  setStorageItem(STORAGE_KEYS.CUSTOM_REVIEWS, updated);
  return updated;
}

// Authentication & User Account helpers (localStorage)
export function loadCurrentUser(): UserAccount | null {
  return getStorageItem<UserAccount | null>(STORAGE_KEYS.AUTH_USER, null);
}

export function saveCurrentUser(user: UserAccount | null): void {
  if (!isBrowser()) return;
  if (!user) {
    window.localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  } else {
    setStorageItem(STORAGE_KEYS.AUTH_USER, user);
  }
}

export function loadRegisteredUsers(): StoredUserRecord[] {
  return getStorageItem<StoredUserRecord[]>(STORAGE_KEYS.REGISTERED_USERS, [
    {
      id: 'usr-demo-01',
      fullName: 'Elena Rostova',
      email: 'elena@altura-atelier.com',
      avatarInitials: 'ER',
      preferredGender: 'women',
      defaultSizeUs: 7.5,
      memberSince: 'Oct 2025',
      altitudePoints: 1450,
      vipTier: 'Founder Circle',
      passwordHash: 'altura2026',
    },
  ]);
}

export function registerNewUser(
  fullName: string,
  email: string,
  password: string,
  preferredGender: 'all' | 'men' | 'women',
  defaultSizeUs: number
): { user?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const users = loadRegisteredUsers();
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { error: 'An account with this email already exists. Please sign in.' };
  }

  const initials =
    fullName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AL';

  const newRecord: StoredUserRecord = {
    id: `usr-${Date.now()}`,
    fullName: fullName.trim(),
    email: cleanEmail,
    avatarInitials: initials,
    preferredGender,
    defaultSizeUs,
    memberSince: new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    altitudePoints: 500,
    vipTier: 'Atelier VIP',
    passwordHash: password,
  };

  setStorageItem(STORAGE_KEYS.REGISTERED_USERS, [newRecord, ...users]);
  const { passwordHash: _, ...publicUser } = newRecord;
  saveCurrentUser(publicUser);
  return { user: publicUser };
}

export function authenticateUser(
  email: string,
  password: string
): { user?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const users = loadRegisteredUsers();
  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!found || found.passwordHash !== password) {
    return {
      error:
        'Invalid email or password. Try the 1-Click Demo Collector login or create a new account.',
    };
  }
  const { passwordHash: _, ...publicUser } = found;
  saveCurrentUser(publicUser);
  return { user: publicUser };
}

// Order History helpers
export function loadOrderHistory(): OrderReceipt[] {
  return getStorageItem<OrderReceipt[]>(STORAGE_KEYS.ORDER_HISTORY, []);
}

export function addOrderToHistory(receipt: OrderReceipt): OrderReceipt[] {
  const current = loadOrderHistory();
  const updated = [receipt, ...current].slice(0, 20);
  setStorageItem(STORAGE_KEYS.ORDER_HISTORY, updated);
  return updated;
}
