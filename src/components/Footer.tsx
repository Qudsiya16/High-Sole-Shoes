import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ActivePage } from '../types/shoe';
import { buildWhatsAppUrl } from '../config/whatsapp';
import { WhatsAppIcon } from './WhatsAppFloatingButton';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onOpenSizeGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSizeGuide,
}) => {
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(
    'men'
  );

  const toggleSection = (key: string) => {
    setOpenMobileSection((prev) => (prev === key ? null : key));
  };

  return (
    <footer
      id="altura-footer-contact"
      className="w-full max-w-full overflow-hidden bg-[#0E0E10] text-zinc-400 pt-10 sm:pt-16 pb-10 sm:pb-12 border-t border-zinc-800/80"
    >
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-zinc-800/80">
          {/* Brand & Direct Concierge Column */}
          <div className="lg:col-span-4 space-y-4">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate({ view: 'home' });
              }}
              className="font-display text-2xl font-bold tracking-tight text-white inline-block"
            >
              ALTURA
            </a>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Architectural high-sole, platform, and chunky sneakers crafted with Italian calfskin, supercritical Pebax® foam, and carbon torsion plates.
            </p>
            <div className="pt-1 text-xs font-mono text-zinc-400 space-y-1.5">
              <p>Milan Design Studio · Via Tortona 31, 20144 Milano</p>
              <p>Client Concierge · concierge@altura-footwear.com</p>
            </div>
            <div className="pt-1">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-sans font-bold text-white transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Concierge Support</span>
              </a>
            </div>
          </div>

          {/* Men's Collection Links (Collapsible on Mobile, Expanded on md+) */}
          <div className="lg:col-span-2 border-b border-zinc-800/80 md:border-b-0 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('men')}
              className="w-full md:cursor-default flex items-center justify-between py-2 md:py-0 font-display text-xs font-bold uppercase tracking-wider text-white"
            >
              <span>Men’s Edit</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openMobileSection === 'men' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-sm mt-3 ${
                openMobileSection === 'men' ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'men' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Men’s Shoes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({
                      view: 'shop',
                      presetGender: 'men',
                      presetCategory: 'High-Sole Sneakers',
                    })
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  High-Sole Sneakers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({
                      view: 'shop',
                      presetGender: 'men',
                      presetCategory: 'Chunky Sneakers',
                    })
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Chunky Sneakers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({
                      view: 'shop',
                      presetGender: 'men',
                      presetCategory: 'Running-Inspired Shoes',
                    })
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Running-Inspired 60mm
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({
                      view: 'shop',
                      presetGender: 'men',
                      presetCategory: 'Limited Edition',
                    })
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Limited Edition [01/250]
                </button>
              </li>
            </ul>
          </div>

          {/* Women's Collection Links (Collapsible on Mobile, Expanded on md+) */}
          <div className="lg:col-span-2 border-b border-zinc-800/80 md:border-b-0 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('women')}
              className="w-full md:cursor-default flex items-center justify-between py-2 md:py-0 font-display text-xs font-bold uppercase tracking-wider text-white"
            >
              <span>Women’s Edit</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openMobileSection === 'women' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-sm mt-3 ${
                openMobileSection === 'women' ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'women' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Women’s Shoes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({
                      view: 'shop',
                      presetGender: 'women',
                      presetCategory: 'Platform Sneakers',
                    })
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Platform Sneakers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({
                      view: 'shop',
                      presetGender: 'women',
                      presetCategory: 'High-Sole Sneakers',
                    })
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  High-Sole Sneakers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({
                      view: 'shop',
                      presetGender: 'women',
                      presetCategory: 'Fashion Sneakers',
                    })
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Fashion Sneakers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({
                      view: 'shop',
                      presetGender: 'women',
                      presetCategory: 'Streetwear Sneakers',
                    })
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Streetwear Shoes
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care Links (Collapsible on Mobile, Expanded on md+) */}
          <div className="lg:col-span-2 border-b border-zinc-800/80 md:border-b-0 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('care')}
              className="w-full md:cursor-default flex items-center justify-between py-2 md:py-0 font-display text-xs font-bold uppercase tracking-wider text-white"
            >
              <span>Client Care</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openMobileSection === 'care' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-sm mt-3 ${
                openMobileSection === 'care' ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  US / EU / UK Size Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'about' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sole Engineering &amp; Care
                </button>
              </li>
              <li>
                <span className="text-zinc-400">Express 24h Dispatch</span>
              </li>
              <li>
                <span className="text-zinc-400">30-Day Free Exchanges</span>
              </li>
            </ul>
          </div>

          {/* Social & Channels */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Channels
            </h3>
            <ul className="flex flex-wrap md:flex-col gap-4 md:gap-2.5 text-sm">
              <li>
                <a
                  href="#instagram"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate({ view: 'shop', presetBadge: 'trending' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Instagram Lookbook
                </a>
              </li>
              <li>
                <a
                  href="#tiktok"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate({ view: 'shop', presetBadge: 'new' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  TikTok Stride Reels
                </a>
              </li>
              <li>
                <a
                  href="#x"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate({
                      view: 'shop',
                      presetCategory: 'Limited Edition',
                    });
                  }}
                  className="hover:text-white transition-colors"
                >
                  X Drop Alerts
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Quiet Links */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} ALTURA Footwear Atelier. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Sale</span>
            <span>Accessibility (WCAG AA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
