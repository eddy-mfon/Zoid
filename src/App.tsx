import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { ProductModal } from './components/product/ProductModal';
import { SearchModal } from './components/search/SearchModal';

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { selectedJerseyForModal, setSelectedJerseyForModal } = useCart();
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#C21E3C] selection:text-white">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>

      <Footer />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Checkout Modal */}
      <CheckoutModal />

      {/* Quick View Product Modal */}
      <ProductModal
        jersey={selectedJerseyForModal}
        onClose={() => setSelectedJerseyForModal(null)}
      />

      {/* Search Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}
