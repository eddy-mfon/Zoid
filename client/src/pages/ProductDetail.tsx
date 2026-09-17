/* ZOID Concrete Ritual: product pages behave like archive dossiers—specific, tactile, and practical. */
import { useEffect, useRef, useState } from "react";
import { useZoidMotion } from "@/hooks/useZoidMotion";
import { AlertTriangle, ArrowDownRight, ArrowLeft, ArrowUp, Check, ChevronRight, Menu, Ruler, ShoppingBag, X } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { productBySlug, products } from "@/lib/catalog";
import { useShop } from "@/contexts/ShopContext";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const [, navigate] = useLocation();
  const pageRef = useRef<HTMLElement | null>(null);
  useZoidMotion(pageRef);
  const product = productBySlug(params?.slug) ?? products[0];
  const { addToBag, count, bag } = useShop();
  const [size, setSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const activeStock = product.stock[size] ?? 0;
  const lowStock = activeStock > 0 && activeStock <= 3;

  useEffect(() => { setSize(product.sizes[0]); setAdded(false); }, [product.slug]);

  // Scroll-to-top visibility + smooth body scroll
  useEffect(() => {
    const el = pageRef.current ?? document.documentElement;
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Ensure smooth scroll on detail page
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  function handleAdd() {
    if (!activeStock) return;
    addToBag(product, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 850);
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="zoid-shell detail-page" ref={pageRef} style={{ overscrollBehavior: "none" }}>
      {/* Navbar */}
      <header className="topbar">
        <Link className="brand" href="/">
          <img src="/manus-storage/zoid-mark_c4232248.png" alt="" />
          <span>ZOID</span>
          <i />
        </Link>
        <div className="nav-frame">
          <span className="nav-context">FIELD / 03</span>
          <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
            <Link href="/">Home</Link>
            <Link className="active" href="/collection">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/archives">Archives</Link>
          </nav>
        </div>
        <div className="top-actions action-rail">
          {/* Bag button now opens cart drawer */}
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
        {/* Image panel — single clean hero image, no tabs */}
        <div className="detail-gallery">
          <div className="detail-route">FIELD / EVIDENCE</div>
          <div className="detail-gallery-stage">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="detail-image-note">ZOID ARCHIVE<br />LAGOS / 2026</div>
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

          {/* Add to Bag CTA */}
          <button
            disabled={!activeStock}
            className={added ? "pink-button detail-add added" : "pink-button detail-add"}
            onClick={handleAdd}
          >
            {added ? <><Check size={17} /> Added to bag</> : <>Add to Bag <ArrowDownRight size={17} /></>}
          </button>

          {/* Quick checkout shortcut */}
          <Link href="/checkout" className="ghost-button" style={{ marginTop: 10, width: "100%", justifyContent: "center" }}>
            <ShoppingBag size={15} /> Go to Checkout <ChevronRight size={15} />
          </Link>

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
        <div className="footer-brand">
          <Link className="brand" href="/"><img src="/manus-storage/zoid-mark_c4232248.png" alt="" /><span>ZOID</span><i /></Link>
          <p>Curating before creating.<br />Made for the ones still rising.</p>
        </div>
        <div className="footer-links">
          <div>
            <p className="eyebrow">Explore</p>
            <Link href="/collection">Shop all</Link>
            <Link href="/about">About</Link>
            <Link href="/archives">Archives</Link>
          </div>
          <div>
            <p className="eyebrow">Connect</p>
            <a href="#top">Instagram</a>
            <a href="#top">Contact</a>
          </div>
        </div>
      </footer>

      {/* Cart mini-drawer */}
      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <div>
                <p className="eyebrow">YOUR SELECTION</p>
                <h3>THE BAG / {count.toString().padStart(2, "0")}</h3>
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
