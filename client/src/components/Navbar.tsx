import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Heart, ShoppingBag, Menu, X, User, ArrowRight, Home, Grid } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/lib/catalog";

export interface NavbarProps {
  scrolled?: boolean;
  mobileMenu?: boolean;
  setMobileMenu?: (open: boolean) => void;
  utilityOpen?: "search" | "saved" | null;
  setUtilityOpen?: (type: "search" | "saved" | null) => void;
  setCartOpen?: (open: boolean) => void;
  savedCount?: number;
}

const assets = {
  mark: "/zoid-logo.svg",
};

export default function Navbar({
  scrolled: externalScrolled,
  mobileMenu: externalMobileMenu,
  setMobileMenu: externalSetMobileMenu,
  utilityOpen: externalUtilityOpen,
  setUtilityOpen: externalSetUtilityOpen,
  setCartOpen,
  savedCount = 0,
}: NavbarProps = {}) {
  const [location, navigate] = useLocation();
  const { count: cartCount } = useShop();
  const { isLoggedIn, user, wishlist, toggleWishlist } = useAuth();

  const [internalScrolled, setInternalScrolled] = useState(false);
  const [internalMobileMenu, setInternalMobileMenu] = useState(false);
  const [internalWishlistOpen, setInternalWishlistOpen] = useState(false);

  useEffect(() => {
    if (externalScrolled !== undefined) return;
    const handleScroll = () => {
      setInternalScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [externalScrolled]);

  const isScrolled = externalScrolled ?? internalScrolled;
  const isMobileMenuOpen = externalMobileMenu ?? internalMobileMenu;
  const setIsMobileMenuOpen = externalSetMobileMenu ?? setInternalMobileMenu;

  const isShopOrProduct = location.startsWith("/collection") || location.startsWith("/product");
  const activeWishlistCount = isLoggedIn ? wishlist.length : savedCount;

  // Active Wishlist items
  const wishlistItems = products.filter((p) => wishlist.includes(p.slug));

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/collection" },
    { label: "About", href: "/about" },
    { label: "Archives", href: "/archives" },
  ];

  function handleWishlistClick() {
    if (externalSetUtilityOpen) {
      externalSetUtilityOpen(externalUtilityOpen === "saved" ? null : "saved");
    } else {
      setInternalWishlistOpen((prev) => !prev);
    }
  }

  return (
    <>
      <header className={isScrolled ? "topbar topbar-scrolled" : "topbar"}>
        {/* Brand */}
        <Link className="brand" href="/" aria-label="ZOID home">
          <img src={assets.mark} alt="ZOID" />
          <span>ZOID</span>
          <i />
        </Link>

        {/* Center Nav Links & Mobile Dropdown Drawer */}
        <div className="nav-frame">
          <nav className={isMobileMenuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
            {isMobileMenuOpen && (
              <div className="mobile-menu-header">
                <span className="mobile-menu-title">NAVIGATION</span>
                <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="nav-items-wrap">
              {navItems.map((item) => {
                const isActive = location === item.href || (item.href === "/" && location === "");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={isActive ? "active" : ""}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {isMobileMenuOpen && <ArrowRight size={14} className="mobile-nav-arrow" />}
                  </Link>
                );
              })}
            </div>

            {/* Mobile-only auth links inside drawer */}
            {isMobileMenuOpen && (
              <div className="mobile-menu-auth">
                {isLoggedIn ? (
                  <Link
                    href="/profile"
                    className="pink-button small"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ justifyContent: "center", width: "100%", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <User size={14} /> Profile & Orders
                  </Link>
                ) : (
                  <div style={{ display: "flex", gap: 10, width: "100%" }}>
                    <Link
                      href="/login"
                      className="ghost-button small"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ flex: 1, textAlign: "center", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      className="pink-button small"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ flex: 1, textAlign: "center", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
                <div className="mobile-menu-footer">
                  <span>ZOID STUDIOS / LAGOS</span>
                  <small>Built on grit • Worn with intent</small>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Right Action Rail - PROFILE REMAINS AT TOP HEADER AS REQUESTED */}
        <div className="top-actions action-rail">
          {/* Search Button */}
          {externalSetUtilityOpen ? (
            <button
              aria-label="Search products"
              title="Search"
              className={externalUtilityOpen === "search" ? "icon-button search-top-button utility-active" : "icon-button search-top-button"}
              onClick={() => externalSetUtilityOpen(externalUtilityOpen === "search" ? null : "search")}
            >
              <Search size={16} />
            </button>
          ) : (
            <Link href="/?search=1" className="icon-button search-top-button" aria-label="Search products" title="Search">
              <Search size={16} />
            </Link>
          )}

          {/* Wishlist Button */}
          <button
            aria-label="Open wishlist"
            title="Wishlist"
            className={
              (externalUtilityOpen === "saved" || internalWishlistOpen)
                ? "icon-button saved-button saved-top-button utility-active"
                : "icon-button saved-button saved-top-button"
            }
            onClick={handleWishlistClick}
          >
            <Heart
              size={16}
              fill={activeWishlistCount > 0 ? "currentColor" : "none"}
              color={activeWishlistCount > 0 ? "var(--pink)" : undefined}
            />
            {activeWishlistCount > 0 && <b>{activeWishlistCount}</b>}
          </button>

          {/* Cart Bag button */}
          {(isShopOrProduct || setCartOpen || cartCount > 0) && (
            <button
              className="bag-button"
              title="Bag"
              aria-label={`Open bag with ${cartCount} items`}
              onClick={() => (setCartOpen ? setCartOpen(true) : navigate(isLoggedIn ? "/checkout" : "/login?redirect=/checkout"))}
            >
              <ShoppingBag size={15} />
              <span>{cartCount}</span>
            </button>
          )}

          {/* PROFILE BUTTON AT TOP HEADER - Visible on Desktop & Mobile */}
          <Link
            href={isLoggedIn ? "/profile" : "/login"}
            className="icon-button profile-top-button"
            aria-label="Profile"
            title={isLoggedIn ? `Profile (${user?.name || "Account"})` : "Log In / Profile"}
            style={{
              background: isLoggedIn ? "rgba(231,25,75,0.14)" : "rgba(255,255,255,0.06)",
              border: isLoggedIn ? "1px solid var(--pink)" : "1px solid rgba(255,255,255,0.2)",
              color: isLoggedIn ? "var(--pink)" : "#fff",
              borderRadius: "50%",
              width: 34,
              minWidth: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <User size={16} />
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="mobile-toggle"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── FLOATING MOBILE BOTTOM NAVIGATION BAR (TAKED REFERENCE FROM IMAGE 1) ── */}
      <div className="mobile-bottom-nav-floating">
        <nav className="mobile-bottom-nav-capsule" aria-label="Mobile Bottom Navigation">
          {/* Home */}
          <Link
            href="/"
            className={`mobile-bottom-tab ${location === "/" ? "active" : ""}`}
            aria-label="Home"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          {/* Shop */}
          <Link
            href="/collection"
            className={`mobile-bottom-tab ${location.startsWith("/collection") ? "active" : ""}`}
            aria-label="Shop"
          >
            <ShoppingBag size={18} />
            <span>Shop</span>
          </Link>

          {/* Saved / Wishlist */}
          <button
            type="button"
            className={`mobile-bottom-tab ${(externalUtilityOpen === "saved" || internalWishlistOpen) ? "active" : ""}`}
            onClick={handleWishlistClick}
            aria-label="Wishlist"
          >
            <div className="mobile-tab-icon-wrap">
              <Heart size={18} fill={activeWishlistCount > 0 ? "currentColor" : "none"} />
              {activeWishlistCount > 0 && <span className="mobile-tab-dot">{activeWishlistCount}</span>}
            </div>
            <span>Saved</span>
          </button>

          {/* Cart Bag */}
          <button
            type="button"
            className="mobile-bottom-tab"
            onClick={() => (setCartOpen ? setCartOpen(true) : navigate(isLoggedIn ? "/checkout" : "/login?redirect=/checkout"))}
            aria-label="Bag"
          >
            <div className="mobile-tab-icon-wrap">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="mobile-tab-dot">{cartCount}</span>}
            </div>
            <span>Bag</span>
          </button>
        </nav>
      </div>

      {/* Embedded Wishlist Drawer (for pages where external utility panel is not handled) */}
      {internalWishlistOpen && !externalSetUtilityOpen && (
        <section className="utility-panel" aria-label="Wishlist" style={{ zIndex: 9999 }}>
          <div className="utility-wishlist">
            <div className="utility-panel-head">
              <span>YOUR WISHLIST — {wishlist.length} ITEM{wishlist.length !== 1 ? "S" : ""}</span>
              <button onClick={() => setInternalWishlistOpen(false)} aria-label="Close wishlist">
                <X size={17} />
              </button>
            </div>

            {wishlistItems.length > 0 ? (
              <div style={{ maxHeight: 380, overflowY: "auto", marginTop: 8 }}>
                {wishlistItems.map((item) => (
                  <div
                    key={item.slug}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid #2c2724",
                    }}
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setInternalWishlistOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, textDecoration: "none", color: "#fff" }}
                    >
                      <img src={item.image} alt={item.name} style={{ width: 44, height: 54, objectFit: "cover", borderRadius: 3 }} />
                      <div>
                        <strong style={{ fontSize: 11, textTransform: "uppercase", display: "block" }}>{item.name}</strong>
                        <small style={{ color: "var(--pink)", fontSize: 11, fontWeight: 600 }}>{item.price}</small>
                      </div>
                    </Link>
                    <button
                      onClick={() => toggleWishlist(item.slug)}
                      style={{ color: "#777", padding: 6 }}
                      title="Remove from wishlist"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
                <Link
                  href="/collection"
                  className="pink-button"
                  onClick={() => setInternalWishlistOpen(false)}
                  style={{ marginTop: 14, width: "100%", justifyContent: "center", fontSize: 10 }}
                >
                  Continue Shopping <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="utility-empty" style={{ padding: "30px 10px" }}>
                <Heart size={28} color="var(--pink)" />
                <p style={{ fontSize: 12, margin: 0, color: "#ccc" }}>Your wishlist is currently empty.</p>
                <small style={{ color: "#777", fontSize: 10 }}>Save pieces you want to keep an eye on.</small>
                <Link
                  href="/collection"
                  className="pink-button small"
                  onClick={() => setInternalWishlistOpen(false)}
                  style={{ marginTop: 10 }}
                >
                  Explore Collection
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
