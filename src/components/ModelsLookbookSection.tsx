import React, { useState } from 'react';
import {
  Play,
  Move3d,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Eye,
  ShoppingBag,
  Footprints,
} from 'lucide-react';
import { Product } from '../types/shoe';
import { ResilientImage } from './ResilientImage';
import { VideoSection } from './VideoSection';
import { Sneaker3DViewer } from './Sneaker3DViewer';

interface ModelsLookbookSectionProps {
  products: Product[];
  onSelectProduct: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart?: (product: Product, sizeUs: number, colorName: string) => void;
}

type AnimationAction =
  | 'walking'
  | 'running'
  | 'turning'
  | 'jumping'
  | 'closeup-3d';

/**
 * Section 9: Animated Model Showcase — Strict 1:1 Shoe & Model Consistency
 * - Selecting ANY shoe updates:
 *   1. The Fashion Model photo wearing that exact shoe
 *   2. The Synchronized Kinetic Model Animation Rig wearing that exact shoe colorway & sole stack
 *   3. The Motion Video Reel of that exact shoe
 *   4. The 360° 3D Sneaker Model in that exact colorway
 */
export const ModelsLookbookSection: React.FC<ModelsLookbookSectionProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onAddToCart,
}) => {
  // Showcase 6 distinct flagship shoes covering all 6 colorways
  const showcaseShoes = products.slice(0, 6);

  const [selectedShoeIdx, setSelectedShoeIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [animAction, setAnimAction] = useState<AnimationAction>('walking');
  const [showVideoReel, setShowVideoReel] = useState(false);

  const activeProduct = showcaseShoes[selectedShoeIdx] || products[0];
  const activeColor =
    activeProduct.colors[selectedColorIdx] || activeProduct.colors[0];

  // 1:1 matched shoe & model images for the currently selected product + colorway
  const matchedShoeImage = activeColor.shoeImage || activeProduct.images[0];
  const matchedModelImage = activeColor.modelImage || activeProduct.modelImage;
  const primaryHex = activeColor.hex || '#2563EB';
  const accentHex = activeColor.accentHex || '#F8FAFC';

  const handleSelectShoe = (idx: number) => {
    setSelectedShoeIdx(idx);
    setSelectedColorIdx(0);
    setShowVideoReel(false);
  };

  return (
    <section className="w-full max-w-full overflow-hidden py-10 sm:py-16 lg:py-24 bg-[#0B0B0F] text-white border-y border-white/10">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header & Action Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-white/10 pb-5 sm:pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>1:1 SYNCHRONIZED MODEL &amp; SHOE SHOWCASE</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight text-balance">
              Animated Runway Models Wearing Your Exact Selection.
            </h2>
            <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
              Switch any sneaker or colorway below — the fashion model, animated stride rig, motion video, and 360° 3D model update together in strict 1:1 lockstep.
            </p>
          </div>

          {/* Animation Pose / Action Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-900 border border-white/10">
            {(
              [
                { id: 'walking', label: 'Walking' },
                { id: 'running', label: 'Running' },
                { id: 'turning', label: 'Turn' },
                { id: 'jumping', label: 'Jump' },
                { id: 'closeup-3d', label: '360° 3D' },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setAnimAction(mode.id);
                  setShowVideoReel(false);
                }}
                className={`px-3 py-2 rounded-xl font-sans text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  animAction === mode.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Selector Bar (6 Flagship High-Sole Shoes) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {showcaseShoes.map((shoe, idx) => {
            const isSelected = selectedShoeIdx === idx;
            const shoeHex = shoe.colors[0]?.hex || '#2563EB';
            return (
              <button
                key={shoe.id}
                type="button"
                onClick={() => handleSelectShoe(idx)}
                className={`group p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-blue-500 ring-2 ring-blue-500/30 -translate-y-0.5 shadow-xl'
                    : 'bg-zinc-900/50 border-white/10 hover:border-white/25 hover:bg-zinc-900'
                }`}
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-800 mb-2.5 relative">
                  <ResilientImage
                    src={shoe.images[0]}
                    alt={shoe.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-400"
                  />
                  <span
                    className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full border border-white"
                    style={{ backgroundColor: shoeHex }}
                  />
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  {shoe.soleHeightMm}MM · {shoe.gender.toUpperCase()}
                </div>
                <div className="font-display text-xs font-bold text-white truncate mt-0.5">
                  {shoe.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Synchronized Stage */}
        {animAction === 'closeup-3d' ? (
          <Sneaker3DViewer
            initialPresetId={activeColor.preset3dId}
            onSelectPresetProduct={() => onSelectProduct(activeProduct.slug)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 5 Cols: Fashion Model Wearing the Exact Selected Shoe + Motion Video Toggle */}
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/15 min-h-[440px] flex flex-col justify-between group">
              {showVideoReel ? (
                <VideoSection
                  posterSrc={matchedModelImage}
                  secondarySrc={matchedShoeImage}
                  title={`${activeProduct.modelName} in ${activeProduct.name}`}
                  subtitle={`${activeColor.name} · ${activeProduct.soleHeightMm}mm Stack`}
                  accentColor={primaryHex}
                  className="w-full h-full flex-1 rounded-none"
                />
              ) : (
                <div className="relative flex-1 overflow-hidden">
                  <ResilientImage
                    src={matchedModelImage}
                    alt={`Model ${activeProduct.modelName} wearing exact ${activeProduct.name} (${activeColor.name})`}
                    className={`w-full h-full object-cover object-top transition-transform duration-700 ${
                      animAction === 'walking'
                        ? 'scale-103 group-hover:scale-108'
                        : animAction === 'running'
                          ? 'scale-108 translate-x-1'
                          : animAction === 'jumping'
                            ? 'scale-105 -translate-y-2'
                            : 'scale-105'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                </div>
              )}

              {/* Top Overlay Badges */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-20">
                <span className="px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-emerald-400/40 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>EXACT SHOE ON MODEL</span>
                </span>

                <button
                  type="button"
                  onClick={() => setShowVideoReel(!showVideoReel)}
                  className="px-3 py-1.5 rounded-xl bg-black/65 hover:bg-blue-600 backdrop-blur-md border border-white/20 text-xs font-display font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{showVideoReel ? 'Editorial Photo' : 'Motion Video'}</span>
                </button>
              </div>

              {/* Bottom Model Info Overlay */}
              {!showVideoReel && (
                <div className="absolute bottom-5 inset-x-5 z-20 space-y-1">
                  <div className="text-xs font-mono text-zinc-300">
                    {activeProduct.modelName} · {activeProduct.modelHeightAndSize}
                  </div>
                  <div className="font-display text-xl font-bold text-white">
                    Wearing {activeProduct.name} ({activeColor.name})
                  </div>
                </div>
              )}
            </div>

            {/* Right 7 Cols: Synchronized Animated Fashion Model Stride Rig + Product Inspection Card */}
            <div className="lg:col-span-7 rounded-3xl bg-zinc-900/90 border border-white/15 p-6 sm:p-8 flex flex-col justify-between gap-6 relative overflow-hidden">
              <div
                className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-25 transition-colors duration-500"
                style={{ backgroundColor: primaryHex }}
              />

              {/* Top Row: Colorway Switcher & Active Animation Telemetry */}
              <div className="flex flex-wrap items-center justify-between gap-4 z-10">
                <div>
                  <span className="text-xs font-mono uppercase text-zinc-400">
                    ACTIVE SILHOUETTE &amp; COLORWAY SYNC
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white mt-0.5">
                    {activeProduct.name} — {activeColor.name}
                  </h3>
                </div>

                {/* Color Swatches that sync both Model & Animated Rig */}
                <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10">
                  <span className="text-xs font-mono text-zinc-400 mr-1">
                    Color:
                  </span>
                  {activeProduct.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      title={c.name}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColorIdx === idx
                          ? 'scale-120 border-white ring-2 ring-blue-500'
                          : 'border-white/40 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Center Interactive Stage: Animated On-Foot Model Rig + Exact Studio Shoe Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-black/45 rounded-2xl border border-white/10 p-5 z-10">
                {/* Animated Fashion Model Legs & Exact Matching High-Sole Sneakers SVG Rig */}
                <div className="sm:col-span-6 flex flex-col items-center justify-center">
                  <svg
                    viewBox="0 0 280 210"
                    className="w-full max-w-[260px] h-44 overflow-visible"
                    aria-label={`Animated model performing ${animAction} in ${activeProduct.name}`}
                  >
                    {/* Runway Floor Grid Line */}
                    <line
                      x1="15"
                      y1="184"
                      x2="265"
                      y2="184"
                      stroke="rgba(255,255,255,0.22)"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                    />

                    {/* Dynamic Ground Glow under Sneakers */}
                    <ellipse
                      cx="140"
                      cy="185"
                      rx="85"
                      ry="8"
                      fill={primaryHex}
                      opacity="0.28"
                    />

                    {/* Back Leg & Synchronized High-Sole Sneaker */}
                    <g
                      className={
                        animAction === 'running'
                          ? 'animate-stride'
                          : animAction === 'jumping'
                            ? 'animate-float-slow'
                            : 'animate-stride'
                      }
                      style={{
                        animationDuration:
                          animAction === 'running'
                            ? '0.85s'
                            : animAction === 'jumping'
                              ? '1.6s'
                              : '1.7s',
                      }}
                    >
                      {/* Tailored Wide-Leg Streetwear Trouser Leg (Back) */}
                      <path
                        d="M78 10 L62 118 L112 122 L118 10 Z"
                        fill="#1F1F26"
                        stroke="#3F3F46"
                        strokeWidth="2"
                      />
                      {/* Exact Matching Sneaker Upper (Back Foot) */}
                      <path
                        d="M58 148 L64 118 L98 120 L122 134 C132 136 136 142 136 148 Z"
                        fill={primaryHex}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      {/* Exact Triple-Stack High Sole (Back Foot) */}
                      <rect
                        x="54"
                        y="148"
                        width="86"
                        height="18"
                        rx="8"
                        fill="#F8FAFC"
                        stroke="#18181B"
                        strokeWidth="2"
                      />
                      <line
                        x1="56"
                        y1="156"
                        x2="138"
                        y2="156"
                        stroke={primaryHex}
                        strokeWidth="3.5"
                      />
                    </g>

                    {/* Front Leg & Synchronized High-Sole Sneaker */}
                    <g
                      className={
                        animAction === 'jumping'
                          ? 'animate-float-slow'
                          : 'animate-stride'
                      }
                      style={{
                        animationDuration:
                          animAction === 'running'
                            ? '0.85s'
                            : animAction === 'jumping'
                              ? '1.4s'
                              : '1.7s',
                        animationDelay: '0.4s',
                      }}
                    >
                      {/* Tailored Wide-Leg Streetwear Trouser Leg (Front) */}
                      <path
                        d="M148 10 L138 128 L194 132 L196 10 Z"
                        fill="#272730"
                        stroke="#52525B"
                        strokeWidth="2"
                      />
                      {/* Exact Matching Sneaker Upper (Front Foot) */}
                      <path
                        d="M134 158 L142 124 L182 126 L216 142 C226 144 230 150 230 158 Z"
                        fill={primaryHex}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                      {/* Side Cage Panel in Accent Hex */}
                      <path
                        d="M152 136 L192 140 L188 152 L148 150 Z"
                        fill={accentHex}
                        opacity="0.9"
                      />
                      {/* Triple-Stacked 62mm Midsole (Front Foot) */}
                      <rect
                        x="130"
                        y="158"
                        width="104"
                        height="22"
                        rx="10"
                        fill="#FFFFFF"
                        stroke="#18181B"
                        strokeWidth="2.5"
                      />
                      <line
                        x1="133"
                        y1="167"
                        x2="231"
                        y2="167"
                        stroke={primaryHex}
                        strokeWidth="4"
                      />
                      {/* Architectural Sawtooth Lugs */}
                      <rect x="138" y="179" width="12" height="5" rx="2" fill={primaryHex} />
                      <rect x="160" y="179" width="12" height="5" rx="2" fill={primaryHex} />
                      <rect x="182" y="179" width="12" height="5" rx="2" fill={primaryHex} />
                      <rect x="204" y="179" width="12" height="5" rx="2" fill={primaryHex} />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mt-1">
                    Mode: {animAction.toUpperCase()} · {activeProduct.soleHeightMm}MM SOLE SYNC
                  </span>
                </div>

                {/* Exact Studio Shoe Image & Specs */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-800 border border-white/10">
                    <ResilientImage
                      src={matchedShoeImage}
                      alt={activeProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">
                      Stack: <strong className="text-white">{activeProduct.soleHeightMm}mm</strong>
                    </span>
                    <span className="text-zinc-400">
                      Weight: <strong className="text-white">{activeProduct.weightGrams}g</strong>
                    </span>
                    <span className="text-emerald-400 font-bold">
                      ${activeProduct.discountPrice ?? activeProduct.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Footprints className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    Product image, model image, and animation are 100% locked to{' '}
                    <strong className="text-white">{activeProduct.name}</strong>.
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onQuickView(activeProduct)}
                    className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>

                  {onAddToCart && (
                    <button
                      type="button"
                      onClick={() =>
                        onAddToCart(
                          activeProduct,
                          activeProduct.sizes[2]?.us || 9,
                          activeColor.name
                        )
                      }
                      className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectProduct(activeProduct.slug)}
                    className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Full Product Page</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
