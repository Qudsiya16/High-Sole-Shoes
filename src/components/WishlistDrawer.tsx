import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types/shoe';
import { ResilientImage } from './ResilientImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onToggleWishlist: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  onSelectProduct: (slug: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onToggleWishlist,
  onMoveToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const savedProducts = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs">
      <div className="w-full max-w-full sm:max-w-md bg-[#F9F9F8] h-full flex flex-col justify-between shadow-2xl sm:border-l border-zinc-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 bg-white border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <h2 className="font-display text-base sm:text-lg font-bold text-zinc-950">
              Saved Wishlist ({savedProducts.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="w-9 h-9 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-200/70 flex items-center justify-center text-zinc-500">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-zinc-950">
                  No saved silhouettes yet
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Tap the heart icon on any high-sole sneaker to curate your personal rotation.
                </p>
              </div>
            </div>
          ) : (
            savedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-zinc-200/80 p-4 flex gap-4 items-center"
              >
                <div
                  onClick={() => {
                    onSelectProduct(product.slug);
                    onClose();
                  }}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0 cursor-pointer"
                >
                  <ResilientImage
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      onClick={() => {
                        onSelectProduct(product.slug);
                        onClose();
                      }}
                      className="font-display text-sm font-bold text-zinc-950 truncate cursor-pointer hover:text-blue-600"
                    >
                      {product.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="text-zinc-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-500 mt-0.5">
                    {product.category} · {product.soleHeightMm}mm Stack
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-zinc-950 tabular-nums">
                      ${product.discountPrice ?? product.price}
                    </span>

                    <button
                      type="button"
                      onClick={() => onMoveToCart(product)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-settling cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t border-zinc-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
