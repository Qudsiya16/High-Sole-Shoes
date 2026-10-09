/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  Eye,
} from 'lucide-react';
import {
  ActivePage,
  CartItem,
  OrderReceipt,
  Product,
  ProductReview,
  UserAccount,
  UserPreferences,
} from './types/shoe';
import { GENERATED_ASSETS, PRODUCTS } from './data/products';
import {
  addCustomReview,
  addOrderToHistory,
  addRecentSearch,
  addRecentlyViewed,
  loadCart,
  loadCurrentUser,
  loadCustomReviews,
  loadOrderHistory,
  loadPreferences,
  loadRecentSearches,
  loadRecentlyViewed,
  loadWishlist,
  saveCart,
  saveCurrentUser,
  savePreferences,
  saveWishlist,
} from './utils/storage';
import { updatePageSeo } from './utils/seo';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ModelsLookbookSection } from './components/ModelsLookbookSection';
import { ReviewsSection } from './components/ReviewsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ShopView } from './components/ShopView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import {
  QuickViewModal,
  SearchOverlayModal,
  SizeGuideModal,
} from './components/Modals';
import { AuthModal } from './components/AuthModal';
import { AboutStoryView } from './components/AboutStoryView';
import { Sneaker3DViewer } from './components/Sneaker3DViewer';
import { VideoSection } from './components/VideoSection';
import { ResilientImage } from './components/ResilientImage';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

