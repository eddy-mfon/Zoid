import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';
import { JERSEYS } from '../data/jerseys';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (jerseyId: string) => void;
  isWishlisted: (jerseyId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zoid_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('zoid_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const toggleWishlist = (jerseyId: string) => {
    const jersey = JERSEYS.find(j => j.id === jerseyId);
    setWishlistIds((prev) => {
      const exists = prev.includes(jerseyId);
      if (exists) {
        showToast("WISHLIST REMOVED", jersey?.name || "Item removed from saved", jersey?.mainImage, "wishlist");
        return prev.filter((id) => id !== jerseyId);
      } else {
        showToast("WISHLIST SAVED", jersey?.name || "Item added to favorites", jersey?.mainImage, "wishlist");
        return [...prev, jerseyId];
      }
    });
  };

  const isWishlisted = (jerseyId: string) => wishlistIds.includes(jerseyId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
