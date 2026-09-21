/* ZOID Concrete Ritual: product pages behave like archive dossiers—specific, tactile, and practical. */
import { useEffect, useRef, useState } from "react";
import { useZoidMotion } from "@/hooks/useZoidMotion";
import { AlertTriangle, ArrowDownRight, ArrowLeft, ArrowUp, Check, ChevronRight, Menu, Minus, Plus, Ruler, ShoppingBag, X } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { productBySlug, products } from "@/lib/catalog";
import { useShop } from "@/contexts/ShopContext";

const MARK = "/zoid-logo.svg";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const [, navigate] = useLocation();
  const pageRef = useRef<HTMLElement | null>(null);
  useZoidMotion(pageRef);
  const product = productBySlug(params?.slug) ?? products[0];
  const { addToBag, count, bag } = useShop();
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeStock = product.stock[size] ?? 0;
  const lowStock = activeStock > 0 && activeStock <= 3;

  // Immediate scroll reset on mount or product switch — use instant behavior to avoid scroll-down bug
  useEffect(() => {
    // Use a small timeout to ensure React has finished rendering before scroll
    const timer = requestAnimationFrame(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    setSize(product.sizes[0]);
    setQuantity(1);
    setAdded(false);
    return () => cancelAnimationFrame(timer);
  }, [product.slug]);

  // Scroll tracking
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
    addToBag(product, size, quantity);
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
    <main className="zoid-shell detail-page" ref={pageRef} style={{ overscrollBehavior: "none" }}>
      {/* Navbar */}
      <header className={scrolled ? "topbar topbar-scrolled" : "topbar"}>
        <Link className="brand" href="/">
          <img src={MARK} alt="ZOID" />
          <span>ZOID</span>
          <i />
        </Link>
        <div className="nav-frame">
          <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
            <Link href="/">Home</Link>
            <Link className="active" href="/collection">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/archives">Archives</Link>
          </nav>
        </div>
        <div className="top-actions action-rail">
          {/* Bag button opens cart drawer */}
          <button
            className="bag-button"
            aria-label={`Open bag, ${count} items`}
            onClick={() => setCartOpen(true)}
            style={{ position: "relative" }}
          >
            <ShoppingBag size={15} />
            <span>{count}</span>
            {count > 0 && (
              <span style={{
                position: "absolute", top: -5, right: -5,
                background: "var(--pink)", color: "#fff",
                borderRadius: "50%", width: 16, height: 16,
                fontSize: 9, display: "grid", placeItems: "center", fontWeight: 700
              }}>{count}</span>
            )}
          </button>
          <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="detail-crumb">
        <Link href="/collection"><ArrowLeft size={15} /> Back to Shop</Link>
        <span>ARCHIVE / {product.category}</span>
      </div>

      {/* Product Layout */}
      <section className="detail-layout">
        {/* Image panel */}
        <div className="detail-gallery">
          <div className="detail-gallery-stage">
            <img src={product.image} alt={product.name} />
          </div>
          {/* No 'ZOID ARCHIVE' overlay text — removed per task */}
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

          {/* Size selector */}
          <div className="selector-block">
            <div className="selector-head">
              <span>SELECT SIZE</span>
              <button className="fit-trigger" onClick={() => document.getElementById("fit-guide")?.scrollIntoView({ behavior: "smooth" })}>
                <Ruler size={13} /> Fit guidance
              </button>
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

          {/* Quantity Selector */}
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 9, letterSpacing: "0.16em", color: "#9d9891", textTransform: "uppercase" }}>QUANTITY</span>
              <span style={{ fontSize: 11, color: "var(--pink)", fontWeight: 600 }}>{quantity} {quantity === 1 ? "piece" : "pieces"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "inline-flex", alignItems: "center", background: "#161616", border: "1px solid #333", borderRadius: 4, overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  style={{ width: 42, height: 38, display: "grid", placeItems: "center", color: quantity <= 1 ? "#555" : "#fff", cursor: quantity <= 1 ? "not-allowed" : "pointer" }}
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
                  style={{ width: 42, height: 38, display: "grid", placeItems: "center", color: quantity >= activeStock ? "#555" : "#fff", cursor: quantity >= activeStock ? "not-allowed" : "pointer" }}
                >
                  <Plus size={15} />
                </button>
              </div>
              {/* In-bag counter for this product+size */}
              {inBagCount > 0 && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", background: "rgba(231,25,75,0.1)",
                  border: "1px solid rgba(231,25,75,0.3)", borderRadius: 4,
                }}>
                  <ShoppingBag size={13} style={{ color: "var(--pink)" }} />
                  <span style={{ fontSize: 10, color: "var(--pink)", fontWeight: 600 }}>
                    {inBagCount} in bag
                  </span>
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
            {added ? <><Check size={17} /> Added {quantity} to bag</> : <>Add {quantity > 1 ? `${quantity} items ` : ""}to Bag <ArrowDownRight size={17} /></>}
          </button>

          {/* View bag shortcut */}
          <button
            onClick={() => setCartOpen(true)}
            className="ghost-button"
            style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
          >
            <ShoppingBag size={15} /> View Bag ({count} items) <ChevronRight size={15} />
          </button>

          <div className="detail-meta">
            <div>
              <span>01</span>
              <p>Curated, not mass-produced.<br />Built for repeat wear.</p>
            </div>
            <div>
              <span>02</span>
              <p>Ships from Lagos.<br />Priced in Nigerian Naira.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fit Guide */}
      <section className="fit-guide" id="fit-guide">
        <div>
          <p className="eyebrow">FIT NOTE / {product.fit}</p>
          <h2>WEAR IT<br /><span>YOUR WAY.</span></h2>
        </div>
        <div>
          <p>{product.fitNote}</p>
          <Link className="line-link" href="/collection">Continue through the edit <ArrowDownRight size={16} /></Link>
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
          <p>For the ones still rising.<br />Archive-led sportwear from Lagos.</p>
          <Link className="footer-cta" href="/collection">
            Enter the edit <ArrowDownRight size={16} />
          </Link>
        </div>
        <div className="footer-bottom">
          <span>© ZOID / 2026</span>
          <span>Lagos — Nigeria</span>
          <span>Built on grit <b>•</b> Worn with intent</span>
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
              <button onClick={() => setCartOpen(false)} aria-label="Close bag"><X size={20} /></button>
            </div>
            {bag.length > 0 ? (
              <>
                {bag.map((item) => (
                  <div key={`${item.slug}-${item.size}`} className="drawer-item">
                    <img src={item.image} alt="" />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.price}</span>
                      <small>Size {item.size} · Qty {item.quantity}</small>
                    </div>
                  </div>
                ))}
                <button className="pink-button checkout" onClick={() => { setCartOpen(false); navigate("/checkout"); }}>
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
            position: "fixed", bottom: 28, right: 28, zIndex: 50,
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--pink)", color: "#fff",
            display: "grid", placeItems: "center",
            boxShadow: "0 4px 20px rgba(231,25,75,0.4)",
            border: "none", cursor: "pointer",
            transition: "transform 0.2s ease, opacity 0.2s ease"
          }}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </main>
  );
}
