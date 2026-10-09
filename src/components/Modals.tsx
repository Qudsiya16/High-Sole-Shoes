import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  ArrowUpRight,
  Search,
  Ruler,
  Check,
} from 'lucide-react';
import { Product } from '../types/shoe';
import { ResilientImage } from './ResilientImage';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, sizeUs: number, colorName: string) => void;
  onSelectProduct: (slug: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSizeUs, setSelectedSizeUs] = useState<number>(9);
  const [showOnModel, setShowOnModel] = useState(false);
  const [added, setAdded] = useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedColorIdx(0);
      setShowOnModel(false);
      setSelectedSizeUs(
        product.sizes.find((s) => s.inStock)?.us || product.sizes[0].us
      );
      setAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];
  const displayImg = showOnModel
    ? activeColor.modelImage || product.modelImage
    : activeColor.shoeImage || product.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-200 grid grid-cols-1 md:grid-cols-12">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-zinc-100 flex items-center justify-center text-zinc-700 shadow-sm cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="md:col-span-6 aspect-[4/3] md:aspect-auto bg-[#F3F2EE] relative">
          <ResilientImage
            src={displayImg}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950/85 text-white font-mono text-[11px]">
              {product.soleHeightMm}mm Stack
            </span>
            <button
              type="button"
              onClick={() => setShowOnModel(!showOnModel)}
              className="px-2.5 py-1 rounded-lg bg-white/95 text-zinc-950 font-display text-xs font-semibold shadow-sm cursor-pointer"
            >
              {showOnModel ? 'View Studio Shoe' : `View on ${product.modelName}`}
            </button>
          </div>
        </div>

        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="capitalize">{product.gender}</span>
              <span>·</span>
              <span>{product.category}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 font-mono text-zinc-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
            </div>

            <h2 className="font-display text-2xl font-extrabold text-zinc-950">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-2.5 font-mono tabular-nums">
              <span className="text-xl font-bold text-zinc-950">
                ${product.discountPrice ?? product.price}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-zinc-400 line-through">
                  ${product.price}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Color Picker */}
            <div className="pt-2 space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-zinc-400">
                Color: {activeColor.name}
              </span>
              <div className="flex gap-2">
                {product.colors.map((c, idx) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                      selectedColorIdx === idx
                        ? 'ring-2 ring-offset-1 ring-zinc-950 border-white'
                        : 'border-zinc-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Picker */}
            <div className="pt-1 space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-zinc-400">
                US Size
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {product.sizes.slice(0, 10).map((s) => (
                  <button
                    key={s.us}
                    type="button"
                    disabled={!s.inStock}
                    onClick={() => setSelectedSizeUs(s.us)}
                    className={`py-1.5 rounded-lg font-mono text-xs border ${
                      !s.inStock
                        ? 'bg-zinc-100 text-zinc-300 line-through cursor-not-allowed'
                        : selectedSizeUs === s.us
                          ? 'bg-zinc-950 text-white border-zinc-950 font-bold cursor-pointer'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-500 cursor-pointer'
                    }`}
                  >
                    {s.us}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                onAddToCart(product, selectedSizeUs, activeColor.name);
                setAdded(true);
                setTimeout(() => setAdded(false), 1200);
              }}
              className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-settling cursor-pointer ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag — US {selectedSizeUs}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectProduct(product.slug);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl border border-zinc-200 hover:border-zinc-900 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Full Architectural Specs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SearchOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  recentSearches: string[];
  onRecordSearch: (term: string) => void;
  onSelectProduct: (slug: string) => void;
}

export const SearchOverlayModal: React.FC<SearchOverlayModalProps> = ({
  isOpen,
  onClose,
  products,
  recentSearches,
  onRecordSearch,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchingProducts = query.trim()
    ? products.filter((p) =>
        `${p.name} ${p.category} ${p.editorialTagline} ${p.soleHeightMm}mm ${p.gender}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by model name, sole stack (62mm), color, or category..."
            className="flex-1 text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Searches */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase text-zinc-400">
            Popular &amp; Recent:
          </span>
          {recentSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-700 cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Instant Product Results */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {matchingProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                if (query.trim()) onRecordSearch(query);
                onSelectProduct(p.slug);
                onClose();
              }}
              className="p-3 rounded-2xl hover:bg-zinc-100 flex items-center justify-between gap-4 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-12 rounded-xl overflow-hidden bg-zinc-200 shrink-0">
                  <ResilientImage
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-sm font-bold text-zinc-950 truncate">
                    {p.name}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">
                    {p.gender.toUpperCase()} · {p.category} · {p.soleHeightMm}mm Stack
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-zinc-950 tabular-nums shrink-0">
                ${p.discountPrice ?? p.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const conversionRows = [
    { usMen: '7.5', usWomen: '6.0', eu: '38.5 / 40.5', uk: '5.5 / 6.5', cm: '24.5' },
    { usMen: '8.0', usWomen: '6.5', eu: '39.0 / 41.0', uk: '6.0 / 7.0', cm: '25.0' },
    { usMen: '8.5', usWomen: '7.0', eu: '40.0 / 42.0', uk: '6.5 / 7.5', cm: '25.5' },
    { usMen: '9.0', usWomen: '7.5', eu: '40.5 / 42.5', uk: '7.0 / 8.0', cm: '26.0' },
    { usMen: '9.5', usWomen: '8.0', eu: '41.0 / 43.0', uk: '7.5 / 8.5', cm: '26.5' },
    { usMen: '10.0', usWomen: '8.5', eu: '42.0 / 44.0', uk: '8.0 / 9.0', cm: '27.0' },
    { usMen: '10.5', usWomen: '9.0', eu: '42.5 / 44.5', uk: '8.5 / 9.5', cm: '27.5' },
    { usMen: '11.0', usWomen: '9.5', eu: '43.0 / 45.0', uk: '9.0 / 10.0', cm: '28.0' },
    { usMen: '12.0', usWomen: '10.5', eu: '44.5 / 46.0', uk: '10.0 / 11.0', cm: '29.0' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-600" />
            <h2 className="font-display text-lg font-bold text-zinc-950">
              ALTURA High-Sole Fit &amp; Conversion Matrix
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed">
          All ALTURA 50mm–64mm platform lasts are engineered true to standard US/EU sizing with an anatomical heel lock to prevent slip. If you are between half sizes or wear thick knit socks, we recommend selecting the next half size up.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs tabular-nums">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="py-2 pr-3">US Men</th>
                <th className="py-2 px-3">US Women</th>
                <th className="py-2 px-3">EU</th>
                <th className="py-2 px-3">UK</th>
                <th className="py-2 pl-3">Foot Length (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {conversionRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50">
                  <td className="py-2 pr-3 font-bold text-zinc-950">{row.usMen}</td>
                  <td className="py-2 px-3 font-bold text-zinc-950">{row.usWomen}</td>
                  <td className="py-2 px-3 text-zinc-600">{row.eu}</td>
                  <td className="py-2 px-3 text-zinc-600">{row.uk}</td>
                  <td className="py-2 pl-3 text-zinc-600">{row.cm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
