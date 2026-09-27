/* ZOID Concrete Ritual: collection browsing is a field index—filterable, tactile, and editorial rather than generic retail. */
import { useMemo, useRef, useState } from "react";
import { useZoidMotion } from "@/hooks/useZoidMotion";
import { useCollectionMotion } from "@/hooks/useCollectionMotion";
import { ArrowDownRight, ArrowLeft, ChevronDown, Filter, Heart, ShoppingBag, Flame, Sparkles, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { products } from "@/lib/catalog";
import { useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const MARK = "/zoid-logo.svg";

const options = {
  style: ["All", "Jersey", "Archive", "Heritage", "Gym Kit"],
  color: ["All", "Black", "Blue", "Red", "White"],
  size: ["All", "S", "M", "L", "XL"],
};

export default function Collection() {
  const pageRef = useRef<HTMLElement | null>(null);
  useZoidMotion(pageRef);
  const [, navigate] = useLocation();
  const [style, setStyle] = useState("All");
  const [color, setColor] = useState("All");
  const [size, setSize] = useState("All");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { count, addToBag, bag } = useShop();
  const { wishlist, toggleWishlist } = useAuth();

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

  // Curated bestsellers & special kits
  const bestsellers = useMemo(() => products.filter((p) => p.isBestseller), []);
  const specialKits = useMemo(() => products.filter((p) => p.isSpecial), []);

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
      <Navbar
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        setCartOpen={setCartOpen}
        savedCount={wishlist.length}
      />

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
        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start", maxWidth: 340, alignSelf: "flex-end", marginBottom: 5 }}>
          <img
            src={MARK}
            alt="ZOID"
            style={{
              height: 48,
              width: "auto",
              objectFit: "contain",
              filter: "brightness(0.12)",
              display: "block",
            }}
          />
          <p className="collection-note" style={{ margin: 0, width: "100%" }}>
            <strong>Curating before creating.</strong> Every piece is selected for the story it carries, the material it holds, and the distance it can travel with you.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
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

      {/* VERTICAL HIGHLIGHTS SECTION: BESTSELLERS & SPECIAL KITS (No horizontal scroll) */}
      {style === "All" && color === "All" && size === "All" && (
        <section style={{ background: "#111", borderBottom: "1px solid #222", padding: "60px clamp(24px, 6vw, 96px) 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
            <div>
              <p className="eyebrow" style={{ color: "var(--pink)", marginBottom: 6 }}>HIGHLIGHTS / THE ROAD</p>
              <h2 style={{ fontFamily: "Anton", fontSize: "clamp(32px, 5vw, 56px)", margin: 0, textTransform: "uppercase", color: "#fff" }}>
                COMMUNITY FAVORITES & SPECIAL KITS
              </h2>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              <span style={{ color: "var(--pink)", display: "flex", alignItems: "center", gap: 5, fontWeight: 700 }}>
                <Flame size={13} /> Bestsellers
              </span>
              <span style={{ color: "#a855f7", display: "flex", alignItems: "center", gap: 5, fontWeight: 700 }}>
                <Sparkles size={13} /> Special Kits
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {[...bestsellers.slice(0, 3), ...specialKits.slice(0, 3)].map((item) => (
              <div
                key={item.slug}
                style={{
                  background: "#161616",
                  border: "1px solid #262626",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Link href={`/product/${item.slug}`} style={{ display: "block", position: "relative", height: 260, background: "#0c0c0c" }}>
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }} />
                  {item.isBestseller && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "var(--pink)", color: "#fff", fontSize: 8, fontWeight: 700, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4 }}>
                      <Flame size={9} /> BESTSELLER
                    </span>
                  )}
                  {item.isSpecial && !item.isBestseller && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#a855f7", color: "#fff", fontSize: 8, fontWeight: 700, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4 }}>
                      <Sparkles size={9} /> SPECIAL KIT
                    </span>
                  )}
                </Link>
                <div style={{ padding: 16 }}>
                  <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase" }}>{item.category}</span>
                  <Link href={`/product/${item.slug}`}>
                    <h3 style={{ fontFamily: "Anton", fontSize: 16, color: "#fff", margin: "4px 0 8px", textTransform: "uppercase" }}>{item.name}</h3>
                  </Link>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #222", paddingTop: 10 }}>
                    <strong style={{ fontSize: 13, color: "var(--pink)" }}>{item.price}</strong>
                    <Link href={`/product/${item.slug}`} className="line-link" style={{ fontSize: 8 }}>
                      View Piece <ArrowDownRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Shop Grid */}
      <section className="shop-grid-section">
        <section className="collection-grid">
          {sortedForGrid.length ? (
            sortedForGrid.map((product, index) => (
              <article className="collection-card" key={product.slug} style={{ position: "relative" }}>
                {/* Bestseller tag */}
                {product.isBestseller && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      background: "var(--pink)",
                      color: "#fff",
                      fontSize: 7,
                      letterSpacing: "0.14em",
                      fontWeight: 700,
                      padding: "3px 7px",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      zIndex: 5,
                    }}
                  >
                    <Flame size={8} /> BESTSELLER
                  </div>
                )}
                {/* Special kit tag */}
                {product.isSpecial && !product.isBestseller && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      background: "#a855f7",
                      color: "#fff",
                      fontSize: 7,
                      letterSpacing: "0.14em",
                      fontWeight: 700,
                      padding: "3px 7px",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      zIndex: 5,
                    }}
                  >
                    <Sparkles size={8} /> SPECIAL
                  </div>
                )}

                <Link href={`/product/${product.slug}`} className="collection-image" style={{ background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 16 }} />
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
                    onClick={() => toggleWishlist(product.slug)}
                    aria-label="Save product"
                    title={wishlist.includes(product.slug) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      size={17}
                      fill={wishlist.includes(product.slug) ? "currentColor" : "none"}
                      color={wishlist.includes(product.slug) ? "var(--pink)" : undefined}
                    />
                  </button>
                </div>
                <div className="collection-card-bottom">
                  <strong>{product.price}</strong>
                  <Link className="line-link" href={`/product/${product.slug}`}>
                    View <ArrowDownRight size={14} />
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
          <p>
            For the ones still rising.
            <br />
            Archive-led sportwear from Lagos.
          </p>
          <Link className="footer-cta" href="/collection">
            Enter the edit <ArrowDownRight size={16} />
          </Link>
        </div>
        <div className="footer-bottom">
          <span>© ZOID / 2026</span>
          <span>Lagos — Nigeria</span>
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
                <h3>THE BAG / {count.toString().padStart(2, "0")}</h3>
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
                            Custom: {item.customization}
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
