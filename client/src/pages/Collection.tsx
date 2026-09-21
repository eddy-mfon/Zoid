/* ZOID Concrete Ritual: collection browsing is a field index—filterable, tactile, and editorial rather than generic retail. */
import { useMemo, useRef, useState } from "react";
import { useZoidMotion } from "@/hooks/useZoidMotion";
import { useCollectionMotion } from "@/hooks/useCollectionMotion";
import { ArrowDownRight, ArrowLeft, ChevronDown, Filter, Heart, Menu, Search, ShoppingBag, Flame, Sparkles, Star, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { products } from "@/lib/catalog";
import { useShop } from "@/contexts/ShopContext";

const MARK = "/zoid-logo.svg";

const options = {
  style: ["All", "Jersey", "Archive", "Heritage", "Gym Kit"],
  color: ["All", "Black", "Blue", "Red", "White"],
  size: ["All", "S", "M", "L", "XL"],
};

export default function Collection() {
  const pageRef = useRef<HTMLElement | null>(null);
  useZoidMotion(pageRef);
  const [location] = useLocation();
  const [style, setStyle] = useState("All");
  const [color, setColor] = useState("All");
  const [size, setSize] = useState("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { count, addToBag, bag } = useShop();

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (style === "All" || product.style === style) &&
          (color === "All" || product.color === color) &&
          (size === "All" || product.sizes.includes(size))
      ),
    [style, color, size]
  );

  const activeCount = [style, color, size].filter((item) => item !== "All").length;
  useCollectionMotion(pageRef, `${style}-${color}-${size}`);

  function clearFilters() {
    setStyle("All");
    setColor("All");
    setSize("All");
  }

  // Road section: 3 bestsellers + 3 special kits
  const roadItems = useMemo(() => {
    const bestsellers = products.filter((p) => p.isBestseller).slice(0, 3);
    const specials = products.filter((p) => p.isSpecial && !bestsellers.find((b) => b.slug === p.slug)).slice(0, 3);
    return [...bestsellers, ...specials];
  }, []);

  // Sorted products: bestsellers first, then specials, then rest
  const sortedForGrid = useMemo(() => {
    const bests = filtered.filter((p) => p.isBestseller);
    const specials = filtered.filter((p) => p.isSpecial && !p.isBestseller);
    const rest = filtered.filter((p) => !p.isBestseller && !p.isSpecial);
    return [...bests, ...specials, ...rest];
  }, [filtered]);

  return (
    <main className="zoid-shell collection-page" ref={pageRef}>
      {/* Navbar */}
      <header className="topbar">
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
          <a className="icon-button" href="/?search=1" aria-label="Search products">
            <Search size={16} />
          </a>
          <button
            className="bag-button"
            aria-label={`Open bag, ${count} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={15} />
            <span>{count}</span>
          </button>
          <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Collection Intro */}
      <div className="collection-intro">
        <div>
          <Link className="back-link" href="/">
            <ArrowLeft size={15} /> Back to home
          </Link>
          <p className="eyebrow">THE CURRENT SELECTION / {products.length} PIECES</p>
          <h1>
            THE
            <br />
            <span>EDIT.</span>
          </h1>
        </div>
        <p className="collection-note">
          <strong>Curating before creating.</strong> Every piece is selected for the story it carries, the material it holds, and the distance it can travel with you.
        </p>
      </div>

      {/* Filter Bar — MOVED UP, before the road section */}
      <section className="filter-bar">
        <div className="filter-label">
          <Filter size={15} /> FILTER / {activeCount.toString().padStart(2, "0")}
        </div>
        <FilterGroup label="Style" value={style} values={options.style} onChange={setStyle} />
        <FilterGroup label="Color" value={color} values={options.color} onChange={setColor} />
        <FilterGroup label="Size" value={size} values={options.size} onChange={setSize} />
        {activeCount > 0 && (
          <button className="clear-filter" onClick={clearFilters}>
            Clear all <X size={13} />
          </button>
        )}
      </section>

      {/* THE ROAD — Highlighted items: bestsellers + special gym kits */}
      <section className="archive-section">
        <div className="archive-intro">
          <p className="eyebrow">THE ROAD</p>
          <h2>
            THE
            <br />
            <span>ROAD.</span>
          </h2>
          <p>Curated highlights — our bestsellers and special kits. The pieces the community keeps coming back for.</p>
        </div>
        <div className="archive-track">
          {roadItems.map((item, index) => (
            <article className="archive-card" key={item.slug}>
              <Link href={`/product/${item.slug}`}>
                <div className="archive-card-image" style={{ position: "relative" }}>
                  <img src={item.image} alt={item.name} />
                  {/* Bestseller / Special badge */}
                  {item.isBestseller && (
                    <span style={{
                      position: "absolute", top: 10, left: 10,
                      background: "var(--pink)", color: "#fff",
                      fontSize: 8, letterSpacing: "0.14em", fontWeight: 700,
                      padding: "4px 8px", display: "flex", alignItems: "center", gap: 4,
                      zIndex: 2,
                    }}>
                      <Flame size={9} /> BESTSELLER
                    </span>
                  )}
                  {item.isSpecial && !item.isBestseller && (
                    <span style={{
                      position: "absolute", top: 10, left: 10,
                      background: "#a855f7", color: "#fff",
                      fontSize: 8, letterSpacing: "0.14em", fontWeight: 700,
                      padding: "4px 8px", display: "flex", alignItems: "center", gap: 4,
                      zIndex: 2,
                    }}>
                      <Sparkles size={9} /> SPECIAL KIT
                    </span>
                  )}
                </div>
              </Link>
              <div className="archive-card-meta">
                <span>0{index + 1} / {item.style.toUpperCase()}</span>
                <h3>{item.name}</h3>
                <p>{item.fit} · {item.color}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Shop Grid — bestsellers first */}
      <section className="shop-grid-section">
        {/* Bestseller & Special Kits callout row */}
        <div style={{
          padding: "28px clamp(24px,8vw,120px) 0",
          display: "flex", alignItems: "center", gap: 12,
          background: "#0f0f0f", borderBottom: "1px solid #222",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--pink)", fontSize: 9, letterSpacing: "0.16em", fontWeight: 700 }}>
            <Flame size={12} /> BESTSELLERS FIRST
          </span>
          <span style={{ width: 1, height: 16, background: "#333" }} />
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#a855f7", fontSize: 9, letterSpacing: "0.16em", fontWeight: 700 }}>
            <Sparkles size={12} /> SPECIAL KITS HIGHLIGHTED
          </span>
        </div>

        <section className="collection-grid">
          {sortedForGrid.length ? (
            sortedForGrid.map((product, index) => (
              <article
                className="collection-card"
                key={product.slug}
                style={{ position: "relative" }}
              >
                {/* Bestseller tag */}
                {product.isBestseller && (
                  <div style={{
                    position: "absolute", top: 8, left: 8,
                    background: "var(--pink)", color: "#fff",
                    fontSize: 7, letterSpacing: "0.14em", fontWeight: 700,
                    padding: "3px 7px", display: "flex", alignItems: "center", gap: 3,
                    zIndex: 5,
                  }}>
                    <Flame size={8} /> BESTSELLER
                  </div>
                )}
                {/* Special kit tag */}
                {product.isSpecial && (
                  <div style={{
                    position: "absolute", top: product.isBestseller ? 30 : 8, left: 8,
                    background: "#a855f7", color: "#fff",
                    fontSize: 7, letterSpacing: "0.14em", fontWeight: 700,
                    padding: "3px 7px", display: "flex", alignItems: "center", gap: 3,
                    zIndex: 5,
                  }}>
                    <Sparkles size={8} /> SPECIAL
                  </div>
                )}

                <Link href={`/product/${product.slug}`} className="collection-image">
                  <img src={product.image} alt={product.name} />
                  <span>0{index + 1}</span>
                </Link>
                <div className="collection-card-meta">
                  <div>
                    <p className="eyebrow">{product.category}</p>
                    <Link href={`/product/${product.slug}`}>
                      <h2>{product.name}</h2>
                    </Link>
                    <small>{product.tone}</small>
                  </div>
                  <button
                    className="save-card"
                    onClick={() =>
                      setSaved((items) =>
                        items.includes(product.slug)
                          ? items.filter((item) => item !== product.slug)
                          : [...items, product.slug]
                      )
                    }
                    aria-label="Save product"
                  >
                    <Heart size={17} fill={saved.includes(product.slug) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="collection-card-bottom">
                  <strong>{product.price}</strong>
                  <Link className="line-link" href={`/product/${product.slug}`}>
                    View dossier <ArrowDownRight size={14} />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-results">
              <p className="eyebrow">NO MATCH / ADJUST THE EDIT</p>
              <h2>
                NOTHING
                <br />
                <span>YET.</span>
              </h2>
              <button className="pink-button" onClick={clearFilters}>
                Reset filters <ArrowDownRight size={16} />
              </button>
            </div>
          )}
        </section>
      </section>

      {/* Footer */}
      <footer className="footer">
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
                <h3>THE BAG / {count.toString().padStart(2, "0")}</h3>
              </div>
              <button onClick={() => setCartOpen(false)} aria-label="Close bag">
                <X size={20} />
              </button>
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
                <button
                  className="pink-button checkout"
                  onClick={() => { setCartOpen(false); window.location.assign("/checkout"); }}
                >
                  Proceed to checkout <ArrowDownRight size={17} />
                </button>
              </>
            ) : (
              <div className="empty-bag">
                <ShoppingBag size={32} />
                <p>Your bag is waiting for a first pick.</p>
                <button className="line-link" onClick={() => setCartOpen(false)}>
                  Explore the edit <ArrowDownRight size={16} />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}

function FilterGroup({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={open ? "filter-group filter-open" : "filter-group"}>
      <button
        className="filter-trigger"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((state) => !state)}
      >
        <span>
          {label}
          <small>{value}</small>
        </span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="filter-menu" role="listbox" aria-label={`${label} filter`}>
          {values.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={value === option}
              className={value === option ? "filter-option selected" : "filter-option"}
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
              {value === option && <span>×</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
