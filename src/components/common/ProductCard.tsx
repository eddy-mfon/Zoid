import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Jersey } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatNaira } from '../../utils/format';
import { Eye, Heart, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  jersey: Jersey;
}

export const ProductCard: React.FC<ProductCardProps> = ({ jersey }) => {
  const { setSelectedJerseyForModal, addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const favorited = isWishlisted(jersey.id);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const handleAddWithSize = (size: string) => {
    addToCart(jersey, size as any);
    setShowSizePicker(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-[#0A0A0A] border border-neutral-900/90 rounded-2xl overflow-hidden group hover:border-[#C21E3C] hover:shadow-[#C21E3C]/10 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative"
    >
      {/* Product Image Stage (3:4 Portrait Ratio) — click to view product */}
      <Link to={`/product/${jersey.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950 block">
        <img
          src={jersey.mainImage}
          alt={jersey.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {(jersey.isLimitedDrop || jersey.isBestSeller) && (
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-[#C21E3C]/50 shadow-md">
            {jersey.isLimitedDrop ? 'LIMITED' : 'BESTSELLER'}
          </div>
        )}

        {/* Hover Action Buttons */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
          <button
            onClick={(e) => { e.preventDefault(); setSelectedJerseyForModal(jersey); }}
            className="bg-neutral-900/90 border border-neutral-700 text-white px-3 py-2 rounded-full hover:bg-[#C21E3C] hover:border-[#C21E3C] transition-all text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(jersey.id); }}
            className={`p-2.5 rounded-full border transition-all ${
              favorited
                ? 'bg-[#C21E3C] border-[#C21E3C] text-white'
                : 'bg-black/90 border-neutral-700 text-white hover:bg-[#C21E3C] hover:border-[#C21E3C]'
            }`}
            title={favorited ? 'Remove from Saved' : 'Save to Wishlist'}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </Link>

      {/* Product Information Footer */}
      <div className="p-3.5 sm:p-4 bg-[#0A0A0A] flex flex-col justify-between flex-1 space-y-1">

        {/* Row 1: Season / Year & Add to Bag Button */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-sans font-bold text-neutral-400 uppercase tracking-wider">
            {jersey.season}
          </span>

          <button
            onClick={() => setShowSizePicker(true)}
            className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider border border-neutral-800 bg-neutral-950 hover:bg-[#C21E3C] hover:border-[#C21E3C] text-neutral-300 hover:text-white px-2.5 py-1 rounded transition-all"
            title="Add to Bag — pick size"
            aria-label="Add to Bag"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>

        {/* Row 2: Product Name */}
        <Link to={`/product/${jersey.id}`}>
          <h3 className="font-sans text-xs sm:text-sm font-extrabold uppercase text-white group-hover:text-[#E63956] transition-colors leading-tight line-clamp-1 pt-0.5">
            {jersey.name}
          </h3>
        </Link>

        {/* Row 3: Price */}
        <div className="pt-1">
          <span className="font-sans text-xs sm:text-sm font-extrabold text-neutral-300 tracking-tight">
            {formatNaira(jersey.price)}
          </span>
        </div>

      </div>

      {/* ── Inline Size Picker Popover ── */}
      <AnimatePresence>
        {showSizePicker && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-10 bg-black/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 p-5"
          >
            <button
              onClick={() => setShowSizePicker(false)}
              className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors"
              aria-label="Close size picker"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C21E3C] block mb-0.5">Pick Your Size</span>
              <p className="text-white font-display text-sm font-bold uppercase truncate max-w-[180px]">{jersey.name}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full">
              {(jersey.availableSizes ?? ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                <button
                  key={size}
                  onClick={() => handleAddWithSize(size)}
                  className="py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-white font-display text-sm font-bold uppercase hover:bg-[#C21E3C] hover:border-[#C21E3C] transition-all"
                >
                  {size}
                </button>
              ))}
            </div>

            <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Relaxed Vintage Fit</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

