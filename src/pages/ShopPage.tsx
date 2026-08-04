import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JERSEYS } from '../data/jerseys';
import { useWishlist } from '../context/WishlistContext';
import { Search, Heart, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';

export const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(filterParam === 'wishlist');

  const { wishlistIds } = useWishlist();

  const categories = ['ALL', 'Club', 'National', 'Retro Collection', 'Limited Drop'];

  const filteredJerseys = useMemo(() => {
    return JERSEYS.filter((jersey) => {
      // Category filter
      if (selectedCategory !== 'ALL' && jersey.category !== selectedCategory) {
        return false;
      }

      // Wishlist filter
      if (showWishlistOnly && !wishlistIds.includes(jersey.id)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = jersey.name.toLowerCase().includes(q);
        const matchesClub = jersey.clubOrCountry.toLowerCase().includes(q);
        const matchesSeason = jersey.season.toLowerCase().includes(q);
        if (!matchesName && !matchesClub && !matchesSeason) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [selectedCategory, searchQuery, sortBy, showWishlistOnly, wishlistIds]);

  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-20 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-left space-y-2">
          <span className="text-xs font-sans text-[#C21E3C] uppercase tracking-[0.2em] font-bold block">
            THE ARCHIVE CATALOGUE
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            {showWishlistOnly ? 'SAVED WISHLIST' : 'RETRO FOOTBALL SHOP'}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
            Browse authentic vintage kits, iconic club champions, and exclusive limited drops. All prices in Nigerian Naira (₦). Express delivery available.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#0A0A0A] border border-neutral-900 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xl">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowWishlistOnly(false);
                }}
                className={`px-4 py-2 rounded-full font-sans text-xs uppercase tracking-wider transition-all border ${
                  selectedCategory === cat && !showWishlistOnly
                    ? 'bg-[#C21E3C] text-white border-[#C21E3C] font-bold shadow-md'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700 font-medium'
                }`}
              >
                {cat === 'ALL' ? 'ALL KITS' : cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search jerseys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121212] border border-neutral-800 rounded-full pl-9 pr-4 py-2 text-xs font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-[#C21E3C]"
              />
            </div>

            {/* Sort Selector */}
            <div className="relative w-full sm:w-auto shrink-0">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full bg-[#121212] border border-neutral-800 text-white rounded-full px-4 py-2 text-xs font-sans focus:outline-none focus:border-[#C21E3C] appearance-none pr-8 cursor-pointer"
              >
                <option value="featured">SORT: FEATURED</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
                <option value="rating">TOP RATED</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Product Grid - 3 columns on desktop like screenshot */}
        {filteredJerseys.length === 0 ? (
          <div className="text-center py-20 bg-[#0A0A0A] border border-neutral-900 rounded-2xl p-8">
            <h3 className="font-display text-xl font-bold uppercase text-white mb-2">
              NO JERSEYS MATCH YOUR SEARCH
            </h3>
            <p className="text-neutral-400 text-xs font-sans mb-6">
              Try adjusting your category filter, search query, or clear your wishlist selection.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setShowWishlistOnly(false);
              }}
              className="bg-[#C21E3C] text-white px-6 py-2.5 rounded-full font-sans text-xs uppercase font-bold tracking-wider"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredJerseys.map((jersey) => (
              <ProductCard key={jersey.id} jersey={jersey} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
