import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { JERSEYS } from '../data/jerseys';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingBag, ShieldCheck, Truck, Sparkles, Check, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { formatNaira } from '../utils/format';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const jersey = JERSEYS.find((j) => j.id === id) || JERSEYS[0];

  const [selectedSize, setSelectedSize] = useState<'M' | 'L' | 'XL' | 'XXL'>('L');
  const [selectedImage, setSelectedImage] = useState<string>(jersey.mainImage);
  const [quantity, setQuantity] = useState<number>(1);

  React.useEffect(() => {
    setSelectedImage(jersey.mainImage);
    setSelectedSize('L');
    setQuantity(1);
  }, [jersey.id, jersey.mainImage]);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const favorited = isWishlisted(jersey.id);

  const relatedJerseys = JERSEYS.filter((j) => j.id !== jersey.id && (j.category === jersey.category || j.clubOrCountry === jersey.clubOrCountry)).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(jersey, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(jersey, selectedSize, quantity);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-8" aria-label="Breadcrumb">
          <Link to="/shop" className="hover:text-[#C21E3C] transition-colors uppercase tracking-wider">Shop</Link>
          <span className="text-neutral-700">›</span>
          <Link to={`/shop?category=${jersey.category}`} className="hover:text-[#C21E3C] transition-colors uppercase tracking-wider">{jersey.category}</Link>
          <span className="text-neutral-700">›</span>
          <span className="text-neutral-300 uppercase tracking-wider truncate max-w-[200px]">{jersey.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-[1/1] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl">
              <img
                src={selectedImage}
                alt={jersey.name}
                className="w-full h-full object-cover"
              />
              {jersey.tag && (
                <span className="absolute top-4 left-4 bg-[#C21E3C] text-white text-xs font-mono font-bold tracking-wider px-3 py-1 rounded-full uppercase">
                  {jersey.tag}
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {jersey.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-[#C21E3C]' : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Actions Column */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase mb-2">
                <span>{jersey.clubOrCountry}</span>
                <span>•</span>
                <span className="text-[#C21E3C] font-bold">{jersey.season}</span>
                <span>•</span>
                <span>{jersey.fit}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
                {jersey.name}
              </h1>

              <div className="flex items-center gap-4 mt-3">
                <span className="font-mono text-3xl font-bold text-white">{formatNaira(jersey.price)}</span>
                {jersey.originalPrice && (
                  <span className="font-mono text-base text-neutral-500 line-through">
                    {formatNaira(jersey.originalPrice)}
                  </span>
                )}
                <span className="bg-[#C21E3C]/20 text-[#C21E3C] text-xs font-mono px-3 py-1 rounded-full font-bold uppercase">
                  IN STOCK
                </span>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                HISTORICAL SIGNIFICANCE
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                {jersey.description}
              </p>
              <p className="text-xs text-neutral-400 font-mono border-t border-neutral-900 pt-3">
                <strong>HISTORIC MOMENT:</strong> {jersey.historyDetails}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono text-neutral-400 mb-2">
                <span>AVAILABLE SIZES</span>
                <span className="text-[#C21E3C]">RELAXED VINTAGE FIT</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {jersey.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl font-display text-base uppercase font-bold transition-all border ${
                      selectedSize === size
                        ? 'bg-[#C21E3C] text-white border-[#C21E3C] shadow-lg shadow-[#C21E3C]/25'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Chart Toggle */}
            <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl overflow-hidden mt-2 mb-4">
              <button
                onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}
                className="w-full flex items-center justify-between p-4 text-sm font-mono text-neutral-300 hover:text-white transition-colors"
              >
                <span>SIZE GUIDE</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSizeGuideOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSizeGuideOpen && (
                <div className="p-4 border-t border-neutral-900">
                  <table className="w-full text-xs font-mono text-left mb-3">
                    <thead className="text-neutral-500 border-b border-neutral-800">
                      <tr>
                        <th className="py-2">SIZE</th>
                        <th className="py-2">CHEST (cm)</th>
                        <th className="py-2">LENGTH (cm)</th>
                        <th className="py-2">SHOULDERS (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-300">
                      <tr className="border-b border-neutral-900/50">
                        <td className="py-2 text-white font-bold">M</td>
                        <td className="py-2">96-101</td>
                        <td className="py-2">71</td>
                        <td className="py-2">43</td>
                      </tr>
                      <tr className="border-b border-neutral-900/50">
                        <td className="py-2 text-white font-bold">L</td>
                        <td className="py-2">101-106</td>
                        <td className="py-2">73</td>
                        <td className="py-2">45</td>
                      </tr>
                      <tr className="border-b border-neutral-900/50">
                        <td className="py-2 text-white font-bold">XL</td>
                        <td className="py-2">106-111</td>
                        <td className="py-2">75</td>
                        <td className="py-2">47</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-white font-bold">XXL</td>
                        <td className="py-2">111-116</td>
                        <td className="py-2">77</td>
                        <td className="py-2">49</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-[10px] text-neutral-500 italic">
                    Measurements are for the jersey itself. For a looser fit, size up.
                  </p>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-4">
              <span className="text-xs font-mono text-neutral-400 uppercase">QUANTITY</span>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-neutral-400 hover:text-white font-mono text-base"
                >
                  -
                </button>
                <span className="font-mono text-sm font-bold text-white px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-neutral-400 hover:text-white font-mono text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#C21E3C] hover:bg-[#A0152F] text-white py-4 rounded-full font-display text-base uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C21E3C]/25"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>ADD TO BAG</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-white hover:bg-neutral-200 text-black px-8 py-4 rounded-full font-display text-base uppercase tracking-wider font-bold transition-all"
              >
                BUY NOW
              </button>

              <button
                onClick={() => toggleWishlist(jersey.id)}
                className={`p-4 rounded-full border transition-all ${
                  favorited ? 'bg-[#C21E3C] text-white border-[#C21E3C]' : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                }`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Spec Details */}
            <div className="bg-[#0A0A0A] border border-neutral-900 rounded-2xl p-4 text-xs font-mono text-neutral-400 space-y-2">
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span>DELIVERY:</span>
                <span className="text-emerald-400 font-bold">ROOM DELIVERY SUPPORTED</span>
              </div>
              <div className="flex justify-between">
                <span>AUTHENTICITY:</span>
                <span className="text-white">100% Period-Correct Verified</span>
              </div>
            </div>

          </div>

        </div>

        {/* Related Jerseys */}
        {relatedJerseys.length > 0 && (
          <div className="border-t border-neutral-900 pt-12">
            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white mb-6">
              RELATED ARCHIVE PIECES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedJerseys.map((rj) => (
                <Link
                  key={rj.id}
                  to={`/product/${rj.id}`}
                  className="bg-[#0D0D0D] border border-neutral-800 rounded-2xl p-3 hover:border-[#C21E3C] transition-all group"
                >
                  <img
                    src={rj.mainImage}
                    alt={rj.name}
                    className="w-full aspect-[4/3] object-cover rounded-xl bg-neutral-950 mb-3"
                  />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">{rj.clubOrCountry}</span>
                  <h4 className="font-display text-base font-bold uppercase text-white truncate group-hover:text-[#C21E3C]">
                    {rj.name}
                  </h4>
                  <p className="font-mono text-sm font-bold text-white mt-1">{formatNaira(rj.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
