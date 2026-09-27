import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Heart, ShoppingBag, Menu, X, User, ArrowRight } from "lucide-react";
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

        {/* Center Nav Links - ONLY standard page navigation links */}
        <div className="nav-frame">
          <nav className={isMobileMenuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href === "/" && location === "");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={isActive ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile-only auth links inside drawer */}
            {isMobileMenuOpen && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid #282828",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {isLoggedIn ? (
                  <Link
                    href="/profile"
                    className="pink-button small"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ justifyContent: "center", width: "100%", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <User size={14} /> Profile
                  </Link>
                ) : (
                  <div style={{ display: "flex", gap: 8, width: "100%" }}>
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
              </div>
            )}
          </nav>
        </div>

        {/* Right Action Rail */}
        <div className="top-actions action-rail">
          {/* Search Button */}
          {externalSetUtilityOpen ? (
            <button
              aria-label="Search products"
              title="Search"
              className={externalUtilityOpen === "search" ? "icon-button utility-active" : "icon-button"}
              onClick={() => externalSetUtilityOpen(externalUtilityOpen === "search" ? null : "search")}
            >
              <Search size={16} />
            </button>
          ) : (
            <Link href="/?search=1" className="icon-button" aria-label="Search products" title="Search">
              <Search size={16} />
            </Link>
          )}

          {/* Wishlist Button - opens wishlist panel directly */}
          <button
            aria-label="Open wishlist"
            title="Wishlist"
            className={
              (externalUtilityOpen === "saved" || internalWishlistOpen)
                ? "icon-button saved-button utility-active"
                : "icon-button saved-button"
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

          {/* AUTH: Profile Icon when signed in; Log In / Sign Up buttons when NOT signed in */}
          {isLoggedIn ? (
            <Link
              href="/profile"
              className="icon-button"
              aria-label="Profile"
              title="Profile"
              style={{
                background: "rgba(231,25,75,0.12)",
                border: "1px solid var(--pink)",
                color: "var(--pink)",
                borderRadius: "50%",
                width: 36,
                minWidth: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
              }}
            >
              <User size={16} />
            </Link>
          ) : (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Link
                href="/login"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#ded8d0",
                  padding: "6px 11px",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: 3,
                  background: "transparent",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#fff",
                  padding: "6px 11px",
                  border: "1px solid var(--pink)",
                  borderRadius: 3,
                  background: "var(--pink)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                Sign Up
              </Link>
            </div>
          )}

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
