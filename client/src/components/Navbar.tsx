import { Link, useLocation } from "wouter";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";

interface NavbarProps {
  scrolled: boolean;
  mobileMenu: boolean;
  setMobileMenu: (open: boolean) => void;
  utilityOpen: "search" | "saved" | null;
  setUtilityOpen: (type: "search" | "saved" | null) => void;
  setCartOpen: (open: boolean) => void;
  savedCount: number;
  context?: string;
}

const assets = {
  mark: "/zoid-logo.svg",
};

export default function Navbar({
  scrolled,
  mobileMenu,
  setMobileMenu,
  utilityOpen,
  setUtilityOpen,
  setCartOpen,
  savedCount,
  context = "FIELD / 01"
}: NavbarProps) {
  const [location] = useLocation();
  const { count: cartCount } = useShop();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/collection" },
    { label: "About", href: "/about" },
    { label: "Archives", href: "/archives" },
  ];

  return (
    <header className={scrolled ? "topbar topbar-scrolled" : "topbar"}>
      <Link className="brand" href="/" aria-label="ZOID home">
        <img src={assets.mark} alt="ZOID" />
        <span>ZOID</span>
        <i />
      </Link>
      <div className="nav-frame">
        <span className="nav-context">{context}</span>
        <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href.startsWith("/#") && location === "/");
            return (
              <Link 
                key={item.label} 
                href={item.href} 
                className={isActive ? "active" : ""}
                onClick={() => setMobileMenu(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="top-actions action-rail">
        <button 
          aria-label="Search products" 
          title="Search" 
          className={utilityOpen === "search" ? "icon-button utility-active" : "icon-button"} 
          onClick={() => setUtilityOpen(utilityOpen === "search" ? null : "search")}
        >
          <Search size={16} />
        </button>
        <button 
          aria-label="Open wishlist" 
          title="Wishlist" 
          className={utilityOpen === "saved" ? "icon-button saved-button utility-active" : "icon-button saved-button"} 
          onClick={() => setUtilityOpen(utilityOpen === "saved" ? null : "saved")}
        >
          <Heart size={16} fill={savedCount ? "currentColor" : "none"} />
          <b>{savedCount || ""}</b>
        </button>
        <button 
          className="bag-button" 
          title="Bag" 
          aria-label={`Open bag with ${cartCount} items`} 
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag size={15} />
          <span>{cartCount}</span>
        </button>
        <button 
          className="mobile-toggle" 
          aria-label="Toggle menu" 
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
