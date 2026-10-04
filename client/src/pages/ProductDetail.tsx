/* ZOID Concrete Ritual: product pages behave like archive dossiers—specific, tactile, and practical. */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useZoidMotion } from "@/hooks/useZoidMotion";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
  Edit3
} from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { productBySlug, products } from "@/lib/catalog";
import { useShop, formatNaira } from "@/contexts/ShopContext";
import Navbar from "@/components/Navbar";

const MARK = "/zoid-logo.svg";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const [, navigate] = useLocation();
  const pageRef = useRef<HTMLElement | null>(null);

  // Synchronous scroll reset BEFORE motion hooks or render
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [params?.slug]);

  // Fallback asynchronous scroll reset to handle async layout shifts / image loads
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [params?.slug]);

  useZoidMotion(pageRef);
  const product = productBySlug(params?.slug) ?? products[0];
  const { addToBag, count, bag } = useShop();

  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [hasCustomization, setHasCustomization] = useState(false);
  const [customizationText, setCustomizationText] = useState("");
  const [added, setAdded] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const activeStock = product.stock[size] ?? 0;
  const lowStock = activeStock > 0 && activeStock <= 3;

  // Reset local product selection state on slug change
  useEffect(() => {
    setSize(product.sizes[0]);
    setQuantity(1);
    setHasCustomization(false);
    setCustomizationText("");
    setAdded(false);
  }, [product.slug]);

  // Scroll tracking for header style and back-to-top button
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleAdd() {
    if (!activeStock) return;
    const custom = hasCustomization && customizationText.trim() ? customizationText.trim() : undefined;
    addToBag(product, size, quantity, custom);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 850);
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // How many of this product/size are currently in bag
  const inBagCount = bag
    .filter((item) => item.slug === product.slug && item.size === size)
    .reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="zoid-shell detail-page" ref={pageRef}>
      {/* Navbar */}
      <Navbar
        scrolled={scrolled}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        setCartOpen={setCartOpen}
      />

      {/* Breadcrumb */}
      <div className="detail-crumb">
        <Link href="/collection">
          <ArrowLeft size={15} /> Back to Shop
        </Link>
        <span>ARCHIVE / {product.category}</span>
      </div>

      {/* Product Layout */}
      <section className="detail-layout">
        {/* Image panel with full jersey view */}
        <div className="detail-gallery" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#0e0e0e" }}>
          <div
            className="detail-gallery-stage"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "min(75vh, 680px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#121212",
              padding: "24px 16px",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                maxWidth: "100%",
                maxHeight: "680px",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
                filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.6))",
              }}
              onLoad={() => window.scrollTo(0, 0)}
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="detail-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-tone">{product.tone}</p>
          <strong className="detail-price">{product.price}</strong>
          <p className="detail-copy">{product.details}</p>

          <div className="delivery-note">
            <span>DELIVERY / {product.delivery.toUpperCase()}</span>
            <small>Stock is reserved once your size is selected.</small>
          </div>

          {/* Size selector (Fit guidance removed as requested) */}
          <div className="selector-block">
            <div className="selector-head">
              <span>SELECT SIZE</span>
            </div>
            <div className="size-grid">
              {product.sizes.map((item) => {
                const itemStock = product.stock[item] ?? 0;
                const unavailable = itemStock === 0;
                return (
                  <button
                    key={item}
                    disabled={unavailable}
                    className={`${size === item ? "size-button selected" : "size-button"} ${unavailable ? "sold-out" : ""}`}
                    onClick={() => setSize(item)}
                  >
                    <span>{item}</span>
                    {unavailable ? <small>Sold out</small> : <small>{itemStock} left</small>}
                    {size === item && <Check size={13} />}
                  </button>
                );
              })}
            </div>
            <div className={lowStock ? "stock-alert low" : "stock-alert"}>
              {lowStock && <AlertTriangle size={14} />}
              <span>{activeStock ? `${activeStock} available in ${size}` : `Sold out in ${size}`}</span>
              {lowStock && <strong>LOW STOCK</strong>}
            </div>
          </div>

          {/* Jersey Customizations Checkbox & Input Box */}
          <div
            style={{
              marginTop: 24,
              padding: "18px 20px",
              background: "#161616",
              border: "1px solid #282828",
              borderRadius: 6,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={hasCustomization}
                onChange={(e) => setHasCustomization(e.target.checked)}
                style={{
                  width: 18,
                  height: 18,
                  accentColor: "var(--pink)",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase" }}>
                Jersey Customizations
              </span>
            </label>

            {hasCustomization && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #252525" }}>
                <p style={{ margin: "0 0 8px", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Describe your custom name, number & sleeve patches:
                </p>
                <textarea
                  rows={2}
                  value={customizationText}
                  onChange={(e) => setCustomizationText(e.target.value)}
                  placeholder="e.g., Name: EDDY, Number: 10, Premier League sleeve patch"
                  style={{
                    width: "100%",
                    background: "#0d0d0d",
                    border: "1px solid #383838",
                    borderRadius: 4,
                    color: "#fff",
                    padding: "10px 12px",
                    fontSize: 12,
                    lineHeight: 1.5,
                    outline: "none",
                    resize: "vertical",
                  }}
                />
                <small style={{ display: "block", marginTop: 6, color: "var(--pink)", fontSize: 10 }}>
                  ✓ Customization notes will be attached to your shirt order.
                </small>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 9, letterSpacing: "0.16em", color: "#9d9891", textTransform: "uppercase" }}>QUANTITY</span>
              <span style={{ fontSize: 11, color: "var(--pink)", fontWeight: 600 }}>
                {quantity} {quantity === 1 ? "piece" : "pieces"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#161616",
                  border: "1px solid #333",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  style={{
                    width: 42,
                    height: 38,
                    display: "grid",
                    placeItems: "center",
                    color: quantity <= 1 ? "#555" : "#fff",
                    cursor: quantity <= 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <Minus size={15} />
                </button>
                <span style={{ minWidth: 44, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(activeStock || 10, q + 1))}
                  disabled={quantity >= activeStock}
                  aria-label="Increase quantity"
                  style={{
                    width: 42,
                    height: 38,
                    display: "grid",
                    placeItems: "center",
                    color: quantity >= activeStock ? "#555" : "#fff",
                    cursor: quantity >= activeStock ? "not-allowed" : "pointer",
                  }}
                >
                  <Plus size={15} />
                </button>
              </div>

              {inBagCount > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "rgba(179, 13, 13,0.1)",
                    border: "1px solid rgba(179, 13, 13,0.3)",
                    borderRadius: 4,
                  }}
                >
                  <ShoppingBag size={13} style={{ color: "var(--pink)" }} />
                  <span style={{ fontSize: 10, color: "var(--pink)", fontWeight: 600 }}>{inBagCount} in bag</span>
                </div>
              )}
            </div>
          </div>

          {/* Add to Bag CTA */}
          <button
            disabled={!activeStock}
            className={added ? "pink-button detail-add added" : "pink-button detail-add"}
            onClick={handleAdd}
          >
            {added ? (
              <>
                <Check size={17} /> Added {quantity} to bag
              </>
            ) : (
              <>
                Add {quantity > 1 ? `${quantity} items ` : ""}to Bag <ArrowDownRight size={17} />
              </>
            )}
          </button>

          {/* View bag shortcut */}
          <button
            onClick={() => setCartOpen(true)}
            className="ghost-button"
            style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
          >
            <ShoppingBag size={15} /> View Bag ({count} items) <ChevronRight size={15} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer detail-footer">
        <div className="footer-topline">
          <span>ZOID / LAGOS</span>
          <span>CURATING BEFORE CREATING</span>
        </div>
        <div className="footer-core">
          <Link className="footer-wordmark" href="/">
            <img src={MARK} alt="" />
            <span>ZOID</span>
          </Link>
          <p>
            For the ones still rising.
            <br />
            Archive-led sportwear from Lagos.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(179, 13, 13,0.08)", border: "1px solid rgba(179, 13, 13,0.25)", borderRadius: 4, marginTop: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 10, letterSpacing: "0.08em", color: "#aaa" }}>
              HOTLINE / EMERGENCIES: <a href="tel:09020711737" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "none" }}>09020711737</a>
            </span>
          </div>
          <Link className="footer-cta" href="/collection">
            Enter the edit <ArrowDownRight size={16} />
          </Link>
        </div>
        <div className="footer-bottom">
          <span>© ZOID / 2026</span>
          <span>Lagos — Nigeria</span>
          <span>Hotline: <a href="tel:09020711737" style={{ color: "inherit", textDecoration: "none" }}>09020711737</a></span>
          <span>
            Built on grit <b>•</b> Worn with intent
          </span>
        </div>
      </footer>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <div>
                <p className="eyebrow">YOUR SELECTION</p>
                <h3>THE BAG / {count.toString().padStart(2, "00")}</h3>
              </div>
              <button onClick={() => setCartOpen(false)} aria-label="Close bag">
                <X size={20} />
              </button>
            </div>
            {bag.length > 0 ? (
              <>
                <div style={{ maxHeight: "calc(100vh - 240px)", overflowY: "auto", margin: "16px 0" }}>
                  {bag.map((item, idx) => (
                    <div key={`${item.slug}-${item.size}-${idx}`} className="drawer-item">
                      <img src={item.image} alt="" />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.price}</span>
                        <small>
                          Size {item.size} · Qty {item.quantity}
                        </small>
                        {item.customization && (
                          <small style={{ color: "var(--pink)", fontWeight: 600 }}>
                            Customization: {item.customization}
                          </small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="pink-button checkout"
                  onClick={() => {
                    setCartOpen(false);
                    navigate("/checkout");
                  }}
                >
                  Proceed to checkout <ArrowDownRight size={17} />
                </button>
              </>
            ) : (
              <div className="empty-bag">
                <ShoppingBag size={32} />
                <p>Your bag is waiting for a first selection.</p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Scroll-to-top FAB */}
      {showScrollTop && (
        <button
          onClick={scrollTop}
          aria-label="Back to top"
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 50,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--pink)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 4px 20px rgba(179, 13, 13,0.4)",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s ease, opacity 0.2s ease",
          }}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </main>
  );
}
