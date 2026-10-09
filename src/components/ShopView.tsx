import React, { useMemo, useState } from 'react';
import {
  SlidersHorizontal,
  Search,
  X,
  RotateCcw,
  Star,
  ArrowUpDown,
} from 'lucide-react';
import { FilterState, Product } from '../types/shoe';
import { ProductCard } from './ProductCard';

interface ShopViewProps {
  products: Product[];
  initialGender?: 'all' | 'men' | 'women' | 'unisex';
  initialCategory?: string;
  initialBadge?: FilterState['badgeFilter'];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, sizeUs: number, colorName: string) => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (slug: string) => void;
  sizeSystem: 'US' | 'EU' | 'UK';
  onChangeSizeSystem: (sys: 'US' | 'EU' | 'UK') => void;
  recentSearches: string[];
  onRecordSearch: (term: string) => void;
  titleOverride?: string;
  subtitleOverride?: string;
  embedded?: boolean;
}

const CATEGORY_PILLS = [
  { id: 'All', label: 'All Silhouettes' },
  { id: 'High-Sole Sneakers', label: 'High Sole' },
  { id: 'Platform Sneakers', label: 'Platform' },
  { id: 'Chunky Sneakers', label: 'Chunky' },
  { id: 'Streetwear Sneakers', label: 'Sneakers' },
  { id: 'Casual Shoes', label: 'Casual' },
  { id: 'Running-Inspired Shoes', label: 'Running-Inspired' },
  { id: 'Limited Edition', label: 'Limited Edition' },
];

const COLOR_FAMILIES = [
  { label: 'Cobalt Blue', hex: '#2563EB', match: 'cobalt' },
  { label: 'Ultraviolet', hex: '#7C3AED', match: 'violet|lilac' },
  { label: 'Crimson Red', hex: '#DC2626', match: 'crimson|scarlet' },
  { label: 'Terracotta', hex: '#EA580C', match: 'terracotta' },
  { label: 'Emerald', hex: '#059669', match: 'emerald' },
  { label: 'Mustard Ochre', hex: '#D97706', match: 'ochre' },
];

const AVAILABLE_US_SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12];

/**
 * Responsive Filter Bar + 1-Column Mobile / 4-Column Desktop Product Grid:
 * - Desktop: Horizontal Sticky Bar (Gender | Category | Size | Color | Price | Rating | Sort)
 * - Mobile: [ Filter ] [ Sort ] Bar + Slide-Out Filter Drawer (Gender, Category, Size, Color, Price, Rating + Apply Filters & Clear All)
 * - Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
 */
