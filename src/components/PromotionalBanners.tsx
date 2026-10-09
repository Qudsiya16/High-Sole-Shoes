import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { ActivePage, Product } from '../types/shoe';
import { GENERATED_ASSETS } from '../data/products';
import { ResilientImage } from './ResilientImage';
import { AnimatedCharacter } from './AnimatedCharacter';

interface PromotionalBannersProps {
  onNavigate: (page: ActivePage) => void;
  onSelectProduct: (slug: string) => void;
  limitedProducts: Product[];
}

interface CampaignItem {
  id: string;
  tag: string;
  headline: string;
  subheadline: string;
  description: string;
  ctaLabel: string;
  image: string;
  accentClass: string;
  action: () => void;
}

export const PromotionalBanners: React.FC<PromotionalBannersProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const [activeCampaignIdx, setActiveCampaignIdx] = useState(0);

  const campaigns: CampaignItem[] = [
    {
      id: 'future',
      tag: '01 · ARCHITECTURAL INNOVATION',
      headline: 'STEP INTO THE FUTURE',
      subheadline: '60mm–64mm Supercritical Foam & Carbon Torsion Bridges',
      description:
        'Our cantilevered high-sole geometry redistributes heel strike energy into effortless forward momentum while adding up to 2.5 inches of clean architectural stature.',
      ctaLabel: 'Explore High-Sole Series',
      image: GENERATED_ASSETS.crimsonRunner,
      accentClass: 'from-blue-600/90 via-indigo-950/90 to-zinc-950',
      action: () => onNavigate({ view: 'shop', presetCategory: 'High-Sole Sneakers' }),
    },
    {
      id: 'color-street',
      tag: '02 · CHROMATIC ATELIER',
      headline: 'COLOR YOUR STREET',
      subheadline: 'Electric Cobalt, Ultraviolet Suede, Burnt Terracotta & Emerald Volt',
      description:
        'Pigment-dyed Italian suedes paired with translucent and triple-stacked pearl midsoles. Designed to turn minimalist tailoring into a statement.',
      ctaLabel: 'Shop Colorful Platforms',
      image: GENERATED_ASSETS.editorialCampaign,
      accentClass: 'from-purple-700/90 via-zinc-900/95 to-zinc-950',
      action: () => onNavigate({ view: 'shop', presetBadge: 'trending' }),
    },
    {
      id: 'mens-edit',
      tag: '03 · MEN’S CURATION',
      headline: "MEN'S STREET EDIT",
      subheadline: 'Heavy-Gauge Nubuck, Cordura Ballistic Mesh & Sawtooth Outsoles',
      description:
        'Engineered to anchor relaxed denim, wide-leg trousers, and technical outerwear with commanding 50mm to 64mm sole proportions.',
      ctaLabel: "Shop Men's Collection",
      image: GENERATED_ASSETS.cobaltPlatform,
      accentClass: 'from-zinc-900 via-zinc-900 to-blue-950',
      action: () => onNavigate({ view: 'men' }),
    },
    {
      id: 'womens-walk',
      tag: '04 · WOMEN’S CURATION',
      headline: "WOMEN'S POWER WALK",
      subheadline: 'Contoured 410g Featherweight Platforms with Tapered Toe Profiles',
      description:
        'Runway-grade height meets zero-break-in lambskin collars. Sculpted to elongate the leg line without sacrificing all-day walking agility.',
      ctaLabel: "Shop Women's Collection",
      image: GENERATED_ASSETS.violetPlatform,
      accentClass: 'from-fuchsia-950 via-zinc-900 to-zinc-950',
      action: () => onNavigate({ view: 'women' }),
    },
    {
      id: 'limited-drop',
      tag: '05 · COLLECTOR ARCHIVE [250 PAIRS]',
      headline: 'LIMITED DROP',
      subheadline: 'Solstice-64 Ochre Syndicate & Hyperion-62 Scarlet Edition',
      description:
        'Individually laser-numbered on anodized titanium tongue badges. Once an allocation sells through, the colorway enters our permanent archive.',
      ctaLabel: 'Inspect Limited Editions',
      image: GENERATED_ASSETS.ochreLimited,
      accentClass: 'from-amber-700/90 via-stone-900 to-zinc-950',
      action: () => onNavigate({ view: 'shop', presetCategory: 'Limited Edition' }),
    },
  ];

  const activeCampaign = campaigns[activeCampaignIdx];

  return (
    <section className="w-full max-w-full overflow-hidden py-10 sm:py-16 lg:py-20 bg-[#F1F0EC] border-y border-zinc-200/80">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header + Mascot Character */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
              <span>SEASONAL CAMPAIGNS</span>
              <span aria-hidden="true">·</span>
              <span>FIVE CURATED EDITS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight text-balance">
              Elevated Proportions. Every Angle.
            </h2>
          </div>

          {/* Campaign Switcher Tabs (Functional Segmented Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {campaigns.map((camp, idx) => (
              <button
                key={camp.id}
                type="button"
                onClick={() => setActiveCampaignIdx(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-settling cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCampaignIdx === idx
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200/80'
                }`}
              >
                {camp.headline}
              </button>
            ))}
          </div>
        </div>

        {/* Active Spotlight Banner Card */}
        <div
          className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br ${activeCampaign.accentClass} text-white shadow-xl transition-all duration-300`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-5 sm:p-10 lg:p-12 space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] sm:text-xs tracking-wider text-zinc-300">
                  {activeCampaign.tag}
                </span>
                {activeCampaign.id === 'limited-drop' && (
                  <AnimatedCharacter variant="mascot-drop" accentColor="#F59E0B" />
                )}
              </div>

              <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] text-balance">
                {activeCampaign.headline}
              </h3>

              <p className="font-display text-sm sm:text-lg font-semibold text-zinc-200">
                {activeCampaign.subheadline}
              </p>

              <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-[54ch]">
                {activeCampaign.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={activeCampaign.action}
                  className="w-full sm:w-auto px-5 sm:px-6 h-11 sm:h-12 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-settling cursor-pointer"
                >
                  <span>{activeCampaign.ctaLabel}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </button>

                {activeCampaign.id === 'limited-drop' && (
                  <button
                    type="button"
                    onClick={() => onSelectProduct('solstice-64-ochre-syndicate')}
                    className="w-full sm:w-auto px-4 h-11 sm:h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-medium flex items-center justify-center transition-settling cursor-pointer"
                  >
                    Inspect #01/250 Solstice-64 →
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 relative h-72 sm:h-96 lg:h-[440px] overflow-hidden">
              <ResilientImage
                src={activeCampaign.image}
                alt={activeCampaign.headline}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950/75 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Fast Delivery & Craftsmanship Proof Strip with Running Sneaker Mascot */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <AnimatedCharacter variant="stride-courier" accentColor="#2563EB" />
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold">
                <Truck className="w-3.5 h-3.5" />
                <span>EXPRESS GLOBAL DISPATCH</span>
              </div>
              <h4 className="font-display text-base sm:text-lg font-bold text-zinc-950">
                Complimentary Express Courier on Orders Over $180
              </h4>
              <p className="text-xs text-zinc-500">
                Every pair ships in a double-walled collector box with spare braided laces and a 30-day size swap guarantee.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-600 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Carbon-Plate Stability Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Italian Calfskin &amp; Pebax® Core</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
