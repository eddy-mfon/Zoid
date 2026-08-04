import React from 'react';
import { Jersey } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatNaira } from '../../utils/format';
import { Eye, Heart, Plus, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  jersey: Jersey;
}

export const ProductCard: React.FC<ProductCardProps> = ({ jersey }) => {
  const { setSelectedJerseyForModal, addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const favorited = isWishlisted(jersey.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-[#0A0A0A] border border-neutral-900/90 rounded-2xl overflow-hidden group hover:border-[#C21E3C] hover:shadow-[#C21E3C]/10 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Stage (3:4 Portrait Ratio) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        <img
          src={jersey.mainImage}
          alt={jersey.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Optional Tag / Badge on Image (e.g. LIMITED) */}
        {(jersey.isLimitedDrop || jersey.isBestSeller) && (
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-[#C21E3C]/50 shadow-md">
            {jersey.isLimitedDrop ? 'LIMITED' : 'BESTSELLER'}
          </div>
        )}

        {/* Hover Action Buttons */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => setSelectedJerseyForModal(jersey)}
            className="bg-neutral-900/90 border border-neutral-700 text-white p-2.5 rounded-full hover:bg-[#C21E3C] hover:border-[#C21E3C] transition-all transform hover:scale-105"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleWishlist(jersey.id)}
            className={`p-2.5 rounded-full border transition-all transform hover:scale-105 ${
              favorited 
                ? 'bg-[#C21E3C] border-[#C21E3C] text-white' 
                : 'bg-black/90 border-neutral-700 text-white hover:bg-[#C21E3C] hover:border-[#C21E3C]'
            }`}
            title="Wishlist"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Product Information Footer */}
      <div className="p-3.5 sm:p-4 bg-[#0A0A0A] flex flex-col justify-between flex-1 space-y-1">
        
        {/* Row 1: Season / Year & Plus Button */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-sans font-bold text-neutral-400 uppercase tracking-wider">
            {jersey.season}
          </span>

          <button
            onClick={() => addToCart(jersey, 'L')}
            className="w-6 h-6 sm:w-7 sm:h-7 border border-neutral-800 bg-neutral-950 hover:bg-[#C21E3C] hover:border-[#C21E3C] text-neutral-300 hover:text-white flex items-center justify-center transition-all rounded"
            title="Add to Bag"
            aria-label="Add to Bag"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 2: Product Name (Bold Uppercase) */}
        <h3 className="font-sans text-xs sm:text-sm font-extrabold uppercase text-white group-hover:text-[#E63956] transition-colors leading-tight line-clamp-1 pt-0.5">
          {jersey.name}
        </h3>

        {/* Row 3: Price */}
        <div className="pt-1">
          <span className="font-sans text-xs sm:text-sm font-extrabold text-neutral-300 tracking-tight">
            {formatNaira(jersey.price)}
          </span>
        </div>

      </div>
    </motion.div>
  );
};