export const ShopView: React.FC<ShopViewProps> = ({
  products,
  initialGender = 'all',
  initialCategory = 'All',
  initialBadge = 'all',
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onSelectProduct,
  sizeSystem,
  onChangeSizeSystem,
  titleOverride,
  subtitleOverride,
  embedded = false,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    gender: initialGender,
    category: initialCategory || 'All',
    searchQuery: '',
    priceRange: [150, 400],
    selectedSizeUs: null,
    selectedColor: null,
    minRating: null,
    badgeFilter: initialBadge,
    sortBy: 'featured',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      gender: initialGender,
      category: initialCategory || 'All',
      badgeFilter: initialBadge,
    }));
  }, [initialGender, initialCategory, initialBadge]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (filters.gender !== 'all' && product.gender !== filters.gender) {
          return false;
        }
        if (
          filters.category !== 'All' &&
          product.category !== filters.category
        ) {
          return false;
        }
        if (filters.badgeFilter === 'trending' && !product.isTrending) {
          return false;
        }
        if (filters.badgeFilter === 'new' && !product.isNew) {
          return false;
        }
        if (filters.badgeFilter === 'bestseller' && !product.isBestSeller) {
          return false;
        }
        if (filters.badgeFilter === 'limited' && !product.isLimited) {
          return false;
        }

        const effectivePrice = product.discountPrice ?? product.price;
        if (
          effectivePrice < filters.priceRange[0] ||
          effectivePrice > filters.priceRange[1]
        ) {
          return false;
        }

        if (filters.selectedSizeUs !== null) {
          const sizeObj = product.sizes.find(
            (s) => s.us === filters.selectedSizeUs && s.inStock
          );
          if (!sizeObj) return false;
        }

        if (filters.selectedColor) {
          const regex = new RegExp(filters.selectedColor, 'i');
          const matchesColor = product.colors.some((c) => regex.test(c.name));
          if (!matchesColor) return false;
        }

        if (filters.minRating !== null && product.rating < filters.minRating) {
          return false;
        }

        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const searchable =
            `${product.name} ${product.category} ${product.description} ${product.editorialTagline} ${product.soleHeightMm}mm`.toLowerCase();
          if (!searchable.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;
        if (filters.sortBy === 'price-asc') return priceA - priceB;
        if (filters.sortBy === 'price-desc') return priceB - priceA;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'sole-height')
          return b.soleHeightMm - a.soleHeightMm;
        return 0;
      });
  }, [products, filters]);

  const clearAllFilters = () => {
    setFilters({
      gender: 'all',
      category: 'All',
      searchQuery: '',
      priceRange: [150, 400],
      selectedSizeUs: null,
      selectedColor: null,
      minRating: null,
      badgeFilter: 'all',
      sortBy: 'featured',
    });
  };

  // Build active filter chips for instant removal
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (filters.gender !== 'all') {
    activeChips.push({
      label: `Gender: ${filters.gender.toUpperCase()}`,
      onRemove: () => setFilters((p) => ({ ...p, gender: 'all' })),
    });
  }
  if (filters.category !== 'All') {
    activeChips.push({
      label: `Category: ${filters.category}`,
      onRemove: () => setFilters((p) => ({ ...p, category: 'All' })),
    });
  }
  if (filters.badgeFilter !== 'all') {
    activeChips.push({
      label: `Tier: ${filters.badgeFilter.toUpperCase()}`,
      onRemove: () => setFilters((p) => ({ ...p, badgeFilter: 'all' })),
    });
  }
  if (filters.selectedSizeUs !== null) {
    activeChips.push({
      label: `Size: US ${filters.selectedSizeUs}`,
      onRemove: () => setFilters((p) => ({ ...p, selectedSizeUs: null })),
    });
  }
  if (filters.selectedColor !== null) {
    const colorName =
      COLOR_FAMILIES.find((c) => c.match === filters.selectedColor)?.label ||
      filters.selectedColor;
    activeChips.push({
      label: `Color: ${colorName}`,
      onRemove: () => setFilters((p) => ({ ...p, selectedColor: null })),
    });
  }
  if (filters.priceRange[1] < 400) {
    activeChips.push({
      label: `Max Price: $${filters.priceRange[1]}`,
      onRemove: () => setFilters((p) => ({ ...p, priceRange: [150, 400] })),
    });
  }
  if (filters.minRating !== null) {
    activeChips.push({
      label: `Rating: ${filters.minRating}+ ★`,
      onRemove: () => setFilters((p) => ({ ...p, minRating: null })),
    });
  }

  return (
    <section
      className={`${
        embedded ? 'py-10 sm:py-16 lg:py-20' : 'py-8 sm:py-12 lg:py-14'
      } max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6`}
    >
      {/* Section Heading & Search Input */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider mb-1.5">
            <span>HIGH-SOLE CATALOG</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-bold">
              {filteredProducts.length} OF {products.length} MODELS
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-zinc-950 tracking-tight text-balance">
            {titleOverride ||
              (filters.gender === 'men'
                ? "Men's High-Sole & Chunky Collection"
                : filters.gender === 'women'
                  ? "Women's Platform & High-Sole Collection"
                  : 'High-Sole & Platform Collection')}
          </h2>
          {subtitleOverride && (
            <p className="text-sm text-zinc-600 mt-1.5 max-w-2xl">
              {subtitleOverride}
            </p>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            placeholder="Search model, 62mm, crimson..."
            className="w-full h-11 pl-10 pr-8 rounded-xl bg-white border border-zinc-300 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({ ...prev, searchQuery: '' }))
              }
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* MOBILE (< lg): Compact [ Filter ] [ Sort ] Control Bar */}
      <div className="lg:hidden grid grid-cols-2 gap-2.5 w-full">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="h-11 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] text-white font-sans text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          <span>Filter</span>
          {activeChips.length > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[10px] font-mono tabular-nums">
              {activeChips.length}
            </span>
          )}
        </button>

        <div className="relative flex items-center w-full">
          <ArrowUpDown className="w-4 h-4 text-zinc-600 absolute left-3.5 pointer-events-none" />
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                sortBy: e.target.value as FilterState['sortBy'],
              }))
            }
            aria-label="Sort products"
            className="w-full h-11 pl-9 pr-4 rounded-xl bg-white border border-zinc-300 text-zinc-900 font-sans text-xs font-bold cursor-pointer focus:outline-none focus:border-blue-600"
          >
            <option value="featured">Sort: Featured</option>
            <option value="sole-height">Sort: 64mm → 50mm</option>
            <option value="price-asc">Sort: Price Low-High</option>
            <option value="price-desc">Sort: Price High-Low</option>
            <option value="rating">Sort: Highest Rated</option>
          </select>
        </div>
      </div>

      {/* DESKTOP (lg+): Sticky Horizontal Filter Bar: Gender | Category | Size | Color | Price | Rating | Sort */}
      <div className="hidden lg:block sticky top-16 z-30 bg-white/95 backdrop-blur-xl rounded-2xl border border-zinc-200/90 shadow-lg shadow-zinc-950/5 p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* 1. Gender */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'men', label: 'Men' },
                { id: 'women', label: 'Women' },
                { id: 'unisex', label: 'Unisex' },
              ] as const
            ).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setFilters((p) => ({ ...p, gender: g.id }))}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filters.gender === g.id
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* 2. Category */}
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((p) => ({ ...p, category: e.target.value }))
            }
            aria-label="Filter by category"
            className="h-9 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200/70 text-xs font-sans font-bold text-zinc-800 cursor-pointer focus:outline-none"
          >
            {CATEGORY_PILLS.map((c) => (
              <option key={c.id} value={c.id}>
                Category: {c.label}
              </option>
            ))}
          </select>

          {/* 3. Size */}
          <select
            value={filters.selectedSizeUs ?? ''}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                selectedSizeUs: e.target.value ? Number(e.target.value) : null,
              }))
            }
            aria-label="Filter by shoe size"
            className="h-9 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200/70 text-xs font-mono font-semibold text-zinc-800 cursor-pointer focus:outline-none"
          >
            <option value="">Size: Any ({sizeSystem})</option>
            {AVAILABLE_US_SIZES.map((sz) => (
              <option key={sz} value={sz}>
                US {sz} (EU {Math.round(sz + 32.5)})
              </option>
            ))}
          </select>

          {/* 4. Color Swatch Bar */}
          <div className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-zinc-100">
            <span className="text-xs font-sans font-bold text-zinc-600 mr-1">
              Color:
            </span>
            {COLOR_FAMILIES.map((col) => {
              const isSelected = filters.selectedColor === col.match;
              return (
                <button
                  key={col.label}
                  type="button"
                  onClick={() =>
                    setFilters((p) => ({
                      ...p,
                      selectedColor: isSelected ? null : col.match,
                    }))
                  }
                  title={col.label}
                  className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                    isSelected
                      ? 'scale-125 ring-2 ring-zinc-950 border-white'
                      : 'border-white/60 hover:scale-110'
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              );
            })}
          </div>

          {/* 5. Price */}
          <select
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                priceRange: [150, Number(e.target.value)],
              }))
            }
            aria-label="Filter by maximum price"
            className="h-9 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200/70 text-xs font-mono font-semibold text-zinc-800 cursor-pointer focus:outline-none"
          >
            <option value={400}>Price: All ($199–$360)</option>
            <option value={250}>Under $250</option>
            <option value={280}>Under $280</option>
            <option value={320}>Under $320</option>
          </select>

          {/* 6. Rating */}
          <button
            type="button"
            onClick={() =>
              setFilters((p) => ({
                ...p,
                minRating: p.minRating === 4.9 ? null : 4.9,
              }))
            }
            className={`h-9 px-3 rounded-xl text-xs font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              filters.minRating === 4.9
                ? 'bg-zinc-950 text-white'
                : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200/70'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Rating: 4.9+</span>
          </button>

          {/* 7. Sort By */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  sortBy: e.target.value as FilterState['sortBy'],
                }))
              }
              aria-label="Sort products"
              className="h-9 pl-8 pr-6 rounded-xl bg-zinc-950 text-white text-xs font-sans font-bold cursor-pointer focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="sole-height">Sole Height: 64mm → 50mm</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Quick Category Strip */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {CATEGORY_PILLS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() =>
                  setFilters((p) => ({ ...p, category: pill.id }))
                }
                className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filters.category === pill.id
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-zinc-500 shrink-0 tabular-nums">
            Showing {filteredProducts.length} results
          </span>
        </div>
      </div>

      {/* Active Filter Chips Row + Clear Filters */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono uppercase text-zinc-400">
            Active Filters:
          </span>
          {activeChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={chip.onRemove}
              className="px-3 py-1 rounded-lg bg-zinc-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-red-600 transition-colors cursor-pointer"
            >
              <span>{chip.label}</span>
              <X className="w-3 h-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-3 py-1 rounded-lg border border-zinc-300 hover:border-zinc-900 text-xs font-bold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Product Grid: 1 Product Per Row on Mobile (grid-cols-1) -> sm:grid-cols-2 -> lg:grid-cols-3 -> xl:grid-cols-4 */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 sm:p-12 text-center space-y-4">
          <p className="font-display text-lg sm:text-xl font-bold text-zinc-900">
            No high-sole models match your exact filter combination.
          </p>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Clear one or more active filters to view our full range of 50mm–64mm platform silhouettes.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onSelectProduct={onSelectProduct}
              sizeSystem={sizeSystem}
            />
          ))}
        </div>
      )}

      {/* Mobile Slide-Out Filter Drawer (Includes Gender, Category, Size, Color, Price, Rating + Apply Filters & Clear All) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-full sm:max-w-sm bg-white h-full overflow-y-auto p-5 sm:p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-200">
                <h3 className="font-display text-lg font-bold text-zinc-950">
                  Filter Shoes ({filteredProducts.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Close filters"
                  className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Gender */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-zinc-500">
                  1. Gender
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['all', 'men', 'women', 'unisex'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFilters((p) => ({ ...p, gender: g }))}
                      className={`py-2.5 rounded-xl text-xs font-sans font-bold capitalize border cursor-pointer ${
                        filters.gender === g
                          ? 'bg-zinc-950 text-white border-zinc-950'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Category */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-zinc-500">
                  2. Category
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_PILLS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() =>
                        setFilters((p) => ({ ...p, category: c.id }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                        filters.category === c.id
                          ? 'bg-zinc-950 text-white border-zinc-950'
                          : 'bg-white text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-zinc-500">
                    3. Size
                  </span>
                  <div className="inline-flex gap-1">
                    {(['US', 'EU', 'UK'] as const).map((sys) => (
                      <button
                        key={sys}
                        type="button"
                        onClick={() => onChangeSizeSystem(sys)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          sizeSystem === sys
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {sys}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {AVAILABLE_US_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          selectedSizeUs: p.selectedSizeUs === sz ? null : sz,
                        }))
                      }
                      className={`py-2 rounded-lg font-mono text-xs border cursor-pointer ${
                        filters.selectedSizeUs === sz
                          ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                          : 'bg-white text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Color */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-zinc-500">
                  4. Color
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_FAMILIES.map((col) => (
                    <button
                      key={col.label}
                      type="button"
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          selectedColor:
                            p.selectedColor === col.match ? null : col.match,
                        }))
                      }
                      className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer ${
                        filters.selectedColor === col.match
                          ? 'bg-zinc-950 text-white border-zinc-950'
                          : 'bg-white text-zinc-700 border-zinc-200'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="truncate">{col.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Price */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-zinc-500">
                  5. Price Range
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { max: 400, label: 'All Prices' },
                    { max: 250, label: 'Under $250' },
                    { max: 280, label: 'Under $280' },
                    { max: 320, label: 'Under $320' },
                  ].map((pr) => (
                    <button
                      key={pr.max}
                      type="button"
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          priceRange: [150, pr.max],
                        }))
                      }
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border cursor-pointer ${
                        filters.priceRange[1] === pr.max
                          ? 'bg-zinc-950 text-white border-zinc-950'
                          : 'bg-white text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Rating */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-zinc-500">
                  6. Minimum Rating
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: null, label: 'All Ratings' },
                    { val: 4.9, label: '4.9 ★ & Above' },
                  ].map((rt) => (
                    <button
                      key={rt.label}
                      type="button"
                      onClick={() =>
                        setFilters((p) => ({ ...p, minRating: rt.val }))
                      }
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border cursor-pointer ${
                        filters.minRating === rt.val
                          ? 'bg-zinc-950 text-white border-zinc-950'
                          : 'bg-white text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {rt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Clear All & Apply Filters */}
            <div className="pt-5 mt-5 border-t border-zinc-200 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="py-3 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-800 hover:bg-zinc-100 cursor-pointer"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
