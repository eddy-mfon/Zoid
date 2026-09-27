/* ZOID Storefront — Authentication Context & Session Storage */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { formatNaira } from "./ShopContext";

export interface OrderItem {
  slug: string;
  name: string;
  size: string;
  quantity: number;
  price: string;
  image: string;
  customization?: string;
}

export interface UserOrder {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  formattedTotal: string;
  deliveryAddress: string;
  deliveryMethod?: string;
  deliveryFee?: number;
  isStudent?: boolean;
  status: "Processing" | "In Transit" | "Delivered";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  orders: UserOrder[];
  wishlist: string[];
}

interface AuthContextValue {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, password?: string) => boolean;
  signup: (name: string, email: string, phone: string, password?: string) => boolean;
  logout: () => void;
  addOrder: (orderData: {
    items: OrderItem[];
    total: number;
    deliveryAddress: string;
    deliveryMethod?: string;
    deliveryFee?: number;
    isStudent?: boolean;
  }) => UserOrder;
  toggleWishlist: (slug: string) => void;
  wishlist: string[];
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup";
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
}

const STORAGE_KEY = "zoid_user_session_v1";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  // Sync to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore quota errors
    }
  }, [user]);

  function openAuthModal(mode: "login" | "signup" = "login") {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }

  function closeAuthModal() {
    setIsAuthModalOpen(false);
  }

  function login(email: string, _password?: string) {
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      toast.success(`Welcome back, ${user.name}!`, { description: "Session active." });
      closeAuthModal();
      return true;
    }

    const nameFromEmail = email.split("@")[0].replace(/[^a-zA-Z]/g, " ");
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    const loggedInUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: formattedName || "Zoid Community Member",
      email: email.trim(),
      phone: "+234 800 000 0000",
      createdAt: new Date().toISOString().split("T")[0],
      wishlist: [],
      orders: [],
    };

    setUser(loggedInUser);
    toast.success(`Welcome back, ${loggedInUser.name}!`);
    closeAuthModal();
    return true;
  }

  function signup(name: string, email: string, phone: string, _password?: string) {
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "+234 800 000 0000",
      createdAt: new Date().toISOString().split("T")[0],
      wishlist: [],
      orders: [],
    };

    setUser(newUser);
    toast.success(`Account created successfully! Welcome to ZOID, ${name}.`);
    closeAuthModal();
    return true;
  }

  function logout() {
    setUser(null);
    toast.success("Logged out of ZOID account");
  }

  function addOrder(orderData: {
    items: OrderItem[];
    total: number;
    deliveryAddress: string;
    deliveryMethod?: string;
    deliveryFee?: number;
    isStudent?: boolean;
  }): UserOrder {
    const newOrder: UserOrder = {
      id: `ZD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      date: new Date().toISOString().split("T")[0],
      items: orderData.items,
      total: orderData.total,
      formattedTotal: formatNaira(orderData.total),
      deliveryAddress: orderData.deliveryAddress,
      deliveryMethod: orderData.deliveryMethod,
      deliveryFee: orderData.deliveryFee,
      isStudent: orderData.isStudent,
      status: "Processing",
    };

    if (user) {
      setUser((prev) => (prev ? { ...prev, orders: [newOrder, ...prev.orders] } : prev));
    }

    return newOrder;
  }

  function toggleWishlist(slug: string) {
    if (!user) {
      toast.info("Sign in or create an account to save items to your wishlist");
      return;
    }

    setUser((prev) => {
      if (!prev) return prev;
      const exists = prev.wishlist.includes(slug);
      const updated = exists ? prev.wishlist.filter((s) => s !== slug) : [...prev.wishlist, slug];
      toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
      return { ...prev, wishlist: updated };
    });
  }

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      login,
      signup,
      logout,
      addOrder,
      toggleWishlist,
      wishlist: user ? user.wishlist : [],
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
    }),
    [user, isAuthModalOpen, authModalMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
