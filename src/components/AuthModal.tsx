import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  LogOut,
  Package,
  Award,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { OrderReceipt, UserAccount } from '../types/shoe';
import { authenticateUser, registerNewUser } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onAuthSuccess: (user: UserAccount, isNewSignup: boolean) => void;
  onLogout: () => void;
  orderHistory: OrderReceipt[];
  onSelectProduct: (slug: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  orderHistory,
  onSelectProduct,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferredGender, setPreferredGender] = useState<'all' | 'men' | 'women'>('all');
  const [defaultSizeUs, setDefaultSizeUs] = useState<number>(9.5);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    const res = authenticateUser(email, password);
    if (res.error || !res.user) {
      setErrorMsg(res.error || 'Authentication failed.');
      return;
    }
    onAuthSuccess(res.user, false);
    setEmail('');
    setPassword('');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim() || !email.trim() || password.length < 4) {
      setErrorMsg(
        'Please provide your full name, a valid email, and a password (4+ chars).'
      );
      return;
    }
    const res = registerNewUser(
      fullName,
      email,
      password,
      preferredGender,
      defaultSizeUs
    );
    if (res.error || !res.user) {
      setErrorMsg(res.error || 'Could not create account.');
      return;
    }
    onAuthSuccess(res.user, true);
    setFullName('');
    setEmail('');
    setPassword('');
  };

  const handleDemoCollectorLogin = () => {
    setErrorMsg('');
    const res = authenticateUser('elena@altura-atelier.com', 'altura2026');
    if (res.user) {
      onAuthSuccess(res.user, false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-200">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close account modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser ? (
          /* Authenticated Collector Dashboard */
          <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            {/* Member Header Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-display text-base font-extrabold flex items-center justify-center">
                    {currentUser.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400">
                      <Award className="w-3.5 h-3.5" />
                      <span>{currentUser.vipTier.toUpperCase()}</span>
                    </div>
                    <h2 className="font-display text-xl font-bold text-white">
                      {currentUser.fullName}
                    </h2>
                    <p className="text-xs text-zinc-400">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-mono text-base font-bold text-white tabular-nums">
                    {currentUser.altitudePoints}
                  </div>
                  <div className="text-[11px] text-zinc-400">Altitude Pts</div>
                </div>
                <div>
                  <div className="font-mono text-base font-bold text-white tabular-nums">
                    US {currentUser.defaultSizeUs}
                  </div>
                  <div className="text-[11px] text-zinc-400">Saved Size</div>
                </div>
                <div>
                  <div className="font-mono text-base font-bold text-emerald-400">
                    ALTURA15
                  </div>
                  <div className="text-[11px] text-zinc-400">VIP 15% Code</div>
                </div>
              </div>
            </div>

            {/* Order History Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Recent Collector Orders ({orderHistory.length})</span>
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  Member since {currentUser.memberSince}
                </span>
              </div>

              {orderHistory.length === 0 ? (
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-1">
                  <p className="text-xs font-semibold text-zinc-800">
                    No orders placed in this session yet.
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Your 15% VIP privilege code <span className="font-mono font-bold text-blue-600">ALTURA15</span> is active at checkout.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {orderHistory.map((ord) => (
                    <div
                      key={ord.orderNumber}
                      className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-mono font-bold text-zinc-950">
                          {ord.orderNumber} · {ord.createdAt}
                        </div>
                        <div className="text-zinc-500 mt-0.5">
                          {ord.items.map((i) => i.product.name).join(', ')}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-zinc-950 tabular-nums">
                          ${ord.total}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-medium">
                          Confirmed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 hover:border-red-300 hover:bg-red-50 text-xs font-semibold text-zinc-700 hover:text-red-600 flex items-center gap-1.5 transition-settling cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-blue-600 text-white text-xs font-semibold transition-settling cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Login & Sign Up Portal */
          <div>
            {/* Top Banner */}
            <div className="p-6 sm:p-8 bg-[#121214] text-white space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ALTURA COLLECTOR PASSPORT</span>
              </div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight">
                {mode === 'login'
                  ? 'Welcome Back to the Atelier.'
                  : 'Create Your Collector Account.'}
              </h2>
              <p className="text-xs text-zinc-400">
                {mode === 'login'
                  ? 'Sign in to access your saved high-sole rotation, order history, and VIP drop privileges.'
                  : 'Join free to receive 500 Altitude Points and instant 15% off with code ALTURA15.'}
              </p>

              {/* Mode Switch Tabs */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-settling cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-zinc-950'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-settling cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-zinc-950'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  Create Account (Sign Up)
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 space-y-5">
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="elena@altura-atelier.com"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 pl-10 pr-10 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-600 font-medium" role="alert">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-zinc-950 hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-settling cursor-pointer"
                  >
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* 1-Click Demo Collector Account Login */}
                  <div className="pt-3 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={handleDemoCollectorLogin}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center justify-center gap-2 transition-settling cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>1-Click Demo Login (Elena Rostova · VIP)</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Marcus Vance"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full h-11 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 block">
                        Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 4 characters"
                        className="w-full h-11 px-3.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 block">
                        Preferred Edit
                      </label>
                      <select
                        value={preferredGender}
                        onChange={(e) =>
                          setPreferredGender(
                            e.target.value as 'all' | 'men' | 'women'
                          )
                        }
                        className="w-full h-10 px-3 rounded-xl border border-zinc-300 text-xs bg-white"
                      >
                        <option value="all">All Collections</option>
                        <option value="men">Men’s High-Sole</option>
                        <option value="women">Women’s Platform</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 block">
                        Default US Shoe Size
                      </label>
                      <select
                        value={defaultSizeUs}
                        onChange={(e) =>
                          setDefaultSizeUs(Number(e.target.value))
                        }
                        className="w-full h-10 px-3 rounded-xl border border-zinc-300 text-xs bg-white font-mono"
                      >
                        {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12].map(
                          (sz) => (
                            <option key={sz} value={sz}>
                              US {sz}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-600 font-medium" role="alert">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-settling cursor-pointer"
                  >
                    <span>Create Account &amp; Unlock 15% Off</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