export default function App() {
  // Navigation state
  const [activePage, setActivePage] = useState<ActivePage>({ view: 'home' });

  // Persisted LocalStorage states
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [wishlist, setWishlist] = useState<string[]>(() => loadWishlist());
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    loadRecentlyViewed()
  );
  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    loadPreferences()
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    loadRecentSearches()
  );
  const [customReviewsMap, setCustomReviewsMap] = useState<
    Record<string, ProductReview[]>
  >(() => loadCustomReviews());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    loadCurrentUser()
  );
  const [orderHistory, setOrderHistory] = useState<OrderReceipt[]>(() =>
    loadOrderHistory()
  );

  // Interactive Promotional Video Section state (Section 6 — 1:1 locked to selected product)
  const [promoVideoProductIdx, setPromoVideoProductIdx] = useState(0);

  // Drawers & Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  // Toast Notification & Scroll state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 520);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync SEO Metadata & JSON-LD Structured Data on page change
  const activeProduct = useMemo(() => {
    if (activePage.view === 'product') {
      return (
        PRODUCTS.find((p) => p.slug === activePage.slug) || PRODUCTS[0]
      );
    }
    return undefined;
  }, [activePage]);

  useEffect(() => {
    updatePageSeo(activePage, activeProduct);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, activeProduct]);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    sizeUs: number,
    colorName: string,
    quantity = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSizeUs === sizeUs &&
          item.selectedColor === colorName
      );
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            productId: product.id,
            selectedSizeUs: sizeUs,
            selectedColor: colorName,
            quantity,
            addedAt: Date.now(),
          },
        ];
      }
      saveCart(updated);
      return updated;
    });
    triggerToast('Product added to your bag');
  };

  const handleBuyNow = (
    product: Product,
    sizeUs: number,
    colorName: string,
    quantity: number
  ) => {
    handleAddToCart(product, sizeUs, colorName, quantity);
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (
    productId: string,
    selectedSizeUs: number,
    selectedColor: string,
    delta: number
  ) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (
            item.productId === productId &&
            item.selectedSizeUs === selectedSizeUs &&
            item.selectedColor === selectedColor
          ) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null);
      saveCart(updated);
      return updated;
    });
  };

  const handleRemoveCartItem = (
    productId: string,
    selectedSizeUs: number,
    selectedColor: string
  ) => {
    setCart((prev) => {
      const updated = prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.selectedSizeUs === selectedSizeUs &&
            item.selectedColor === selectedColor
          )
      );
      saveCart(updated);
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    saveCart([]);
  };

  const handleOrderCompleted = (receipt: OrderReceipt) => {
    const updated = addOrderToHistory(receipt);
    setOrderHistory(updated);
    triggerToast(`Order ${receipt.orderNumber} confirmed!`);
  };

  // Auth Handlers
  const handleAuthSuccess = (user: UserAccount, isNewSignup: boolean) => {
    setCurrentUser(user);
    if (isNewSignup) {
      const updatedPrefs: UserPreferences = {
        ...preferences,
        promoCodeApplied: 'ALTURA15',
      };
      setPreferences(updatedPrefs);
      savePreferences(updatedPrefs);
      triggerToast(
        `Welcome, ${user.fullName}! 500 Altitude Pts & 15% code ALTURA15 unlocked.`
      );
    } else {
      triggerToast(`Welcome back, ${user.fullName}!`);
    }
  };

  const handleLogout = () => {
    saveCurrentUser(null);
    setCurrentUser(null);
    setAuthModalOpen(false);
    triggerToast('Signed out of your ALTURA Collector account.');
  };

  // Wishlist Handlers
  const handleToggleWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists
        ? prev.filter((id) => id !== productId)
        : [productId, ...prev];
      saveWishlist(updated);
      if (product) {
        triggerToast(
          exists
            ? `Removed ${product.name} from wishlist`
            : `Saved ${product.name} to your wishlist`
        );
      }
      return updated;
    });
  };

  const handleMoveWishlistToCart = (product: Product) => {
    const defaultSize =
      product.sizes.find((s) => s.inStock)?.us || product.sizes[0].us;
    const defaultColor = product.colors[0].name;
    handleAddToCart(product, defaultSize, defaultColor, 1);
    handleToggleWishlist(product.id);
  };

  // Product Selection & Recently Viewed Tracking (Saves to localStorage, prevents duplicates, moves newest first, max 8)
  const handleSelectProduct = (slug: string) => {
    const prod = PRODUCTS.find((p) => p.slug === slug);
    if (prod) {
      const updatedRecent = addRecentlyViewed(prod.id);
      setRecentlyViewed(updatedRecent);
    }
    setActivePage({ view: 'product', slug });
  };

  const handleQuickView = (product: Product) => {
    const updatedRecent = addRecentlyViewed(product.id);
    setRecentlyViewed(updatedRecent);
    setQuickViewProduct(product);
  };

  const handleSelectShoeByName = (shoePurchased: string) => {
    const firstWord = shoePurchased.split(' ')[0].toLowerCase();
    const found = PRODUCTS.find((p) =>
      p.name.toLowerCase().includes(firstWord)
    );
    if (found) {
      handleSelectProduct(found.slug);
    }
  };

  // Preferences & Search History
  const handleChangeSizeSystem = (sizeSystem: 'US' | 'EU' | 'UK') => {
    const updated = { ...preferences, sizeSystem };
    setPreferences(updated);
    savePreferences(updated);
  };

  const handleApplyPromo = (promoCodeApplied: string) => {
    const updated = { ...preferences, promoCodeApplied };
    setPreferences(updated);
    savePreferences(updated);
  };

  const handleNewsletterSubscribe = (email: string) => {
    const updated: UserPreferences = {
      ...preferences,
      newsletterSubscribed: true,
      subscriberEmail: email,
      promoCodeApplied: 'ALTURA15',
    };
    setPreferences(updated);
    savePreferences(updated);
    triggerToast(
      'Welcome to ALTURA Priority Drops! 15% code ALTURA15 activated.'
    );
  };

  const handleRecordSearch = (term: string) => {
    const updated = addRecentSearch(term);
    setRecentSearches(updated);
  };

  const handleAddCustomReview = (productId: string, review: ProductReview) => {
    const updated = addCustomReview(productId, review);
    setCustomReviewsMap(updated);
    triggerToast('Thank you! Your verified review has been published.');
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Curated 4-product slices for homepage sections
  const trendingProducts = useMemo(
    () => PRODUCTS.filter((p) => p.isTrending).slice(0, 4),
    []
  );
  const mensFeaturedProducts = useMemo(
    () => PRODUCTS.filter((p) => p.gender === 'men').slice(0, 4),
    []
  );
  const womensFeaturedProducts = useMemo(
    () => PRODUCTS.filter((p) => p.gender === 'women').slice(0, 4),
    []
  );
  const newArrivalProducts = useMemo(
    () => PRODUCTS.filter((p) => p.isNew).slice(0, 4),
    []
  );
  const bestSellerProducts = useMemo(
    () => PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4),
    []
  );
  const recentlyViewedObjects = useMemo(() => {
    return recentlyViewed
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p))
      .slice(0, 8);
  }, [recentlyViewed]);

  const activePromoVideoProduct =
    PRODUCTS[promoVideoProductIdx] || PRODUCTS[0];

  const mensCategoryCards = [
    {
      title: 'High-Sole Sneakers',
      subtitle: '60mm–64mm Architectural Stack',
      image: GENERATED_ASSETS.cobaltShoe,
      modelImage: GENERATED_ASSETS.cobaltModel,
      category: 'High-Sole Sneakers',
    },
    {
      title: 'Chunky Sneakers',
      subtitle: '55mm Wave-Ribbed Midsoles',
      image: GENERATED_ASSETS.terracottaShoe,
      modelImage: GENERATED_ASSETS.terracottaModel,
      category: 'Chunky Sneakers',
    },
    {
      title: 'Running-Inspired 60mm',
      subtitle: 'Carbon-Plate Propulsion Runners',
      image: GENERATED_ASSETS.crimsonShoe,
      modelImage: GENERATED_ASSETS.crimsonModel,
      category: 'Running-Inspired Shoes',
    },
  ];

  const womensCategoryCards = [
    {
      title: 'Platform Sneakers',
      subtitle: '58mm Triple-Stacked Pearl Soles',
      image: GENERATED_ASSETS.violetShoe,
      modelImage: GENERATED_ASSETS.violetModel,
      category: 'Platform Sneakers',
    },
    {
      title: 'Streetwear Sneakers',
      subtitle: '52mm Emerald Mesh & Citrus Volt',
      image: GENERATED_ASSETS.emeraldShoe,
      modelImage: GENERATED_ASSETS.emeraldModel,
      category: 'Streetwear Sneakers',
    },
    {
      title: 'Limited Edition Drops',
      subtitle: 'Numbered Runway Releases',
      image: GENERATED_ASSETS.crimsonShoe,
      modelImage: GENERATED_ASSETS.crimsonModel,
      category: 'Limited Edition',
    },
  ];

  const anyOverlayOpen =
    cartOpen ||
    wishlistOpen ||
    authModalOpen ||
    searchOpen ||
    sizeGuideOpen ||
    Boolean(quickViewProduct);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#F8F8FA] text-zinc-900">
      {/* 1. Premium Scroll-Adaptive Header */}
      <Navbar
        activePage={activePage}
        onNavigate={setActivePage}
        cartCount={totalCartItems}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        products={PRODUCTS}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full max-w-full">
        {activePage.view === 'home' && (
          <>
            {/* 2. Hero / Futuristic Fashion Campaign (1:1 Synced Shoe & Model) */}
            <Hero
              products={PRODUCTS}
              onNavigate={setActivePage}
              onQuickView={handleQuickView}
              onSelectProduct={handleSelectProduct}
            />

            {/* 3. Trending Now (1-Column Mobile -> sm:2 -> lg:3 -> xl:4) */}
            <section className="py-10 sm:py-16 lg:py-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200/80 pb-4 sm:pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider mb-1">
                    <span>01 · MOST COVETED SILHOUETTES</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
                    Trending Now
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActivePage({ view: 'shop', presetBadge: 'trending' })
                  }
                  className="group inline-flex items-center gap-2 font-sans text-sm font-bold text-zinc-900 hover:text-blue-600 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <span>Explore All Trending</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {trendingProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onSelectProduct={handleSelectProduct}
                    sizeSystem={preferences.sizeSystem}
                  />
                ))}
              </div>
            </section>

            {/* 4. Shop Men (Category Cards + 1-Column Mobile / 4-Column Desktop Men's Grid) */}
            <section className="py-10 sm:py-16 lg:py-20 bg-white border-y border-zinc-200/80 w-full max-w-full overflow-hidden">
              <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
                      02 · MEN’S ARCHITECTURAL EDIT
                    </div>
                    <h2 className="font-display text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
                      Shop Men’s High-Sole
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePage({ view: 'men' })}
                    className="group px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-blue-600 text-white font-sans text-xs font-bold flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] cursor-pointer self-start"
                  >
                    <span>Shop All Men’s</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Men's Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                  {mensCategoryCards.map((cat) => (
                    <div
                      key={cat.title}
                      onClick={() =>
                        setActivePage({
                          view: 'shop',
                          presetGender: 'men',
                          presetCategory: cat.category,
                        })
                      }
                      className="group relative aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-400 sm:hover:-translate-y-1"
                    >
                      <ResilientImage
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-400 group-hover:opacity-95" />
                      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                        <div className="transition-transform duration-350 ease-out sm:group-hover:-translate-y-1.5 min-w-0">
                          <p className="text-xs font-mono text-blue-400 truncate">
                            {cat.subtitle}
                          </p>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5 truncate">
                            {cat.title}
                          </h3>
                        </div>
                        <span className="px-3 py-1.5 rounded-xl bg-white text-zinc-950 font-sans text-xs font-bold flex items-center gap-1 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-350 shrink-0">
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Men's Product Grid (1-Column Mobile -> sm:2 -> lg:3 -> xl:4) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                  {mensFeaturedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={handleAddToCart}
                      onQuickView={handleQuickView}
                      onSelectProduct={handleSelectProduct}
                      sizeSystem={preferences.sizeSystem}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Shop Women (Category Cards + 1-Column Mobile / 4-Column Desktop Women's Grid) */}
            <section className="py-10 sm:py-16 lg:py-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-purple-600 uppercase tracking-wider mb-1">
                    03 · WOMEN’S PLATFORM EDIT
                  </div>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
                    Shop Women’s Platforms
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage({ view: 'women' })}
                  className="group px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-blue-600 text-white font-sans text-xs font-bold flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] cursor-pointer self-start"
                >
                  <span>Shop All Women’s</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Women's Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {womensCategoryCards.map((cat) => (
                  <div
                    key={cat.title}
                    onClick={() =>
                      setActivePage({
                        view: 'shop',
                        presetGender: 'women',
                        presetCategory: cat.category,
                      })
                    }
                    className="group relative aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-400 sm:hover:-translate-y-1"
                  >
                    <ResilientImage
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-400 group-hover:opacity-95" />
                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                      <div className="transition-transform duration-350 ease-out sm:group-hover:-translate-y-1.5 min-w-0">
                        <p className="text-xs font-mono text-purple-300 truncate">
                          {cat.subtitle}
                        </p>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5 truncate">
                          {cat.title}
                        </h3>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-white text-zinc-950 font-sans text-xs font-bold flex items-center gap-1 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-350 shrink-0">
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Women's Product Grid (1-Column Mobile -> sm:2 -> lg:3 -> xl:4) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {womensFeaturedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onSelectProduct={handleSelectProduct}
                    sizeSystem={preferences.sizeSystem}
                  />
                ))}
              </div>
            </section>

            {/* 6. Interactive Promotional Video (Synchronized 1:1 with Selected Shoe & Model) */}
            <section className="py-10 sm:py-16 lg:py-20 bg-[#09090D] text-white border-y border-white/10 w-full max-w-full">
              <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
                      <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span>04 · INTERACTIVE CAMPAIGN FILM</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight text-balance">
                      Step Into the Future — Live Motion Reel
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-2xl">
                      Switch between flagship silhouettes to inspect the live 360° sole compression reel alongside the exact matching fashion model.
                    </p>
                  </div>

                  {/* Shoe Switcher that updates the Promotional Video & Model 1:1 */}
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full lg:w-auto shrink-0">
                    {PRODUCTS.slice(0, 4).map((prod, idx) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => setPromoVideoProductIdx(idx)}
                        className={`px-3 py-2.5 rounded-xl font-sans text-xs font-bold flex items-center justify-center sm:justify-start gap-2 border transition-all cursor-pointer min-w-0 ${
                          promoVideoProductIdx === idx
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0 border border-white/30"
                          style={{ backgroundColor: prod.colors[0].hex }}
                        />
                        <span className="truncate">
                          {prod.name.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                  {/* Left Column: Live Motion Video Reel (min-w-0 + no aspect ratio on grid item prevents horizontal grid blowout) */}
                  <div className="lg:col-span-7 xl:col-span-8 min-w-0 flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-950">
                    <VideoSection
                      posterSrc={activePromoVideoProduct.images[0]}
                      secondarySrc={activePromoVideoProduct.modelImage}
                      title={activePromoVideoProduct.video.caption}
                      subtitle={activePromoVideoProduct.video.specsHighlight}
                      accentColor={activePromoVideoProduct.colors[0].hex}
                      className="w-full h-full flex-1"
                    />
                  </div>

                  {/* Right Column: Synchronized Model & Product Card beside the Video */}
                  <div className="lg:col-span-5 xl:col-span-4 min-w-0 rounded-2xl sm:rounded-3xl bg-zinc-900 border border-white/15 p-4 sm:p-6 flex flex-col justify-between gap-4 sm:gap-5 relative z-10">
                    <div className="space-y-4 min-w-0">
                      <div className="aspect-[16/10] sm:aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-800 relative">
                        <ResilientImage
                          src={activePromoVideoProduct.modelImage}
                          alt={`Model ${activePromoVideoProduct.modelName} wearing ${activePromoVideoProduct.name}`}
                          className="w-full h-full object-cover object-top"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-xs text-[10px] sm:text-[11px] font-mono text-emerald-300 border border-emerald-400/30 max-w-[calc(100%-1.5rem)] truncate">
                          Synced Model: {activePromoVideoProduct.modelName}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-mono text-zinc-400 break-words">
                          {activePromoVideoProduct.category} ·{' '}
                          {activePromoVideoProduct.soleHeightMm}mm Platform
                        </div>
                        <h3 className="font-display text-lg sm:text-2xl font-bold text-white mt-1 break-words">
                          {activePromoVideoProduct.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 leading-relaxed break-words">
                          {activePromoVideoProduct.editorialTagline}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                          EDITION PRICE
                        </span>
                        <span className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                          $
                          {activePromoVideoProduct.discountPrice ??
                            activePromoVideoProduct.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuickView(activePromoVideoProduct)
                          }
                          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          aria-label="Quick view"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectProduct(activePromoVideoProduct.slug)
                          }
                          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span>Shop This Shoe</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. New Arrivals (1-Column Mobile -> sm:2 -> lg:3 -> xl:4) */}
            <section className="py-10 sm:py-16 lg:py-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200/80 pb-4 sm:pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>05 · JUST LANDED FROM MILAN</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
                    New Arrivals
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActivePage({ view: 'shop', presetBadge: 'new' })
                  }
                  className="group inline-flex items-center gap-2 font-sans text-sm font-bold text-zinc-900 hover:text-blue-600 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <span>View All New Drops</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {newArrivalProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onSelectProduct={handleSelectProduct}
                    sizeSystem={preferences.sizeSystem}
                  />
                ))}
              </div>
            </section>

            {/* 8. High-Sole Collection with Responsive Filter Bar */}
            <div className="bg-white border-t border-zinc-200/80 w-full max-w-full">
              <ShopView
                embedded
                products={PRODUCTS}
                titleOverride="Complete High-Sole Collection"
                subtitleOverride="Use the interactive filter bar to filter dynamically by Gender, Category, Size, Color, Price, Rating, and Sort Order."
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                onSelectProduct={handleSelectProduct}
                sizeSystem={preferences.sizeSystem}
                onChangeSizeSystem={handleChangeSizeSystem}
                recentSearches={recentSearches}
                onRecordSearch={handleRecordSearch}
              />
            </div>

            {/* 9. Animated Model Showcase (100% 1:1 Synchronized Shoe & Model Animation) */}
            <ModelsLookbookSection
              products={PRODUCTS}
              onSelectProduct={handleSelectProduct}
              onQuickView={handleQuickView}
              onAddToCart={handleAddToCart}
            />

            {/* 10. Best Sellers (1-Column Mobile -> sm:2 -> lg:3 -> xl:4) */}
            <section className="py-10 sm:py-16 lg:py-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200/80 pb-4 sm:pb-5">
                <div>
                  <div className="text-xs font-mono text-amber-600 uppercase tracking-wider mb-1">
                    08 · COLLECTOR FAVORITES
                  </div>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
                    Best Sellers
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActivePage({ view: 'shop', presetBadge: 'bestseller' })
                  }
                  className="group inline-flex items-center gap-2 font-sans text-sm font-bold text-zinc-900 hover:text-blue-600 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <span>Shop All Best Sellers</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {bestSellerProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onSelectProduct={handleSelectProduct}
                    sizeSystem={preferences.sizeSystem}
                  />
                ))}
              </div>
            </section>

            {/* 11. Recently Viewed (Persistent via localStorage, 1-Column Mobile -> sm:2 -> lg:3 -> xl:4) */}
            {recentlyViewedObjects.length > 0 && (
              <section className="py-10 sm:py-16 bg-white border-y border-zinc-200/80 w-full max-w-full">
                <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>09 · PERSISTENT SESSION HISTORY</span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                        Recently Viewed
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">
                      Showing latest {recentlyViewedObjects.slice(0, 4).length}{' '}
                      inspected silhouettes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                    {recentlyViewedObjects.slice(0, 4).map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        isWishlisted={wishlist.includes(prod.id)}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={handleAddToCart}
                        onQuickView={handleQuickView}
                        onSelectProduct={handleSelectProduct}
                        sizeSystem={preferences.sizeSystem}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 12. Customer Reviews */}
            <ReviewsSection onSelectShoeByName={handleSelectShoeByName} />

            {/* 13. Newsletter */}
            <NewsletterSection
              isSubscribed={Boolean(preferences.newsletterSubscribed)}
              subscriberEmail={preferences.subscriberEmail}
              onSubscribe={handleNewsletterSubscribe}
            />
          </>
        )}

        {activePage.view === 'shop' && (
          <ShopView
            products={PRODUCTS}
            initialGender={activePage.presetGender || 'all'}
            initialCategory={activePage.presetCategory || 'All'}
            initialBadge={activePage.presetBadge || 'all'}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
            onSelectProduct={handleSelectProduct}
            sizeSystem={preferences.sizeSystem}
            onChangeSizeSystem={handleChangeSizeSystem}
            recentSearches={recentSearches}
            onRecordSearch={handleRecordSearch}
          />
        )}

        {activePage.view === 'men' && (
          <ShopView
            products={PRODUCTS}
            initialGender="men"
            titleOverride="Men's High-Sole & Chunky Sneakers"
            subtitleOverride="Engineered from 50mm court platforms up to 64mm sawtooth limited editions. Crafted with Italian calfskin, desert suede, and carbon anti-torsion plates."
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
            onSelectProduct={handleSelectProduct}
            sizeSystem={preferences.sizeSystem}
            onChangeSizeSystem={handleChangeSizeSystem}
            recentSearches={recentSearches}
            onRecordSearch={handleRecordSearch}
          />
        )}

        {activePage.view === 'women' && (
          <ShopView
            products={PRODUCTS}
            initialGender="women"
            titleOverride="Women's Platform & High-Sole Sneakers"
            subtitleOverride="Sculpted triple-stacked platforms and 410g featherweight high-sole silhouettes in ultraviolet suede, emerald mesh, and alabaster calfskin."
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
            onSelectProduct={handleSelectProduct}
            sizeSystem={preferences.sizeSystem}
            onChangeSizeSystem={handleChangeSizeSystem}
            recentSearches={recentSearches}
            onRecordSearch={handleRecordSearch}
          />
        )}

        {activePage.view === 'product' && activeProduct && (
          <ProductDetailView
            product={activeProduct}
            allProducts={PRODUCTS}
            recentlyViewedIds={recentlyViewed}
            isWishlisted={wishlist.includes(activeProduct.id)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectProduct={handleSelectProduct}
            onQuickView={handleQuickView}
            onBack={() => setActivePage({ view: 'shop' })}
            sizeSystem={preferences.sizeSystem}
            onChangeSizeSystem={handleChangeSizeSystem}
            onOpenSizeGuide={() => setSizeGuideOpen(true)}
            customReviews={customReviewsMap[activeProduct.id] || []}
            onAddCustomReview={handleAddCustomReview}
          />
        )}

        {activePage.view === 'about' && (
          <>
            <AboutStoryView onNavigate={setActivePage} />
            <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
              <Sneaker3DViewer
                onSelectPresetProduct={handleSelectShoeByName}
              />
            </div>
            <ModelsLookbookSection
              products={PRODUCTS}
              onSelectProduct={handleSelectProduct}
              onQuickView={handleQuickView}
              onAddToCart={handleAddToCart}
            />
            <NewsletterSection
              isSubscribed={Boolean(preferences.newsletterSubscribed)}
              subscriberEmail={preferences.subscriberEmail}
              onSubscribe={handleNewsletterSubscribe}
            />
          </>
        )}
      </main>

      {/* 14. Footer */}
      <Footer
        onNavigate={setActivePage}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      {/* Slide-Over Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        products={PRODUCTS}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onSelectProduct={handleSelectProduct}
        appliedPromo={preferences.promoCodeApplied}
        onApplyPromo={handleApplyPromo}
        currentUserName={currentUser?.fullName}
        currentUserEmail={currentUser?.email}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Slide-Over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistIds={wishlist}
        products={PRODUCTS}
        onToggleWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveWishlistToCart}
        onSelectProduct={handleSelectProduct}
      />

      {/* Login, Sign Up & Collector Account Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        orderHistory={orderHistory}
        onSelectProduct={handleSelectProduct}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
      />

      {/* Instant Search Modal */}
      <SearchOverlayModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={PRODUCTS}
        recentSearches={recentSearches}
        onRecordSearch={handleRecordSearch}
        onSelectProduct={handleSelectProduct}
      />

      {/* US / EU / UK Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      {/* Toast Notification ("Product added to your bag", etc.) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-[92vw] px-4 py-3 rounded-xl bg-zinc-950 text-white text-xs font-bold shadow-2xl border border-zinc-800 flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Back to Top Button (Positioned cleanly above the WhatsApp Floating Button) */}
      {showBackToTop && !anyOverlayOpen && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
          className="fixed bottom-19 right-4 sm:bottom-21 sm:right-6 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-950/90 hover:bg-blue-600 text-white shadow-lg border border-white/15 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Floating WhatsApp Customer Support Button */}
      <WhatsAppFloatingButton hidden={anyOverlayOpen} />
    </div>
  );
}
