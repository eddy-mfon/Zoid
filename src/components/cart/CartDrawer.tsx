import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatNaira } from '../../utils/format';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    total,
    promoCode,
    applyPromoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode) {
      applyPromoCode(inputCode);
      setInputCode('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#0A0A0A] border-l border-neutral-800 text-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C21E3C]" />
                <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
                  YOUR BAG ({cartItems.reduce((a, b) => a + b.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase text-white mb-2">
                    YOUR BAG IS EMPTY
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-xs mb-6">
                    Explore our curated collection of vintage football grails and streetwear kits.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#C21E3C] text-white font-mono uppercase tracking-wider text-xs px-6 py-3 rounded-full font-bold hover:bg-[#A0152F] transition-colors"
                  >
                    START SHOPPING
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={`${item.jersey.id}-${item.size}`}
                    className="bg-[#121212] border border-neutral-800 rounded-2xl p-3 flex gap-3 items-center group"
                  >
                    <img
                      src={item.jersey.mainImage}
                      alt={item.jersey.name}
                      className="w-20 h-20 rounded-xl object-cover bg-neutral-950 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-0.5">
                        <span className="truncate">{item.jersey.clubOrCountry}</span>
                        <span className="text-[#C21E3C] font-bold">SIZE: {item.size}</span>
                      </div>

                      <h4 className="font-sans text-sm font-medium text-white truncate group-hover:text-[#C21E3C] transition-colors">
                        {item.jersey.name}
                      </h4>

                      <p className="font-mono text-sm font-bold text-white mt-1">
                        {formatNaira(item.jersey.price)}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.jersey.id, item.size, item.quantity - 1)}
                            className="text-neutral-400 hover:text-white px-1 text-sm font-mono"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-bold px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.jersey.id, item.size, item.quantity + 1)}
                            className="text-neutral-400 hover:text-white px-1 text-sm font-mono"
                          >
                            +
                          </button>
                        </div>

                        {/* Trash Button */}
                        <button
                          onClick={() => removeFromCart(item.jersey.id, item.size)}
                          className="text-neutral-500 hover:text-[#C21E3C] p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-neutral-900 bg-[#080808] flex flex-col gap-4">
                
                {/* Promo Code Form */}
                <form onSubmit={handleApplyCode} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="PROMO CODE (e.g. ZOID10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono uppercase text-white placeholder-neutral-500 focus:outline-none focus:border-[#C21E3C]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-neutral-800 hover:bg-[#C21E3C] text-white font-mono text-xs tracking-wider uppercase px-4 rounded-xl font-bold transition-colors"
                  >
                    APPLY
                  </button>
                </form>

                {promoCode && (
                  <div className="flex items-center justify-between text-xs font-mono text-[#C21E3C]">
                    <span>PROMO ({promoCode}):</span>
                    <span>-{formatNaira(discount)}</span>
                  </div>
                )}

                {/* Subtotal & Total */}
                <div className="space-y-1.5 text-xs font-mono text-neutral-400 border-t border-neutral-900 pt-3">
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span className="text-white">{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROOM DELIVERY</span>
                    <span className="text-white font-bold">DELIVERY INCL. ₦4,500</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-neutral-800">
                    <span>TOTAL</span>
                    <span className="text-[#C21E3C]">{formatNaira(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#C21E3C] hover:bg-[#A0152F] text-white py-3.5 rounded-full font-mono text-xs tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C21E3C]/25"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
