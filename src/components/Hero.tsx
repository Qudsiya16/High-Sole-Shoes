import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ActivePage, Product } from '../types/shoe';
import { GENERATED_ASSETS } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  products: Product[];
  onNavigate: (page: ActivePage) => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (slug: string) => void;
}

/**
 * Cohesive Full-Width Hero Section with ONE Full-Section Background Video:
 * - Zero side videos, zero side columns, zero duplicated panels.
 * - Single edge-to-edge background <video autoPlay muted loop playsInline> (position: absolute, inset: 0,
 *   width: 100%, height: 100%, object-fit: cover) behind all hero content.
 * - Single-line "FUTURE-BUILT SNEAKERS" heading using fluid CSS clamp() and whitespace-nowrap.
 * - Introductory product text ("HIGH-SOLE FOOTWEAR · 50MM–64MM PLATFORMS · MEN & WOMEN"), description,
 *   and single-line CTA buttons ("Shop Men", "Shop Women", "Explore Collection") positioned neatly beneath.
 */
export const Hero: React.FC<HeroProps> = ({ products, onNavigate }) => {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cinematic sequence of male & female models wearing colorful high-sole sneakers + close-up footwear shots
    const sequenceSources = [
      GENERATED_ASSETS.editorialCampaign,
      products[0]?.modelImage || GENERATED_ASSETS.cobaltModel,
      products[0]?.images[0] || GENERATED_ASSETS.cobaltShoe,
      products[1]?.modelImage || GENERATED_ASSETS.violetModel,
      products[1]?.images[0] || GENERATED_ASSETS.violetShoe,
      products[2]?.modelImage || GENERATED_ASSETS.crimsonModel,
      products[2]?.images[0] || GENERATED_ASSETS.crimsonShoe,
      products[3]?.modelImage || GENERATED_ASSETS.terracottaModel,
      products[3]?.images[0] || GENERATED_ASSETS.terracottaShoe,
    ];

    const loadedImages = sequenceSources.map((src) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      return img;
    });

    const drawCover = (
      context: CanvasRenderingContext2D,
      image: HTMLImageElement,
      canvasW: number,
      canvasH: number
    ) => {
      if (!image.complete || image.naturalWidth === 0) return;
      const imgW = image.naturalWidth;
      const imgH = image.naturalHeight;
      const imgRatio = imgW / imgH;
      const canvasRatio = canvasW / canvasH;
      let drawW = canvasW;
      let drawH = canvasH;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawH = canvasH;
        drawW = canvasH * imgRatio;
        offsetX = (canvasW - drawW) / 2;
      } else {
        drawW = canvasW;
        drawH = canvasW / imgRatio;
        offsetY = (canvasH - drawH) / 2;
      }
      context.drawImage(image, offsetX, offsetY, drawW, drawH);
    };

    let animId = 0;
    const startTime = performance.now();

    const renderCinematicFrame = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#07070B';
      ctx.fillRect(0, 0, w, h);

      const validShots = loadedImages.filter(
        (img) => img.complete && img.naturalWidth > 0
      );

      if (validShots.length > 0) {
        const shotDuration = 3.6; // seconds per cinematic shot
        const totalCycle = validShots.length * shotDuration;
        const cycleTime = elapsed % totalCycle;
        const shotIndex = Math.floor(cycleTime / shotDuration);
        const shotProgress = (cycleTime % shotDuration) / shotDuration; // 0..1

        const currentShot = validShots[shotIndex % validShots.length];
        const nextShot = validShots[(shotIndex + 1) % validShots.length];

        // Smooth dolly zoom + tracking camera motion
        const scaleCurrent = 1.04 + shotProgress * 0.09;
        const panX = Math.cos(elapsed * 0.45) * 22;
        const panY = Math.sin(elapsed * 0.35) * 12;

        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(scaleCurrent, scaleCurrent);
        ctx.translate(-w / 2 + panX, -h / 2 + panY);
        drawCover(ctx, currentShot, w, h);
        ctx.restore();

        // Smooth cross-dissolve transition into next shot
        if (shotProgress > 0.72) {
          const fadeAlpha = (shotProgress - 0.72) / 0.28;
          const scaleNext = 1.03 + fadeAlpha * 0.03;
          ctx.save();
          ctx.globalAlpha = Math.min(1, Math.max(0, fadeAlpha));
          ctx.translate(w / 2, h / 2);
          ctx.scale(scaleNext, scaleNext);
          ctx.translate(-w / 2, -h / 2);
          drawCover(ctx, nextShot, w, h);
          ctx.restore();
        }
      }

      // Subtle studio color grading
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(6, 6, 10, 0.25)');
      grad.addColorStop(0.5, 'rgba(6, 6, 10, 0.12)');
      grad.addColorStop(1, 'rgba(6, 6, 10, 0.45)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(renderCinematicFrame);
    };

    animId = requestAnimationFrame(renderCinematicFrame);

    try {
      const streamFn = (
        canvas as HTMLCanvasElement & {
          captureStream?: (fps?: number) => MediaStream;
        }
      ).captureStream;
      if (typeof streamFn === 'function') {
        const stream = streamFn.call(canvas, 30);
        video.srcObject = stream;
        video
          .play()
          .then(() => {
            setVideoReady(true);
          })
          .catch(() => {
            setVideoReady(false);
          });
      }
    } catch {
      setVideoReady(false);
    }

    return () => {
      cancelAnimationFrame(animId);
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [products]);

  return (
    <section className="relative w-full max-w-full min-h-[520px] sm:min-h-[620px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#060609] text-white border-b border-white/10">
      {/* Offscreen HD canvas feeding the single full-section background <video> */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="hidden"
        aria-hidden="true"
      />

      {/* ONE FULL-SECTION BACKGROUND VIDEO (position: absolute, inset: 0, width: 100%, height: 100%, object-fit: cover) */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
        {/* High-resolution fallback image if video cannot load or prefers-reduced-motion is enabled */}
        <ResilientImage
          src={GENERATED_ASSETS.editorialCampaign}
          alt="Male and female models wearing colorful ALTURA high-sole sneakers"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
            videoReady ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Single Full-Bleed Background Video covering the entire Hero section from edge to edge */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={GENERATED_ASSETS.editorialCampaign}
          className={`absolute inset-0 w-full h-full object-cover object-center ${
            videoReady ? 'block' : 'hidden'
          }`}
          aria-label="Cinematic sneaker-fashion background video showcasing models and high-sole footwear"
        />

        {/* Subtle Dark Gradient Overlay for Crisp Text Readability while keeping the video clearly visible */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/80"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(5,5,8,0.72)_100%)]"
          aria-hidden="true"
        />
      </div>

      {/* COHESIVE FULL-WIDTH FOREGROUND HERO CONTENT (No side videos, no side columns) */}
      <div className="relative z-10 w-full max-w-[1160px] mx-auto px-3.5 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28 flex flex-col items-center text-center">
        {/* 1. Single-Line Stable Heading ("FUTURE-BUILT SNEAKERS") */}
        <h1 className="animate-hero-reveal-1 font-display font-bold tracking-[-0.03em] leading-[1.05] text-white whitespace-nowrap text-[clamp(1.38rem,5.2vw,4.6rem)] drop-shadow-md">
          FUTURE-BUILT SNEAKERS
        </h1>

        {/* 2. Introductory Text Positioned Neatly Beneath the Heading */}
        <div className="animate-hero-reveal-2 mt-4 sm:mt-5 inline-flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 max-w-full">
          <span className="font-display text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-white">
            HIGH-SOLE FOOTWEAR
          </span>
          <div className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.04em] text-zinc-200 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
            <span className="font-mono font-bold text-blue-400">
              50MM–64MM PLATFORMS
            </span>
            <span aria-hidden="true" className="text-zinc-400">
              ·
            </span>
            <span className="text-zinc-100">MEN &amp; WOMEN</span>
          </div>
        </div>

        {/* 3. Concise Editorial Tagline */}
        <p className="animate-hero-reveal-2 mt-4 sm:mt-5 font-sans text-xs min-[375px]:text-sm sm:text-base lg:text-lg text-zinc-200 leading-relaxed max-w-[56ch] drop-shadow-xs">
          Sculpted 50mm to 64mm triple-stacked platforms engineered with supercritical Pebax® foam, carbon torsion bridges, and full-grain Italian calfskin.
        </p>

        {/* 4. CTA Buttons Positioned Neatly Beneath — Guaranteed Single Line on Mobile (320px–430px) and Desktop */}
        <div className="animate-hero-reveal-3 mt-6 sm:mt-8 flex flex-nowrap items-center justify-center gap-1.5 min-[375px]:gap-2 sm:gap-3.5 w-full max-w-xl">
          <button
            type="button"
            onClick={() => onNavigate({ view: 'men' })}
            className="group flex-1 sm:flex-initial min-w-0 px-2 min-[375px]:px-3.5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-sans font-bold text-[11px] min-[375px]:text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 shadow-lg shadow-blue-600/35 transition-all duration-300 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
          >
            <span>Shop Men</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 hidden min-[360px]:inline-block transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ view: 'women' })}
            className="group flex-1 sm:flex-initial min-w-0 px-2 min-[375px]:px-3.5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.98] text-zinc-950 font-sans font-bold text-[11px] min-[375px]:text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
          >
            <span>Shop Women</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 hidden min-[360px]:inline-block transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ view: 'shop', presetGender: 'all' })}
            className="group flex-1 sm:flex-initial min-w-0 px-2 min-[375px]:px-3.5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-white/12 hover:bg-white/20 active:scale-[0.98] backdrop-blur-md border border-white/25 hover:border-white/45 text-white font-sans font-bold text-[11px] min-[375px]:text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
          >
            <span className="sm:hidden">Explore</span>
            <span className="hidden sm:inline">Explore Collection</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 hidden min-[380px]:inline-block text-zinc-300 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
