import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Check,
  Play,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  Move3d,
  UserCheck,
  Loader2,
} from 'lucide-react';
import { Product, ProductReview } from '../types/shoe';
import { ResilientImage } from './ResilientImage';
import { VideoSection } from './VideoSection';
import { ProductCard } from './ProductCard';
import { Sneaker3DViewer } from './Sneaker3DViewer';
import { buildProductWhatsAppUrl } from '../config/whatsapp';
import { WhatsAppIcon } from './WhatsAppFloatingButton';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  recentlyViewedIds: string[];
  isWishlisted: boolean;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    product: Product,
    sizeUs: number,
    colorName: string,
    quantity?: number
  ) => void;
  onBuyNow: (
    product: Product,
    sizeUs: number,
    colorName: string,
    quantity: number
  ) => void;
  onSelectProduct: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onBack: () => void;
  sizeSystem: 'US' | 'EU' | 'UK';
  onChangeSizeSystem: (sys: 'US' | 'EU' | 'UK') => void;
  onOpenSizeGuide: () => void;
  customReviews: ProductReview[];
  onAddCustomReview: (productId: string, review: ProductReview) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  recentlyViewedIds,
  isWishlisted,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onQuickView,
  onBack,
  sizeSystem,
  onChangeSizeSystem,
  onOpenSizeGuide,
  customReviews,
  onAddCustomReview,
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [galleryMode, setGalleryMode] = useState<
    'front' | 'model' | 'side' | 'detail' | 'video' | '3d'
  >('front');
  const [selectedSizeUs, setSelectedSizeUs] = useState<number>(
    product.sizes.find((s) => s.inStock)?.us || product.sizes[0].us
  );
  const [quantity, setQuantity] = useState(1);
  const [activeInfoTab, setActiveInfoTab] = useState<
    'description' | 'materials' | 'shipping'
  >('description');
  const [addStatus, setAddStatus] = useState<'idle' | 'adding' | 'added'>(
    'idle'
  );

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  React.useEffect(() => {
    setSelectedColorIdx(0);
    setGalleryMode('front');
    setSelectedSizeUs(
      product.sizes.find((s) => s.inStock)?.us || product.sizes[0].us
    );
    setQuantity(1);
    setAddStatus('idle');
  }, [product]);

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];
  // 100% 1:1 matched shoe image & model image for the selected colorway
  const activeShoeImage = activeColor.shoeImage || product.images[0];
  const activeModelImage = activeColor.modelImage || product.modelImage;
  const activePreset3d = activeColor.preset3dId || product.preset3dId;

  const combinedReviews = [...customReviews, ...product.reviews];

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.gender === product.gender || p.category === product.category)
    )
    .slice(0, 4);

  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p && p.id !== product.id))
    .slice(0, 4);

  const handleAdd = () => {
    if (addStatus !== 'idle') return;
    setAddStatus('adding');
    setTimeout(() => {
      onAddToCart(product, selectedSizeUs, activeColor.name, quantity);
      setAddStatus('added');
      setTimeout(() => setAddStatus('idle'), 1500);
    }, 280);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    const initials = reviewAuthor
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newRev: ProductReview = {
      id: `user-rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      roleOrCity: reviewCity.trim() || 'Verified Collector',
      avatarInitials: initials || 'AL',
      rating: reviewRating,
      date: 'Just now',
      title: reviewTitle.trim() || 'Exceptional platform elevation',
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      shoePurchased: `${product.name} · US ${selectedSizeUs}`,
      fitFeedback: 'True to Size',
    };
    onAddCustomReview(product.id, newRev);
    setReviewAuthor('');
    setReviewCity('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="py-6 sm:py-10 lg:py-12 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
      {/* Breadcrumb & Back Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500"
      >
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 font-sans font-bold text-zinc-900 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span aria-hidden="true">/</span>
          <span className="capitalize">{product.gender}</span>
          <span aria-hidden="true">/</span>
          <span className="truncate max-w-[120px] sm:max-w-none">{product.category}</span>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-900 font-semibold truncate max-w-[150px] sm:max-w-[240px]">
            {product.name}
          </span>
        </div>

        <div className="font-mono text-[11px] sm:text-xs text-zinc-500">
          SKU: <span className="text-zinc-900 font-semibold uppercase">{product.id}</span> · STACK:{' '}
          <span className="text-zinc-900 font-semibold">{product.soleHeightMm}MM</span>
        </div>
      </nav>

      {/* Main Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: 1:1 Matched Multi-Angle Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-3.5 sm:space-y-4 min-w-0">
          {galleryMode === '3d' ? (
            <Sneaker3DViewer initialPresetId={activePreset3d} compact />
          ) : (
            <div className="relative aspect-[4/3] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F1F1F5] border border-zinc-200/80 shadow-sm">
              {galleryMode === 'video' ? (
                <VideoSection
                  posterSrc={activeShoeImage}
                  secondarySrc={activeModelImage}
                  title={`${product.name} (${activeColor.name}) — ${product.soleHeightMm}mm Motion`}
                  subtitle={product.video.specsHighlight}
                  accentColor={activeColor.hex}
                  className="w-full h-full"
                  compact
                />
              ) : galleryMode === 'model' ? (
                <>
                  <ResilientImage
                    src={activeModelImage}
                    alt={`Model ${product.modelName} wearing exact ${product.name} in ${activeColor.name}`}
                    className="w-full h-full object-cover object-top transition-all duration-400"
                  />
                  <div className="absolute bottom-3 left-3 right-3 sm:right-auto px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">
                      Model <strong>{product.modelName}</strong> wearing exact{' '}
                      <strong>{activeColor.name}</strong>
                    </span>
                  </div>
                </>
              ) : (
                <ResilientImage
                  src={activeShoeImage}
                  alt={`${product.name} in ${activeColor.name} (${galleryMode} view)`}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    galleryMode === 'side'
                      ? 'scale-115 object-right'
                      : galleryMode === 'detail'
                        ? 'scale-140 object-bottom'
                        : 'object-center'
                  }`}
                />
              )}

              {/* Elevation Spec Overlay */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-lg bg-zinc-950/85 backdrop-blur-md text-white font-mono text-[11px] sm:text-xs">
                {product.soleHeightMm}mm Platform · {product.weightGrams}g
              </div>
            </div>
          )}

          {/* Interactive 6-Mode Thumbnail Bar (All locked 1:1 to activeColor!) */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setGalleryMode('front')}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                galleryMode === 'front'
                  ? 'border-blue-600 ring-2 ring-blue-600/20'
                  : 'border-zinc-200 opacity-80 hover:opacity-100'
              }`}
            >
              <ResilientImage
                src={activeShoeImage}
                alt="Front studio view"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                1. Front
              </span>
            </button>

            <button
              type="button"
              onClick={() => setGalleryMode('model')}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                galleryMode === 'model'
                  ? 'border-blue-600 ring-2 ring-blue-600/20'
                  : 'border-zinc-200 opacity-80 hover:opacity-100'
              }`}
            >
              <ResilientImage
                src={activeModelImage}
                alt="Model wearing shoe"
                className="w-full h-full object-cover object-top"
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-emerald-700/90 text-[9px] font-mono text-white">
                2. Model
              </span>
            </button>

            <button
              type="button"
              onClick={() => setGalleryMode('side')}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                galleryMode === 'side'
                  ? 'border-blue-600 ring-2 ring-blue-600/20'
                  : 'border-zinc-200 opacity-80 hover:opacity-100'
              }`}
            >
              <ResilientImage
                src={activeShoeImage}
                alt="Side profile view"
                className="w-full h-full object-cover scale-120 object-right"
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                3. Side
              </span>
            </button>

            <button
              type="button"
              onClick={() => setGalleryMode('detail')}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                galleryMode === 'detail'
                  ? 'border-blue-600 ring-2 ring-blue-600/20'
                  : 'border-zinc-200 opacity-80 hover:opacity-100'
              }`}
            >
              <ResilientImage
                src={activeShoeImage}
                alt="Sole close-up view"
                className="w-full h-full object-cover scale-140 object-bottom"
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                4. Sole
              </span>
            </button>

            <button
              type="button"
              onClick={() => setGalleryMode('3d')}
              className={`aspect-[4/3] rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-mono font-semibold transition-all cursor-pointer ${
                galleryMode === '3d'
                  ? 'border-blue-600 bg-zinc-950 text-white'
                  : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400'
              }`}
            >
              <Move3d className="w-4 h-4 text-blue-500" />
              <span className="text-[10px]">360° 3D</span>
            </button>

            <button
              type="button"
              onClick={() => setGalleryMode('video')}
              className={`aspect-[4/3] rounded-xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-mono font-semibold transition-all cursor-pointer ${
                galleryMode === 'video'
                  ? 'border-blue-600 bg-zinc-950 text-white'
                  : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400'
              }`}
            >
              <Play className="w-4 h-4 fill-current text-blue-500" />
              <span className="text-[10px]">Video</span>
            </button>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-5 sm:p-8 shadow-sm space-y-5 sm:space-y-6 min-w-0">
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="capitalize font-semibold text-zinc-800">{product.gender}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold shrink-0">
                {product.stock <= 6 ? `Only ${product.stock} left` : 'In Stock'}
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-zinc-800 tabular-nums shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">{product.rating.toFixed(1)}</span>
              <span className="text-zinc-400">({combinedReviews.length + product.reviewsCount})</span>
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight text-balance">
              {product.name}
            </h1>
            <p className="text-sm text-zinc-600 mt-1.5">
              {product.editorialTagline}
            </p>

            <div className="mt-4 flex items-baseline gap-3 font-mono tabular-nums">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl font-bold text-zinc-950">
                    ${product.discountPrice}
                  </span>
                  <span className="text-base text-zinc-400 line-through">
                    ${product.price}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    Save ${product.price - product.discountPrice}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-zinc-950">
                  ${product.price}
                </span>
              )}
            </div>
          </div>

          {/* Colorway Selector */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono uppercase">
                Colorway
              </span>
              <span className="font-bold text-zinc-900">{activeColor.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {product.colors.map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`px-3 py-2 rounded-xl border text-xs font-sans font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedColorIdx === idx
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono uppercase">Select Size</span>
                <div className="inline-flex rounded-md bg-zinc-100 p-0.5 text-[10px] font-mono">
                  {(['US', 'EU', 'UK'] as const).map((sys) => (
                    <button
                      key={sys}
                      type="button"
                      onClick={() => onChangeSizeSystem(sys)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        sizeSystem === sys
                          ? 'bg-zinc-900 text-white font-bold'
                          : 'text-zinc-600'
                      }`}
                    >
                      {sys}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Chart</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => {
                const label =
                  sizeSystem === 'EU' ? s.eu : sizeSystem === 'UK' ? s.uk : s.us;
                const isSelected = selectedSizeUs === s.us;
                return (
                  <button
                    key={s.us}
                    type="button"
                    disabled={!s.inStock}
                    onClick={() => setSelectedSizeUs(s.us)}
                    className={`py-2.5 rounded-xl font-mono text-xs tabular-nums border transition-all ${
                      !s.inStock
                        ? 'bg-zinc-100 border-zinc-200 text-zinc-300 line-through cursor-not-allowed'
                        : isSelected
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm cursor-pointer'
                          : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-900 cursor-pointer'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add to Bag + Buy Now + Ask on WhatsApp */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="inline-flex items-center h-12 rounded-xl border border-zinc-300 bg-zinc-50 px-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-mono text-sm font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={addStatus === 'adding'}
                className={`flex-1 h-12 px-4 rounded-xl font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
                  addStatus === 'added'
                    ? 'bg-emerald-600 text-white'
                    : addStatus === 'adding'
                      ? 'bg-zinc-800 text-white'
                      : 'bg-zinc-950 hover:bg-blue-600 text-white'
                }`}
              >
                {addStatus === 'adding' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Adding...</span>
                  </>
                ) : addStatus === 'added' ? (
                  <>
                    <Check className="w-4 h-4 shrink-0" />
                    <span>✓ Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0 ${
                  isWishlisted
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-zinc-300 hover:border-zinc-900 text-zinc-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                onBuyNow(product, selectedSizeUs, activeColor.name, quantity)
              }
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current shrink-0" />
              <span>
                Buy Now — $
                {((product.discountPrice ?? product.price) * quantity).toLocaleString()}
              </span>
            </button>

            {/* Product-Specific WhatsApp Contact Button */}
            <a
              href={buildProductWhatsAppUrl(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 active:scale-[0.98] border border-emerald-200 text-emerald-900 font-sans font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Ask on WhatsApp about {product.name.split(' ')[0]}</span>
            </a>
          </div>

          {/* Tabbed Details */}
          <div className="pt-4 border-t border-zinc-200 space-y-4">
            <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 pb-2">
              {(
                [
                  { id: 'description', label: 'Architecture' },
                  { id: 'materials', label: 'Materials & Specs' },
                  { id: 'shipping', label: 'Shipping & Returns' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveInfoTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-colors cursor-pointer ${
                    activeInfoTab === tab.id
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeInfoTab === 'description' && (
              <p className="text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {activeInfoTab === 'materials' && (
              <ul className="space-y-2 text-xs text-zinc-700">
                {product.materials.map((mat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeInfoTab === 'shipping' && (
              <div className="space-y-3 text-xs text-zinc-600">
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                  <p>{product.shippingInfo}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <RotateCcw className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                  <p>{product.returnInfo}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="pt-8 sm:pt-12 border-t border-zinc-200/80 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-zinc-950">
              Verified Collector Reviews ({combinedReviews.length})
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Real feedback on platform comfort, sizing accuracy, and street presence.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-sans font-bold hover:bg-blue-600 transition-colors cursor-pointer self-start"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 space-y-4 max-w-2xl"
          >
            <h3 className="font-display text-base font-bold text-zinc-950">
              Submit Your Review for {product.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="Your Full Name"
                className="h-10 px-3 rounded-lg border border-zinc-300 text-xs"
              />
              <input
                type="text"
                value={reviewCity}
                onChange={(e) => setReviewCity(e.target.value)}
                placeholder="Role & City (e.g. Architect · Chicago)"
                className="h-10 px-3 rounded-lg border border-zinc-300 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <input
                type="text"
                required
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Review Headline"
                className="h-10 px-3 rounded-lg border border-zinc-300 text-xs"
              />
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-600">Rating:</span>
                {[5, 4, 3].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReviewRating(r)}
                    className={`px-2.5 py-1 rounded border font-mono cursor-pointer ${
                      reviewRating === r
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {r} ★
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={3}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share how the sole height feels, comfort on long walks, and styling notes..."
              className="w-full p-3 rounded-lg border border-zinc-300 text-xs"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 cursor-pointer"
            >
              Publish Verified Review
            </button>
          </form>
        )}

        {combinedReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 text-sm text-zinc-600">
            Rated {product.rating.toFixed(1)} / 5 across {product.reviewsCount} verified purchases. Be the first to write a detailed commentary for this colorway.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {combinedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono text-zinc-400">{rev.date}</span>
                </div>
                <h4 className="font-display text-base font-bold text-zinc-950">
                  “{rev.title}”
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {rev.comment}
                </p>
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900">
                    {rev.author} · <span className="font-normal text-zinc-500">{rev.roleOrCity}</span>
                  </span>
                  <span className="font-mono text-emerald-700">{rev.fitFeedback}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products Grid (1-column on mobile -> sm:2 -> lg:3 -> xl:4) */}
      <div className="pt-8 sm:pt-12 border-t border-zinc-200/80 space-y-6">
        <h2 className="font-display text-2xl font-bold text-zinc-950">
          Complementary High-Sole Silhouettes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard
              key={rel.id}
              product={rel}
              isWishlisted={wishlist.includes(rel.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onSelectProduct={onSelectProduct}
              sizeSystem={sizeSystem}
            />
          ))}
        </div>
      </div>

      {/* Recently Viewed Products (1-column on mobile -> sm:2 -> lg:3 -> xl:4) */}
      {recentlyViewedProducts.length > 0 && (
        <div className="pt-8 sm:pt-12 border-t border-zinc-200/80 space-y-6">
          <h2 className="font-display text-2xl font-bold text-zinc-950">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {recentlyViewedProducts.map((recent) => (
              <ProductCard
                key={recent.id}
                product={recent}
                isWishlisted={wishlist.includes(recent.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onSelectProduct={onSelectProduct}
                sizeSystem={sizeSystem}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
