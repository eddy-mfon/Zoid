import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-neutral-900 py-3.5 shadow-2xl'
          : 'bg-black py-5 border-b border-neutral-900/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl sm:text-3xl font-black tracking-widest text-white group-hover:text-[#C21E3C] transition-colors">
            ZOID
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C21E3C]"></span>
        </Link>

        {/* Depopulated Desktop Navigation: Home | Shop | About */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`text-xs uppercase tracking-[0.25em] font-medium transition-all duration-200 relative py-1 ${
                  isActive ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#C21E3C]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenSearch}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/shop?filter=wishlist')}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-full transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#C21E3C] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative py-2 px-3.5 text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-full transition-all flex items-center gap-2"
            aria-label="Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#C21E3C]" />
            <span className="text-xs font-mono font-bold tracking-wider">
              {totalItemCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0A] border-b border-neutral-800 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-display tracking-widest uppercase text-neutral-300 hover:text-[#C21E3C] py-2 border-b border-neutral-900 flex justify-between items-center"
                >
                  <span>{link.label}</span>
                  <span className="text-neutral-600 text-xs">→</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
