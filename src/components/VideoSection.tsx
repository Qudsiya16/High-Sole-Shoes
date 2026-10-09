import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Sparkles } from 'lucide-react';
import { ResilientImage } from './ResilientImage';

interface VideoSectionProps {
  posterSrc: string;
  secondarySrc?: string;
  title: string;
  subtitle: string;
  accentColor?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Strategic HTML5 <video autoPlay muted loop playsInline> powered by an internal
 * high-frame-rate canvas MediaStream with a guaranteed fallback image.
 * Structured as a flex-col card with an isolated media stage and a normal-flow
 * caption/control bar so text and controls never clip, overflow, or hide behind
 * adjacent elements at any viewport width (320px through 1920px+).
 */
export const VideoSection: React.FC<VideoSectionProps> = ({
  posterSrc,
  secondarySrc,
  title,
  subtitle,
  accentColor = '#2563EB',
  className = '',
  compact = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setIsPlaying(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img1 = new Image();
    img1.crossOrigin = 'anonymous';
    img1.src = posterSrc;

    const img2 = new Image();
    if (secondarySrc) {
      img2.crossOrigin = 'anonymous';
      img2.src = secondarySrc;
    }

    let animId = 0;
    const startTime = performance.now();

    const drawCoverImage = (
      context: CanvasRenderingContext2D,
      image: HTMLImageElement,
      canvasW: number,
      canvasH: number
    ) => {
      const imgW = image.naturalWidth || canvasW;
      const imgH = image.naturalHeight || canvasH;
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

    const renderFrame = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#121214';
      ctx.fillRect(0, 0, w, h);

      // Smooth Ken Burns pan & zoom across sneaker photography
      const cycle = (Math.sin(elapsed * 0.7) + 1) / 2; // 0..1
      const scale = 1.04 + cycle * 0.08;

      if (img1.complete && img1.naturalWidth > 0) {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(scale, scale);
        ctx.translate(
          -w / 2 + Math.cos(elapsed * 0.5) * 12,
          -h / 2 + Math.sin(elapsed * 0.6) * 8
        );
        drawCoverImage(ctx, img1, w, h);
        ctx.restore();
      }

      // Crossfade secondary editorial angle periodically
      if (secondarySrc && img2.complete && img2.naturalWidth > 0) {
        const alpha = Math.max(0, Math.sin(elapsed * 0.45 - 1.2));
        if (alpha > 0.02) {
          ctx.save();
          ctx.globalAlpha = alpha * 0.85;
          const scale2 = 1.12 - cycle * 0.06;
          ctx.translate(w / 2, h / 2);
          ctx.scale(scale2, scale2);
          ctx.translate(-w / 2, -h / 2);
          drawCoverImage(ctx, img2, w, h);
          ctx.restore();
        }
      }

      // Subtle bottom vignette for depth
      const grad = ctx.createLinearGradient(0, h * 0.55, 0, h);
      grad.addColorStop(0, 'rgba(18, 18, 20, 0)');
      grad.addColorStop(1, 'rgba(18, 18, 20, 0.65)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle architectural sole wave line animation at bottom of video frame
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 16) {
        const y = h - 14 + Math.sin(x * 0.02 + elapsed * 2.4) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);

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
            setIsPlaying(true);
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
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [posterSrc, secondarySrc, accentColor]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      setIsPlaying((prev) => !prev);
      return;
    }
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col w-full max-w-full min-w-0 overflow-hidden rounded-2xl bg-zinc-950 ${className}`}
    >
      {/* Hidden source canvas */}
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        className="hidden"
        aria-hidden="true"
      />

      {/* Visual Media Stage — isolated aspect/min-height box so media never stretches parent width */}
      <div
        className={`relative w-full flex-1 overflow-hidden bg-zinc-900 ${
          compact
            ? 'min-h-[210px] sm:min-h-[280px] lg:min-h-[320px]'
            : 'min-h-[220px] sm:min-h-[320px] lg:min-h-[380px]'
        }`}
      >
        {/* Fallback high-res image always rendered inside the stage */}
        <ResilientImage
          src={posterSrc}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
            videoReady ? 'opacity-0' : 'opacity-95'
          }`}
        />

        {/* Real HTML5 Video with autoPlay, muted, loop, playsInline */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          className={`absolute inset-0 w-full h-full object-cover object-center ${
            videoReady ? 'block' : 'hidden'
          }`}
          aria-label={title}
        />

        {/* Subtle Top Status Pill */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15">
          <span
            className={`w-2 h-2 rounded-full ${
              isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-400'
            }`}
          />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-200">
            {isPlaying ? 'LIVE MOTION REEL' : 'PAUSED'}
          </span>
        </div>
      </div>

      {/* Normal-Flow Caption & Control Footer Bar — never clips or hides video content */}
      <div
        className={`relative z-10 w-full bg-zinc-950 border-t border-white/10 flex items-center justify-between gap-3 sm:gap-4 ${
          compact ? 'p-3.5 sm:p-4' : 'p-4 sm:p-5 lg:p-6'
        }`}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono tracking-wider uppercase text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="break-words">{subtitle}</span>
          </div>
          <h3
            className={`font-display font-bold text-white leading-snug break-words ${
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-xl lg:text-2xl'
            }`}
          >
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause motion reel' : 'Play motion reel'}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-blue-600 border border-white/20 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
