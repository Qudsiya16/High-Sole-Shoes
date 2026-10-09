import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { GLOBAL_TESTIMONIALS } from '../data/products';

interface ReviewsSectionProps {
  onSelectShoeByName: (shoeName: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  onSelectShoeByName,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? GLOBAL_TESTIMONIALS.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === GLOBAL_TESTIMONIALS.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="w-full max-w-full overflow-hidden py-10 sm:py-16 lg:py-20 bg-[#F9F9F8] border-b border-zinc-200/80">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
              <span>VERIFIED STREET WEARERS</span>
              <span aria-hidden="true">·</span>
              <span>4.9 / 5 AVERAGE RATING</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight text-balance">
              Tested Across 15,000+ Daily Steps.
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous customer review"
              className="w-10 h-10 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 flex items-center justify-center text-zinc-800 transition-settling cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next customer review"
              className="w-10 h-10 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 flex items-center justify-center text-zinc-800 transition-settling cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop 2-Column / Mobile Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((offset) => {
            const review =
              GLOBAL_TESTIMONIALS[(activeIndex + offset) % GLOBAL_TESTIMONIALS.length];
            return (
              <article
                key={`${review.id}-${offset}`}
                className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm"
              >
                <div className="space-y-4">
                  {/* Rating + Fit Feedback */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-mono text-zinc-500">
                      Fit: {review.fitFeedback}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-zinc-950">
                    “{review.title}”
                  </h3>

                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                <div className="pt-5 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-display text-xs font-bold flex items-center justify-center shrink-0">
                      {review.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
                        <span>{review.author}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-xs text-zinc-500">{review.roleOrCity}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectShoeByName(review.shoePurchased)}
                    className="text-xs font-mono font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>{review.shoePurchased}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
