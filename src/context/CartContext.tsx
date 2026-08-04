import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Jersey, CartItem, OrderCheckoutData, Order } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (jersey: Jersey, size: 'S' | 'M' | 'L' | 'XL' | 'XXL', quantity?: number) => void;
  removeFromCart: (jerseyId: string, size: string) => void;
  updateQuantity: (jerseyId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  subtotal: number;
  discount: number;
  total: number;
  totalItemCount: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  activeOrder: Order | null;
  placeOrder: (checkoutData: OrderCheckoutData) => Order;
  selectedJerseyForModal: Jersey | null;
  setSelectedJerseyForModal: (jersey: Jersey | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zoid_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedJerseyForModal, setSelectedJerseyForModal] = useState<Jersey | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('zoid_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const addToCart = (jersey: Jersey, size: 'S' | 'M' | 'L' | 'XL' | 'XXL' = 'L', quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.jersey.id === jersey.id && item.size === size);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { jersey, size, quantity }];
    });

    showToast("ADDED TO BAG", `${jersey.name} (Size ${size})`, jersey.mainImage, "cart");
  };

  const removeFromCart = (jerseyId: string, size: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.jersey.id === jerseyId && item.size === size)));
  };

  const updateQuantity = (jerseyId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(jerseyId, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.jersey.id === jerseyId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.jersey.price * item.quantity, 0);
  const discount = Math.round(subtotal * discountPercent);
  const total = Math.max(0, subtotal - discount);

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const applyPromoCode = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'ZOID10' || formatted === 'STREET10' || formatted === 'RETRO10') {
      setPromoCode(formatted);
      setDiscountPercent(0.10); // 10% off
      showToast("PROMO APPLIED", "10% VIP Discount applied to order", undefined, "info");
      return true;
    } else if (formatted === 'ZOID20' || formatted === 'VIP20') {
      setPromoCode(formatted);
      setDiscountPercent(0.20); // 20% off
      showToast("VIP CODE APPLIED", "20% Exclusive Collector Discount applied", undefined, "info");
      return true;
    } else {
      showToast("INVALID CODE", "Try 'ZOID10' or 'VIP20'", undefined, "info");
      return false;
    }
  };

  const placeOrder = (checkoutData: OrderCheckoutData): Order => {
    const newOrder: Order = {
      id: `ZOID-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      items: [...cartItems],
      subtotal,
      discount,
      total,
      checkoutInfo: checkoutData,
      status: 'CONFIRMED'
    };

    setActiveOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    showToast("ORDER PLACED", `Order #${newOrder.id} confirmed for Room ${checkoutData.roomNumber}`, undefined, "cart");
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        subtotal,
        discount,
        total,
        totalItemCount,
        promoCode,
        applyPromoCode,
        activeOrder,
        placeOrder,
        selectedJerseyForModal,
        setSelectedJerseyForModal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
