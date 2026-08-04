import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, Sparkles, Check } from 'lucide-react';
import { Jersey } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

import { formatNaira } from '../../utils/format';

interface ProductModalProps {
  jersey: Jersey | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ jersey, onClose }) => {
  if (!jersey) return null;

  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('L');
  const [selectedImage, setSelectedImage] = useState<string>(jersey.mainImage);
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const favorited = isWishlisted(jersey.id);

  const handleAddToCart = () => {
    addToCart(jersey, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(jersey, selectedSize, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#0A0A0A] border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 text-white p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gallery Column */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="relative aspect-[4/3] sm:aspect-[1/1] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
                <img
                  src={selectedImage}
                  alt={jersey.name}
                  className="w-full h-full object-cover"
                />
                {jersey.tag && (
                  <span className="absolute top-3 left-3 bg-[#C21E3C] text-white text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-full uppercase">
                    {jersey.tag}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {jersey.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img ? 'border-[#C21E3C]' : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info & Options Column */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase mb-1">
                  <span>{jersey.clubOrCountry}</span>
                  <span>•</span>
                  <span className="text-[#C21E3C]">{jersey.season}</span>
                  <span>•</span>
                  <span>{jersey.fit}</span>
                </div>

                <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                  {jersey.name}
                </h2>

                <div className="flex items-center gap-3 mt-2">
                  <span className="font-mono text-2xl font-bold text-white">{formatNaira(jersey.price)}</span>
                  {jersey.originalPrice && (
                    <span className="font-mono text-sm text-neutral-500 line-through">
                      {formatNaira(jersey.originalPrice)}
                    </span>
                  )}
                  <span className="bg-[#C21E3C]/20 text-[#C21E3C] text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                    AUTHENTIC VINTAGE
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed border-t border-b border-neutral-900 py-3">
                {jersey.description}
              </p>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                  <span>SELECT SIZE</span>
                  <span className="text-[#C21E3C] font-semibold">VINTAGE FIT GUIDE</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {jersey.availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 rounded-xl font-display text-sm uppercase tracking-wider font-bold transition-all border ${
                          isSelected
                            ? 'bg-[#C21E3C] text-white border-[#C21E3C] shadow-lg shadow-[#C21E3C]/25'
                            : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-neutral-400 uppercase">QUANTITY</span>
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-neutral-400 hover:text-white text-lg font-mono"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold text-white px-4">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-neutral-400 hover:text-white text-lg font-mono"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#C21E3C] hover:bg-[#A0152F] text-white py-3.5 rounded-full font-display text-sm uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C21E3C]/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-white hover:bg-neutral-200 text-black px-6 py-3.5 rounded-full font-display text-sm uppercase tracking-wider font-bold transition-all"
                >
                  BUY NOW
                </button>

                <button
                  onClick={() => toggleWishlist(jersey.id)}
                  className={`p-3.5 rounded-full border transition-all ${
                    favorited
                      ? 'bg-[#C21E3C] text-white border-[#C21E3C]'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 flex flex-col gap-2 text-xs font-mono text-neutral-400">
                <div className="flex items-center gap-2 text-white">
                  <Truck className="w-4 h-4 text-[#C21E3C]" />
                  <span>ROOM DELIVERY SUPPORTED (A102, B215, C307)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Guaranteed Period Authentic Garment</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
