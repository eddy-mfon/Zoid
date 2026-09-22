import { Link, useLocation } from "wouter";
import { Search, Heart, ShoppingBag, Menu, X, User, LogIn } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  scrolled: boolean;
  mobileMenu: boolean;
  setMobileMenu: (open: boolean) => void;
  utilityOpen: "search" | "saved" | null;
  setUtilityOpen: (type: "search" | "saved" | null) => void;
  setCartOpen: (open: boolean) => void;
  savedCount: number;
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
}: NavbarProps) {
  const [location] = useLocation();
  const { count: cartCount } = useShop();
  const { isLoggedIn, user, openAuthModal, wishlist } = useAuth();

  const isShopOrProduct = location.startsWith("/collection") || location.startsWith("/product");
  const activeWishlistCount = isLoggedIn ? wishlist.length : savedCount;

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

          {/* Mobile Auth Links */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #222", width: "100%", display: "none" }} className="mobile-auth-strip">
            {isLoggedIn ? (
              <Link href="/profile" className="pink-button small" onClick={() => setMobileMenu(false)}>
                <User size={14} /> My Profile ({user?.name.split(" ")[0]})
              </Link>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="pink-button small" onClick={() => { setMobileMenu(false); openAuthModal("login"); }}>
                  <LogIn size={13} /> Log In
                </button>
                <button className="ghost-button small" onClick={() => { setMobileMenu(false); openAuthModal("signup"); }}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="top-actions action-rail">
        {/* Search */}
        <button
          aria-label="Search products"
          title="Search"
          className={utilityOpen === "search" ? "icon-button utility-active" : "icon-button"}
          onClick={() => setUtilityOpen(utilityOpen === "search" ? null : "search")}
        >
          <Search size={16} />
        </button>

        {/* Wishlist button */}
        <button
          aria-label="Open wishlist"
          title="Wishlist"
          className={utilityOpen === "saved" ? "icon-button saved-button utility-active" : "icon-button saved-button"}
          onClick={() => {
            if (!isLoggedIn) {
              openAuthModal("login");
            } else {
              setUtilityOpen(utilityOpen === "saved" ? null : "saved");
            }
          }}
        >
          <Heart size={16} fill={activeWishlistCount ? "currentColor" : "none"} color={activeWishlistCount ? "var(--pink)" : undefined} />
          {activeWishlistCount > 0 && <b>{activeWishlistCount}</b>}
        </button>

        {/* Cart Bag button (Shop & Product pages) */}
        {isShopOrProduct && (
          <button
            className="bag-button"
            title="Bag"
            aria-label={`Open bag with ${cartCount} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={15} />
            <span>{cartCount}</span>
          </button>
        )}

        {/* AUTH BUTTONS OR PROFILE BUTTON */}
        {isLoggedIn ? (
          <Link
            href="/profile"
            aria-label="User Profile"
            title={`Profile: ${user?.name}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 12px", background: "rgba(231,25,75,0.12)",
              border: "1px solid var(--pink)", borderRadius: 20,
              color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}
          >
            <User size={13} color="var(--pink)" />
            <span>{user?.name.split(" ")[0]}</span>
          </Link>
        ) : (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              onClick={() => openAuthModal("login")}
              style={{
                fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
                fontWeight: 700, color: "#e8e2da", padding: "6px 12px",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 3,
                background: "transparent", cursor: "pointer"
              }}
            >
              Log In
            </button>
            <button
              onClick={() => openAuthModal("signup")}
              style={{
                fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
                fontWeight: 700, color: "#fff", padding: "6px 12px",
                border: "1px solid var(--pink)", borderRadius: 3,
                background: "var(--pink)", cursor: "pointer"
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Mobile menu toggle */}
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
