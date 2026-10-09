import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { AnimatedCharacter } from './AnimatedCharacter';

interface NewsletterSectionProps {
  isSubscribed: boolean;
  subscriberEmail?: string;
  onSubscribe: (email: string) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  isSubscribed,
  subscriberEmail,
  onSubscribe,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Please enter a valid email address to unlock early drop access.');
      return;
    }
    setErrorMsg('');
    onSubscribe(trimmed);
    setEmailInput('');
  };

  return (
    <section className="w-full max-w-full py-10 sm:py-16 lg:py-20 bg-[#121214] text-white border-b border-zinc-800 relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-zinc-900/90 border border-zinc-800 p-5 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <AnimatedCharacter variant="wave-vip" accentColor="#3B82F6" />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ALTURA PRIORITY DROP LIST</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-balance mt-1">
                  Get the latest drops before everyone else.
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-[58ch]">
              Join 48,000+ collectors receiving 24-hour early access to numbered 60mm+ platform releases, private sample sales, and an instant <span className="font-mono font-semibold text-white">15% OFF</span> welcome privilege code (<span className="font-mono text-blue-400">ALTURA15</span>).
            </p>
          </div>

          <div className="lg:col-span-5">
            {isSubscribed ? (
              <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-700/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <Check className="w-4 h-4" />
                  <span>Priority Access Confirmed</span>
                </div>
                <p className="text-xs text-zinc-300">
                  Registered <span className="font-mono text-white">{subscriberEmail}</span> for early numbered drops. Use code{' '}
                  <span className="font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-900/60">
                    ALTURA15
                  </span>{' '}
                  in your shopping bag for 15% off.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email for early access..."
                    className="flex-1 h-12 px-4 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-settling cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-xs text-red-400" role="alert">
                    {errorMsg}
                  </p>
                )}
                <p className="text-[11px] text-zinc-400">
                  Zero spam. Unsubscribe in one click at any time. By subscribing you agree to our Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
