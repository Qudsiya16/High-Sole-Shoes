import React, { useState } from 'react';
import { Layers, ShieldCheck, Feather, Compass, ArrowRight } from 'lucide-react';
import { ActivePage } from '../types/shoe';
import { GENERATED_ASSETS } from '../data/products';
import { VideoSection } from './VideoSection';
import { ResilientImage } from './ResilientImage';

interface AboutStoryViewProps {
  onNavigate: (page: ActivePage) => void;
}

export const AboutStoryView: React.FC<AboutStoryViewProps> = ({
  onNavigate,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<0 | 1 | 2>(0);

  const soleLayers = [
    {
      index: '01',
      name: 'Upper Chassis — Full-Grain Italian Calfskin & Ballistic Cordura',
      spec: 'Hydrophobic Suede · Lambskin Collar Lining',
      detail:
        'Cut and stitched in our Milan Partner Atelier. We pair saturated pigment-dyed Italian suede with high-tenacity ballistic mesh so the upper breathes during summer transit while locking the instep securely over tall platform geometry.',
    },
    {
      index: '02',
      name: 'Midsole Core — 50mm to 64mm Nitrogen-Infused Pebax® Platform',
      spec: '-35% Weight Reduction · Carbon Anti-Torsion Bridge',
      detail:
        'Conventional chunky rubber platforms weigh over 750g per shoe. By injecting supercritical nitrogen into a dual-density Pebax® core and embedding a forked carbon-composite torsion bridge, ALTURA shoes weigh just 405g–480g with zero ankle roll.',
    },
    {
      index: '03',
      name: 'Outsole — Translucent Ice-Rubber & Sawtooth Architectural Tread',
      spec: '4.5mm Multi-Directional Lugs · High-Abrasion Compound',
      detail:
        'Designed for wet concrete, marble, and cobblestone. Our cantilevered heel bevel softens initial heel strike and propels your stride forward smoothly.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header & Brand Story Video */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider">
            <span>MILAN &amp; TOKYO FOOTWEAR LAB</span>
            <span aria-hidden="true">·</span>
            <span>FOUNDED ON ELEVATION</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.08] text-balance">
            Why We Re-Engineered the Platform Sneaker from the Ground Up.
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed">
            For decades, wearers had to choose between heavy, rigid fashion platforms and uninspired athletic trainers. ALTURA was founded by industrial architects and marathon footwear engineers to unite 60mm+ sculptural height with featherweight biomechanical propulsion.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ view: 'shop', presetGender: 'all' })}
              className="px-6 py-3.5 rounded-xl bg-zinc-950 hover:bg-blue-600 text-white text-sm font-semibold flex items-center gap-2 transition-settling cursor-pointer"
            >
              <span>Explore All 12 Silhouettes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 min-w-0">
          <VideoSection
            posterSrc={GENERATED_ASSETS.editorialCampaign}
            secondarySrc={GENERATED_ASSETS.cobaltPlatform}
            title="Inside the ALTURA Triple-Stack Sole Lab"
            subtitle="BRAND STORY & BIOMECHANICAL TEST REEL"
            className="w-full shadow-xl border border-zinc-200"
          />
        </div>
      </div>

      {/* Interactive 3-Layer Sole Architecture Inspector */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-500">
            INTERACTIVE SOLE CROSS-SECTION
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-950 text-balance">
            Three Structural Layers. Zero Compromise.
          </h2>

          <div className="space-y-3 pt-2">
            {soleLayers.map((layer, idx) => {
              const isSelected = selectedLayer === idx;
              return (
                <button
                  key={layer.index}
                  type="button"
                  onClick={() => setSelectedLayer(idx as 0 | 1 | 2)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-md'
                      : 'bg-[#F9F9F8] text-zinc-900 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className={isSelected ? 'text-blue-400' : 'text-blue-600'}>
                      LAYER {layer.index}
                    </span>
                    <span className={isSelected ? 'text-zinc-400' : 'text-zinc-500'}>
                      {layer.spec}
                    </span>
                  </div>
                  <div className="font-display text-base font-bold">
                    {layer.name}
                  </div>
                  {isSelected && (
                    <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                      {layer.detail}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F1F0EC] border border-zinc-200">
            <ResilientImage
              src={
                selectedLayer === 0
                  ? GENERATED_ASSETS.violetPlatform
                  : selectedLayer === 1
                    ? GENERATED_ASSETS.crimsonRunner
                    : GENERATED_ASSETS.ochreLimited
              }
              alt={soleLayers[selectedLayer].name}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#F9F9F8] border border-zinc-200/80">
              <Feather className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
              <div className="font-mono text-sm font-bold text-zinc-950">405g</div>
              <div className="text-[11px] text-zinc-500">Featherlight Build</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F9F9F8] border border-zinc-200/80">
              <Layers className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
              <div className="font-mono text-sm font-bold text-zinc-950">50–64mm</div>
              <div className="text-[11px] text-zinc-500">Sculpted Lift</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F9F9F8] border border-zinc-200/80">
              <Compass className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
              <div className="font-mono text-sm font-bold text-zinc-950">100%</div>
              <div className="text-[11px] text-zinc-500">Carbon Stabilized</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
