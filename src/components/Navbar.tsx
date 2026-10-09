import React, { useEffect, useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
  User,
} from 'lucide-react';
import { ActivePage, Product, UserAccount } from '../types/shoe';
import { buildWhatsAppUrl } from '../config/whatsapp';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  currentUser: UserAccount | null;
  products: Product[];
}

/**
 * Scroll-Adaptive Sticky Header:
 * - Mobile (< lg): Compact [☰] [LOGO]       [♡] [🛒] layout that fits 320px+ with zero overflow
 * - Desktop (lg+): Logo | Men | Women | New Arrivals | Trending | Collections | Search | Wishlist | Sign In | Cart
 * - Smooth animated mobile menu drawer with Home, Men, Women, New Arrivals, Trending, Collections, Shop, About, Contact
 */
export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAuth,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const desktopNavItems: {
    label: string;
    isActive: boolean;
    action: () => void;
  }[] = [
    {
      label: 'Men',
      isActive: activePage.view === 'men',
      action: () => onNavigate({ view: 'men' }),
    },
    {
      label: 'Women',
      isActive: activePage.view === 'women',
      action: () => onNavigate({ view: 'women' }),
    },
    {
      label: 'New Arrivals',
      isActive:
        activePage.view === 'shop' && activePage.presetBadge === 'new',
      action: () => onNavigate({ view: 'shop', presetBadge: 'new' }),
    },
    {
      label: 'Trending',
      isActive:
        activePage.view === 'shop' && activePage.presetBadge === 'trending',
      action: () => onNavigate({ view: 'shop', presetBadge: 'trending' }),
    },
    {
      label: 'Collections',
      isActive:
        activePage.view === 'shop' &&
        (!activePage.presetBadge || activePage.presetBadge === 'all'),
      action: () => onNavigate({ view: 'shop', presetGender: 'all' }),
    },
  ];

  const mobileDrawerLinks: {
    label: string;
    isActive: boolean;
    action: () => void;
  }[] = [
    {
      label: 'Home',
      isActive: activePage.view === 'home',
      action: () => onNavigate({ view: 'home' }),
    },
    {
      label: 'Men',
      isActive: activePage.view === 'men',
      action: () => onNavigate({ view: 'men' }),
    },
    {
      label: 'Women',
      isActive: activePage.view === 'women',
      action: () => onNavigate({ view: 'women' }),
    },
    {
      label: 'New Arrivals',
      isActive:
        activePage.view === 'shop' && activePage.presetBadge === 'new',
      action: () => onNavigate({ view: 'shop', presetBadge: 'new' }),
    },
    {
      label: 'Trending',
      isActive:
        activePage.view === 'shop' && activePage.presetBadge === 'trending',
      action: () => onNavigate({ view: 'shop', presetBadge: 'trending' }),
    },
    {
      label: 'Collections',
      isActive:
        activePage.view === 'shop' &&
        activePage.presetCategory === 'High-Sole Sneakers',
      action: () =>
        onNavigate({ view: 'shop', presetCategory: 'High-Sole Sneakers' }),
    },
    {
      label: 'Shop',
      isActive:
        activePage.view === 'shop' &&
        (!activePage.presetBadge || activePage.presetBadge === 'all'),
      action: () => onNavigate({ view: 'shop', presetGender: 'all' }),
    },
    {
      label: 'About',
      isActive: activePage.view === 'about',
      action: () => onNavigate({ view: 'about' }),
    },
    {
      label: 'Contact',
      isActive: false,
      action: () => {
        const footerEl = document.getElementById('altura-footer-contact');
        if (footerEl) {
          footerEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
        }
      },
    },
  ];

  const handleMobileNav = (fn: () => void) => {
    fn();
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full max-w-full transition-all duration-300 ${
        isScrolled
          ? 'h-14 sm:h-16 bg-[#09090D]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40 text-white'
          : 'h-16 lg:h-20 bg-[#09090D] border-b border-white/10 text-white'
      }`}
    >
      <div className="max-w-[1400px] w-full mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Zone: Mobile [☰] + [LOGO] | Desktop [LOGO] */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate({ view: 'home' });
              setMobileMenuOpen(false);
            }}
            className="font-display text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-white hover:text-blue-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 whitespace-nowrap shrink-0"
          >
            ALTURA
          </a>
        </div>

        {/* Center Zone: Desktop Navigation Links (Hidden on Mobile) */}
        <nav
          className="hidden lg:flex items-center gap-7 xl:gap-8"
          aria-label="Main Navigation"
        >
          {desktopNavItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className={`relative py-1.5 font-sans text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer group ${
                item.isActive
                  ? 'text-white font-bold'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 transition-transform duration-300 origin-left ${
                  item.isActive
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Right Zone: Mobile [♡] [🛒] | Desktop Search + Wishlist + Sign In + Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Desktop Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search high-sole sneakers"
            className="hidden lg:flex h-10 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-200 hover:text-white items-center gap-2 text-xs font-semibold transition-all duration-300 hover:scale-[1.03] cursor-pointer whitespace-nowrap"
          >
            <Search className="w-4 h-4 stroke-[2]" />
            <span className="hidden xl:inline text-zinc-400">Search...</span>
          </button>

          {/* Wishlist [♡] Button (Visible on both Mobile & Desktop) */}
          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label={`Saved wishlist (${wishlistCount} items)`}
            className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-zinc-200 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0"
          >
            <Heart className="w-4 h-4 stroke-[2]" />
            {wishlistCount > 0 && (
              <span className="-top-1 -right-1 absolute min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold tabular-nums flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Desktop Account Button */}
          <button
            type="button"
            onClick={onOpenAuth}
            aria-label={
              currentUser
                ? `Account (${currentUser.fullName})`
                : 'Sign in or create account'
            }
            className="hidden lg:flex h-10 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white items-center gap-2 text-xs font-semibold transition-all duration-300 hover:scale-[1.03] cursor-pointer whitespace-nowrap shrink-0"
          >
            {currentUser ? (
              <>
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {currentUser.avatarInitials}
                </span>
                <span className="max-w-[85px] truncate">
                  {currentUser.fullName.split(' ')[0]}
                </span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 stroke-[2]" />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Cart [🛒] Button (Compact on Mobile, Expanded on Desktop) */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Shopping bag (${cartCount} items)`}
            className="relative h-10 px-2.5 sm:px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white flex items-center gap-1.5 sm:gap-2 text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2]" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono tabular-nums text-[11px] px-1.5 py-0.5 rounded-md bg-black/25">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Smooth Animated Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 top-14 sm:top-16 bg-[#0B0B10]/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl z-50 px-4 sm:px-6 text-white transition-all duration-300 ease-out overflow-y-auto ${
          mobileMenuOpen
            ? 'max-h-[calc(100vh-3.5rem)] py-5 opacity-100 pointer-events-auto'
            : 'max-h-0 py-0 opacity-0 pointer-events-none border-b-0'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Mobile Quick Search & Account Bar inside Drawer */}
        <div className="grid grid-cols-2 gap-2.5 pb-4 mb-3 border-b border-white/10">
          <button
            type="button"
            onClick={() => handleMobileNav(onOpenSearch)}
            className="h-10 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Search Shoes</span>
          </button>

          <button
            type="button"
            onClick={() => handleMobileNav(onOpenAuth)}
            className="h-10 px-3 rounded-xl bg-blue-600/20 border border-blue-500/40 text-xs font-semibold text-blue-300 flex items-center justify-center gap-2 cursor-pointer truncate"
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {currentUser
                ? currentUser.fullName.split(' ')[0]
                : 'Sign In / Join'}
            </span>
          </button>
        </div>

        {/* All 9 Required Mobile Navigation Items */}
        <nav className="flex flex-col divide-y divide-white/10" aria-label="Mobile Navigation">
          {mobileDrawerLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleMobileNav(item.action)}
              className={`flex items-center justify-between py-3 text-left font-display text-base font-bold transition-colors cursor-pointer ${
                item.isActive ? 'text-blue-400' : 'text-zinc-100 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 shrink-0" />
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
