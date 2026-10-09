import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { CartItem, OrderReceipt, Product } from '../types/shoe';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  onUpdateQuantity: (
    productId: string,
    selectedSizeUs: number,
    selectedColor: string,
    delta: number
  ) => void;
  onRemoveItem: (
    productId: string,
    selectedSizeUs: number,
    selectedColor: string
  ) => void;
  onClearCart: () => void;
  onSelectProduct: (slug: string) => void;
  appliedPromo?: string;
  onApplyPromo: (code: string) => void;
  currentUserName?: string;
  currentUserEmail?: string;
  onOrderCompleted?: (receipt: OrderReceipt) => void;
}

const FREE_SHIPPING_THRESHOLD = 180;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSelectProduct,
  appliedPromo,
  onApplyPromo,
  currentUserName,
  currentUserEmail,
  onOrderCompleted,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');

  // Checkout customer form state
  const [customerName, setCustomerName] = useState(currentUserName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUserEmail || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'Card' | 'Apple Pay' | 'Cash on Delivery'
  >('Card');
  const [confirmedReceipt, setConfirmedReceipt] = useState<OrderReceipt | null>(
    null
  );

  React.useEffect(() => {
    if (currentUserName && !customerName) setCustomerName(currentUserName);
    if (currentUserEmail && !customerEmail) setCustomerEmail(currentUserEmail);
  }, [currentUserName, currentUserEmail, customerName, customerEmail]);

  if (!isOpen) return null;

  const populatedItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(
      (i): i is CartItem & { product: Product } => i !== null
    );

  const subtotal = populatedItems.reduce((acc, item) => {
    const unitPrice = item.product.discountPrice ?? item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const discountAmount =
    appliedPromo?.toUpperCase() === 'ALTURA15' ? Math.round(subtotal * 0.15) : 0;

  const discountedSubtotal = subtotal - discountAmount;
  const shippingCost =
    discountedSubtotal === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : 18;
  const total = discountedSubtotal + shippingCost;

  const amountToFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - discountedSubtotal
  );

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'ALTURA15') {
      onApplyPromo('ALTURA15');
      setPromoMessage('15% collector discount applied (ALTURA15).');
      setPromoInput('');
    } else {
      setPromoMessage('Try code ALTURA15 for 15% off your order.');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !shippingAddress.trim()) return;

    const receipt: OrderReceipt = {
      orderNumber: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || 'collector@altura-footwear.com',
      shippingAddress: shippingAddress.trim(),
      city: city.trim() || 'New York',
      postalCode: postalCode.trim() || '10013',
      paymentMethod,
      items: populatedItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSizeUs: item.selectedSizeUs,
      })),
      subtotal,
      discountAmount,
      shippingCost,
      total,
    };

    setConfirmedReceipt(receipt);
    if (onOrderCompleted) {
      onOrderCompleted(receipt);
    }
    onClearCart();
    setCheckoutStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs">
      <div className="w-full max-w-full sm:max-w-lg bg-[#F9F9F8] h-full flex flex-col justify-between shadow-2xl sm:border-l border-zinc-200 overflow-hidden">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-4 bg-white border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-zinc-900" />
            <h2 className="font-display text-base sm:text-lg font-bold text-zinc-950">
              {checkoutStep === 'cart'
                ? 'Your Shopping Bag'
                : checkoutStep === 'checkout'
                  ? 'Express Courier Checkout'
                  : 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setCheckoutStep('cart');
              onClose();
            }}
            aria-label="Close shopping bag"
            className="w-9 h-9 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {checkoutStep === 'cart' && populatedItems.length > 0 && (
          <div className="px-6 py-3 bg-zinc-900 text-white text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400 shrink-0" />
              {amountToFreeShipping === 0 ? (
                <span>
                  Unlocked <strong className="text-emerald-400">Complimentary Express Courier</strong>
                </span>
              ) : (
                <span>
                  Add <strong className="font-mono">${amountToFreeShipping}</strong> more for free express shipping
                </span>
              )}
            </div>
            <span className="font-mono text-[11px] text-zinc-400">
              $180 Threshold
            </span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {checkoutStep === 'confirmed' && confirmedReceipt ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6">
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle2 className="w-8 h-8 shrink-0" />
                <div>
                  <div className="font-mono text-xs uppercase font-bold">
                    {confirmedReceipt.orderNumber} Confirmed — Preparing Shipment
                  </div>
                  <h3 className="font-display text-xl font-bold text-zinc-950">
                    Thank you, {confirmedReceipt.customerName}
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1.5 text-zinc-600">
                <p>
                  <strong className="text-zinc-900">Dispatch Hub:</strong> ALTURA Express Courier ({confirmedReceipt.paymentMethod})
                </p>
                <p>
                  <strong className="text-zinc-900">Destination:</strong> {confirmedReceipt.shippingAddress}, {confirmedReceipt.city} {confirmedReceipt.postalCode}
                </p>
                <p>
                  <strong className="text-zinc-900">Confirmation Sent:</strong> {confirmedReceipt.customerEmail}
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-zinc-400">
                  Items Allocated
                </div>
                {confirmedReceipt.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-2 border-b border-zinc-100"
                  >
                    <div>
                      <div className="font-semibold text-zinc-900">
                        {item.product.name} × {item.quantity}
                      </div>
                      <div className="text-zinc-500">
                        {item.selectedColor} · US {item.selectedSizeUs}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-zinc-900 tabular-nums">
                      $
                      {(
                        (item.product.discountPrice ?? item.product.price) *
                        item.quantity
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>${confirmedReceipt.subtotal}</span>
                </div>
                {confirmedReceipt.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Collector Discount</span>
                    <span>-${confirmedReceipt.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500">
                  <span>Express Courier</span>
                  <span>
                    {confirmedReceipt.shippingCost === 0
                      ? 'FREE'
                      : `$${confirmedReceipt.shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                  <span>Total Paid</span>
                  <span>${confirmedReceipt.total}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-blue-600 transition-settling cursor-pointer"
              >
                Continue Exploring ALTURA
              </button>
            </div>
          ) : checkoutStep === 'checkout' ? (
            <form
              id="altura-checkout-form"
              onSubmit={handlePlaceOrder}
              className="space-y-4"
            >
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                ← Back to Bag Review
              </button>

              <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4">
                <h3 className="font-display text-sm font-bold text-zinc-950">
                  1. Recipient &amp; Courier Address
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name *"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs"
                  />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email for Tracking Updates *"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Street Address & Apartment *"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City *"
                      className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs"
                    />
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal Code *"
                      className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-3">
                <h3 className="font-display text-sm font-bold text-zinc-950">
                  2. Payment Method
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['Card', 'Apple Pay', 'Cash on Delivery'] as const).map(
                    (method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition-settling cursor-pointer ${
                          paymentMethod === method
                            ? 'bg-zinc-950 text-white border-zinc-950'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {method}
                      </button>
                    )
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    30-day unworn return guarantee &amp; free instant size swap included.
                  </span>
                </p>
              </div>
            </form>
          ) : populatedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-200/70 flex items-center justify-center text-zinc-500">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-zinc-950">
                  Your shopping bag is empty
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Explore our 50mm to 64mm architectural high-sole sneakers for men and women.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-blue-600 transition-settling cursor-pointer"
              >
                Explore Footwear
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {populatedItems.map((item) => {
                const unitPrice =
                  item.product.discountPrice ?? item.product.price;
                return (
                  <div
                    key={`${item.productId}-${item.selectedSizeUs}-${item.selectedColor}`}
                    className="bg-white rounded-2xl border border-zinc-200/80 p-4 flex gap-4 items-center"
                  >
                    <div
                      onClick={() => {
                        onSelectProduct(item.product.slug);
                        onClose();
                      }}
                      className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0 cursor-pointer"
                    >
                      <ResilientImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            onSelectProduct(item.product.slug);
                            onClose();
                          }}
                          className="font-display text-sm font-bold text-zinc-950 truncate cursor-pointer hover:text-blue-600"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() =>
                            onRemoveItem(
                              item.productId,
                              item.selectedSizeUs,
                              item.selectedColor
                            )
                          }
                          aria-label={`Remove ${item.product.name}`}
                          className="text-zinc-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-zinc-500 mt-0.5">
                        {item.selectedColor} · US {item.selectedSizeUs} ·{' '}
                        {item.product.soleHeightMm}mm
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                item.productId,
                                item.selectedSizeUs,
                                item.selectedColor,
                                -1
                              )
                            }
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                item.productId,
                                item.selectedSizeUs,
                                item.selectedColor,
                                1
                              )
                            }
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-bold text-zinc-950 tabular-nums">
                          ${(unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Promo Code Input */}
              <form
                onSubmit={handlePromoSubmit}
                className="bg-white rounded-2xl border border-zinc-200/80 p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-mono uppercase text-zinc-500">
                    Collector Privilege Code (Try ALTURA15)
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter ALTURA15 for 15% off"
                    className="flex-1 h-9 px-3 rounded-lg border border-zinc-300 text-xs font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 h-9 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-blue-600 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {(promoMessage || appliedPromo) && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    {promoMessage || `Active code: ${appliedPromo} (15% off)`}
                  </p>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Bottom Totals & Checkout Trigger */}
        {populatedItems.length > 0 && checkoutStep !== 'confirmed' && (
          <div className="p-6 bg-white border-t border-zinc-200 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Collector Discount (ALTURA15)</span>
                  <span className="font-mono tabular-nums">-${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Estimated Express Shipping</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between text-base font-bold text-zinc-950">
                <span>Total</span>
                <span className="font-mono tabular-nums">${total}</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3.5 rounded-xl border border-zinc-300 text-zinc-800 hover:bg-zinc-100 text-xs font-semibold transition-settling cursor-pointer"
                >
                  Continue Shopping
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('checkout')}
                  className="py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-settling cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="submit"
                form="altura-checkout-form"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-settling cursor-pointer"
              >
                <span>Complete Order — ${total}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
