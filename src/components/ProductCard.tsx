import React, { useState } from 'react';
import {
  Heart,
  Eye,
  ShoppingBag,
  Star,
  Check,
  Loader2,
} from 'lucide-react';
import { Product } from '../types/shoe';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, sizeUs: number, colorName: string) => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (slug: string) => void;
  sizeSystem?: 'US' | 'EU' | 'UK';
}

/**
 * Premium Fashion E-Commerce Product Card:
 * Order:
 * 1. Product image (4:3, never distorted, 1:1 matched shoe & model)
 * 2. Product badges
 * 3. Wishlist icon (touch-friendly)
 * 4. Product name
 * 5. Rating
 * 6. Price
 * 7. Color options
 * 8. Full-Width "Add to Bag" button with Normal -> Adding... -> ✓ Added to Bag states
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onSelectProduct,
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [manualView, setManualView] = useState<
    'auto' | 'front' | 'model' | 'side' | 'detail'
  >('auto');
  const [addStatus, setAddStatus] = useState<'idle' | 'adding' | 'added'>(
    'idle'
  );
  const [heartPulse, setHeartPulse] = useState(false);

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];

  // Strict 1:1 visual consistency: activeColor provides both the exact shoeImage and exact modelImage
  const shoeImage = activeColor?.shoeImage || product.images[0];
  const modelImage = activeColor?.modelImage || product.modelImage;

  const firstAvailableSize =
    product.sizes.find((s) => s.inStock)?.us || product.sizes[0].us;

  const badgeLabel = product.isLimited
    ? 'Limited Edition'
    : product.isNew
      ? 'New Arrival'
      : product.isBestSeller
        ? 'Best Seller'
        : product.isTrending
          ? 'Trending'
          : null;

  const discountPct = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : null;

  const effectiveView =
    manualView !== 'auto' ? manualView : isHovered ? 'model' : 'front';

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (addStatus !== 'idle') return;
    setAddStatus('adding');
    setTimeout(() => {
      onAddToCart(product, firstAvailableSize, activeColor.name);
      setAddStatus('added');
      setTimeout(() => {
        setAddStatus('idle');
      }, 1500);
    }, 280);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartPulse(true);
    onToggleWishlist(product.id);
    setTimeout(() => setHeartPulse(false), 350);
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setManualView('auto');
      }}
      onClick={() => onSelectProduct(product.slug)}
      className="group relative w-full max-w-full bg-white hover:bg-[#FAFAFC] rounded-2xl border border-zinc-200/90 hover:border-zinc-300 transition-all duration-400 ease-out sm:hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-zinc-950/10 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* 1. Product Image Container (4:3 uniform aspect ratio, never distorted) */}
      <div className="relative aspect-[4/3] w-full bg-[#F2F2F6] group-hover:bg-[#EAEAF2] transition-colors duration-400 overflow-hidden">
        {/* Layer 1: Product Shoe Image */}
        <div
          className={`absolute inset-0 transition-all duration-400 ease-out ${
            effectiveView === 'model'
              ? 'opacity-0 scale-105'
              : 'opacity-100 group-hover:scale-105'
          }`}
        >
          <ResilientImage
            src={shoeImage}
            alt={`${product.name} in ${activeColor.name} — ${effectiveView} view`}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              effectiveView === 'side'
                ? 'scale-115 object-right'
                : effectiveView === 'detail'
                  ? 'scale-135 object-bottom'
                  : 'object-center'
            }`}
          />
        </div>

        {/* Layer 2: Model Wearing THIS Exact Same Shoe */}
        <div
          className={`absolute inset-0 transition-all duration-400 ease-out ${
            effectiveView === 'model'
              ? 'opacity-100 scale-103'
              : 'opacity-0 scale-100 pointer-events-none'
          }`}
        >
          <ResilientImage
            src={modelImage}
            alt={`Model ${product.modelName} wearing the exact ${product.name} in ${activeColor.name}`}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute bottom-12 left-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-mono text-emerald-300">
            On Model: {product.modelName}
          </span>
        </div>

        {/* 2. Product Badges + 3. Wishlist Icon */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-1.5">
            {badgeLabel && (
              <span className="px-2.5 py-1 rounded-md bg-zinc-950/90 backdrop-blur-xs text-[11px] font-sans font-bold text-white tracking-wide">
                {badgeLabel}
              </span>
            )}
            {discountPct && (
              <span className="px-2 py-1 rounded-md bg-blue-600 text-[11px] font-mono font-bold text-white">
                -{discountPct}%
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Save ${product.name} to wishlist`
            }
            className={`pointer-events-auto w-10 h-10 rounded-full bg-white/95 hover:bg-white active:scale-95 backdrop-blur-xs flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 cursor-pointer ${
              heartPulse ? 'scale-125' : ''
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-300 ${
                isWishlisted
                  ? 'fill-red-500 text-red-500 scale-110'
                  : 'text-zinc-700 hover:text-red-500'
              }`}
            />
          </button>
        </div>

        {/* Image Bottom Overlay Controls: 4-Angle View Switcher (Front, Model, Side, Sole) + Quick View */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-350 ease-out z-20"
        >
          <div className="inline-flex p-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300">
            {(
              [
                { id: 'front', label: 'Shoe' },
                { id: 'model', label: 'Model' },
                { id: 'side', label: 'Side' },
                { id: 'detail', label: 'Sole' },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setManualView(v.id)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  effectiveView === v.id
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'hover:text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            aria-label={`Quick view ${product.name}`}
            className="px-2.5 py-1.5 rounded-lg bg-white/95 hover:bg-blue-600 text-zinc-950 hover:text-white text-xs font-sans font-bold shadow-lg flex items-center gap-1 transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Body: Spacious, Clean, Structured Order */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* 4. Product Name */}
          <h3 className="font-display text-lg sm:text-[18px] font-bold text-zinc-950 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          {/* 5. Rating & Unboxed Elevation Metadata */}
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5 font-mono text-zinc-800 tabular-nums">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span className="font-bold">{product.rating.toFixed(1)}</span>
              <span className="text-zinc-400">({product.reviewsCount})</span>
            </div>

            <div className="flex items-center gap-1.5 truncate text-zinc-600">
              <span className="capitalize font-medium">{product.gender}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-semibold text-zinc-800">
                {product.soleHeightMm}mm
              </span>
            </div>
          </div>

          {/* 6. Price */}
          <div className="flex items-baseline gap-2.5 font-mono tabular-nums pt-0.5">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-zinc-950">
                  ${product.discountPrice}
                </span>
                <span className="text-xs text-zinc-400 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-zinc-950">
                ${product.price}
              </span>
            )}
          </div>

          {/* 7. Color Options (Updates both shoe image and matching model image!) */}
          <div
            className="flex items-center gap-2 pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                aria-label={`Select color ${color.name}`}
                title={`${color.name} (Updates shoe & model)`}
                className={`w-5 h-5 rounded-full border transition-all duration-200 cursor-pointer shrink-0 ${
                  selectedColorIdx === idx
                    ? 'scale-115 ring-2 ring-offset-1 ring-zinc-950 border-white'
                    : 'border-zinc-300 hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            <span className="text-xs text-zinc-500 ml-1 truncate">
              {activeColor.name}
            </span>
          </div>
        </div>

        {/* 8. Full-Width Premium "Add to Bag" Button (Normal -> Adding... -> ✓ Added to Bag) */}
        <button
          type="button"
          onClick={handleAddToBag}
          disabled={addStatus === 'adding'}
          className={`w-full py-3 px-4 rounded-xl font-sans text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
            addStatus === 'added'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : addStatus === 'adding'
                ? 'bg-zinc-800 text-white opacity-90'
                : 'bg-zinc-950 hover:bg-blue-600 text-white shadow-sm hover:shadow-lg hover:shadow-blue-600/20'
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
      </div>
    </article>
  );
};
