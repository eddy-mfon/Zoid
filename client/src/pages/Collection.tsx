/* ZOID Concrete Ritual: collection browsing is a field index—filterable, tactile, and editorial rather than generic retail. */
import { useEffect, useMemo, useRef, useState } from "react";
import { useZoidMotion } from "@/hooks/useZoidMotion";
import { useCollectionMotion } from "@/hooks/useCollectionMotion";
import {
  ArrowDownRight,
  ArrowLeft,
  ChevronDown,
  Filter,
  Heart,
  ShoppingBag,
  Flame,
  Sparkles,
  X,
  Zap,
  Tag,
  Plus
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { products, type Product } from "@/lib/catalog";
import { useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const MARK = "/zoid-logo.svg";

const options = {
  style: ["All", "Jersey", "Archive", "Heritage", "Gym Kit", "Special"],
  color: ["All", "Black", "Blue", "Red", "White", "Yellow"],
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
      products.filter((product) => {
        let matchesStyle = false;
        if (style === "All") {
          matchesStyle = true;
        } else if (style === "Heritage" || style === "Special") {
          matchesStyle = product.isSpecial === true || product.style === "Heritage" || product.style === "Special";
        } else if (style === "National") {
          matchesStyle = product.category === "NATIONAL TEAM";
        } else {
          matchesStyle = product.style === style;
        }

        const matchesColor = color === "All" || product.color === color;
        const matchesSize = size === "All" || product.sizes.includes(size);

        return matchesStyle && matchesColor && matchesSize;
      }),
    [style, color, size]
  );

  const activeCount = [style, color, size].filter((item) => item !== "All").length;
  useCollectionMotion(pageRef, `${style}-${color}-${size}`);

  function clearFilters() {
    setStyle("All");
    setColor("All");
    setSize("All");
  }

  // Curated subsets for featured shop blocks
  const bestsellers = useMemo(() => products.filter((p) => p.isBestseller), []);
  const specialKits = useMemo(() => products.filter((p) => p.isSpecial || p.originalPrice), []);
  const newArrivals = useMemo(() => products.filter((p) => p.isNewArrival), []);

  // Amazon-style promo block groups
  const clubKits = useMemo(() => products.filter((p) => p.category === "CURATED JERSEY").slice(0, 4), []);
  const nationalKits = useMemo(() => products.filter((p) => p.category === "NATIONAL TEAM").slice(0, 4), []);
  const gymKits = useMemo(() => products.filter((p) => p.style === "Gym Kit").slice(0, 4), []);

  // Sorted products for main grid
  const sortedForGrid = useMemo(() => {
    const bests = filtered.filter((p) => p.isBestseller);
    const specials = filtered.filter((p) => p.isSpecial && !p.isBestseller);
    const rest = filtered.filter((p) => !p.isBestseller && !p.isSpecial);
    return [...bests, ...specials, ...rest];
  }, [filtered]);

  // Check URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const styleParam = params.get("style");
    if (styleParam) {
      if (styleParam === "Special") setStyle("Heritage");
      else setStyle(styleParam);
    }
  }, []);

  const categoryPills = [
    { label: "All Kits", value: "All", count: products.length },
    { label: "Football Kits", value: "Jersey", count: products.filter((p) => p.style === "Jersey").length },
    { label: "Special Kits", value: "Heritage", count: products.filter((p) => p.isSpecial || p.style === "Heritage").length },
    { label: "Gym Wears", value: "Gym Kit", count: products.filter((p) => p.style === "Gym Kit").length },
    { label: "National Teams", value: "National", count: products.filter((p) => p.category === "NATIONAL TEAM").length },
    { label: "Archives", value: "Archive", count: products.filter((p) => p.style === "Archive").length },
  ];

  return (
    <main className="zoid-shell collection-page" ref={pageRef}>
      {/* Top Header Navbar */}
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
            <span>STOREFRONT.</span>
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

      {/* ── IMAGE 2 REFERENCE: HORIZONTAL CATEGORY PILL FILTER BAR ── */}
      <nav className="category-pills-bar" aria-label="Category Filters">
        {categoryPills.map((pill) => {
          const isActive = style === pill.value || (pill.value === "Heritage" && (style === "Heritage" || style === "Special"));
          return (
            <button
              key={pill.label}
              type="button"
              className={`category-pill ${isActive ? "active" : ""}`}
              onClick={() => setStyle(pill.value)}
            >
              <span>{pill.label}</span>
              <span className="category-pill-count">{pill.count}</span>
            </button>
          );
        })}
      </nav>

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

      {/* ── IMAGE 3 REFERENCE: FEATURED SHOP SECTIONS & DISCOUNTS BLOCKS ── */}
      {style === "All" && color === "All" && size === "All" && (
        <>
          {/* ── BLOCK 1: BESTSELLERS SECTION ── */}
          <section style={{ background: "#111113", borderBottom: "1px solid #222", padding: "50px clamp(20px, 5vw, 72px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--pink)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Flame size={14} /> BESTSELLERS / COMMUNITY FAVORITES
                </p>
                <h2 style={{ fontFamily: "Anton", fontSize: "clamp(28px, 4vw, 48px)", margin: 0, textTransform: "uppercase", color: "#fff" }}>
                  TOP RATED KITS
                </h2>
              </div>
              <span style={{ fontSize: 10, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                MOST WANTED THIS MONTH
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
              {bestsellers.slice(0, 4).map((item) => (
                <div
                  key={`bestseller-${item.slug}`}
                  style={{
                    background: "#17171a",
                    border: "1px solid #28282e",
                    borderRadius: 6,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Link href={`/product/${item.slug}`} style={{ display: "block", position: "relative", height: 230, background: "#0c0c0e" }}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }} />
                    <span style={{ position: "absolute", top: 10, left: 10, background: "var(--pink)", color: "#fff", fontSize: 8, fontWeight: 700, padding: "4px 8px", borderRadius: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <Flame size={10} /> BESTSELLER
                    </span>
                    {item.discountBadge && (
                      <span style={{ position: "absolute", top: 10, right: 10, background: "#10b981", color: "#fff", fontSize: 8, fontWeight: 700, padding: "4px 7px", borderRadius: 2 }}>
                        {item.discountBadge}
                      </span>
                    )}
                  </Link>
                  <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase" }}>{item.category}</span>
                      <Link href={`/product/${item.slug}`}>
                        <h3 style={{ fontFamily: "Anton", fontSize: 15, color: "#fff", margin: "4px 0 8px", textTransform: "uppercase", lineHeight: 1.15 }}>{item.name}</h3>
                      </Link>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <strong style={{ fontSize: 14, color: "var(--pink)" }}>{item.price}</strong>
                        {item.originalPrice && (
                          <span style={{ fontSize: 11, color: "#777", textDecoration: "line-through" }}>{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="add-to-cart-action-btn"
                      onClick={() => addToBag(item)}
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── BLOCK 2: SPECIAL KITS SALE & DISCOUNTS SECTION ── */}
          <section style={{ background: "#0e0e10", borderBottom: "1px solid #1f1f22", padding: "50px clamp(20px, 5vw, 72px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
              <div>
                <p className="eyebrow" style={{ color: "#a855f7", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Tag size={14} /> SPECIAL KITS SALE & DISCOUNTS
                </p>
                <h2 style={{ fontFamily: "Anton", fontSize: "clamp(28px, 4vw, 48px)", margin: 0, textTransform: "uppercase", color: "#fff" }}>
                  LIMITED EDITIONS & OFFERS
                </h2>
              </div>
              <span style={{ fontSize: 10, color: "#a855f7", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
                UP TO 20% OFF
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
              {specialKits.slice(0, 4).map((item) => (
                <div
                  key={`special-${item.slug}`}
                  style={{
                    background: "#161619",
                    border: "1px solid #282430",
                    borderRadius: 6,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Link href={`/product/${item.slug}`} style={{ display: "block", position: "relative", height: 230, background: "#0c0c0e" }}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }} />
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#a855f7", color: "#fff", fontSize: 8, fontWeight: 700, padding: "4px 8px", borderRadius: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <Sparkles size={10} /> SPECIAL KIT
                    </span>
                    {item.discountBadge && (
                      <span style={{ position: "absolute", top: 10, right: 10, background: "var(--pink)", color: "#fff", fontSize: 8, fontWeight: 700, padding: "4px 7px", borderRadius: 2 }}>
                        {item.discountBadge}
                      </span>
                    )}
                  </Link>
                  <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase" }}>{item.category}</span>
                      <Link href={`/product/${item.slug}`}>
                        <h3 style={{ fontFamily: "Anton", fontSize: 15, color: "#fff", margin: "4px 0 8px", textTransform: "uppercase", lineHeight: 1.15 }}>{item.name}</h3>
                      </Link>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <strong style={{ fontSize: 14, color: "#a855f7" }}>{item.price}</strong>
                        {item.originalPrice && (
                          <span style={{ fontSize: 11, color: "#777", textDecoration: "line-through" }}>{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="add-to-cart-action-btn"
                      style={{ background: "#a855f7" }}
                      onClick={() => addToBag(item)}
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── BLOCK 3: NEW ARRIVALS SECTION (REQUESTED BY USER) ── */}
          <section style={{ background: "#111113", borderBottom: "1px solid #1f1f22", padding: "50px clamp(20px, 5vw, 72px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
              <div>
                <p className="eyebrow" style={{ color: "#38bdf8", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Zap size={14} /> NEW ARRIVALS / FRESH DROPS
                </p>
                <h2 style={{ fontFamily: "Anton", fontSize: "clamp(28px, 4vw, 48px)", margin: 0, textTransform: "uppercase", color: "#fff" }}>
                  JUST IN THE STORE
                </h2>
              </div>
              <span style={{ fontSize: 10, color: "#38bdf8", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
                2026 SEASON COLLECTION
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
              {newArrivals.slice(0, 4).map((item) => (
                <div
                  key={`new-${item.slug}`}
                  style={{
                    background: "#17171a",
                    border: "1px solid #222c36",
                    borderRadius: 6,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Link href={`/product/${item.slug}`} style={{ display: "block", position: "relative", height: 230, background: "#0c0c0e" }}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }} />
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#0284c7", color: "#fff", fontSize: 8, fontWeight: 700, padding: "4px 8px", borderRadius: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <Zap size={10} /> NEW ARRIVAL
                    </span>
                  </Link>
                  <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase" }}>{item.category}</span>
                      <Link href={`/product/${item.slug}`}>
                        <h3 style={{ fontFamily: "Anton", fontSize: 15, color: "#fff", margin: "4px 0 8px", textTransform: "uppercase", lineHeight: 1.15 }}>{item.name}</h3>
                      </Link>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <strong style={{ fontSize: 14, color: "#38bdf8" }}>{item.price}</strong>
                        {item.originalPrice && (
                          <span style={{ fontSize: 11, color: "#777", textDecoration: "line-through" }}>{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="add-to-cart-action-btn"
                      style={{ background: "#0284c7" }}
                      onClick={() => addToBag(item)}
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── BLOCK 4: AMAZON-STYLE FEATURED MULTI-CARD GRID BLOCKS (IMAGE 3 REFERENCE) ── */}
          <section style={{ background: "#09090b", borderBottom: "1px solid #1f1f22", padding: "50px clamp(20px, 5vw, 72px)" }}>
            <div style={{ marginBottom: 28 }}>
              <p className="eyebrow" style={{ color: "#eab308", marginBottom: 6 }}>CURATED PROMO BLOCKS / EXPLORE BY CATEGORY</p>
              <h2 style={{ fontFamily: "Anton", fontSize: "clamp(28px, 4vw, 48px)", margin: 0, textTransform: "uppercase", color: "#fff" }}>
                FEATURED CATEGORY COLLECTIONS
              </h2>
            </div>

            <div className="amazon-blocks-grid" style={{ padding: 0 }}>
              {/* Promo Card 1: Club Kits */}
              <div className="amazon-block-card">
                <div className="amazon-block-head">
                  <h3>Top Club Kits</h3>
                  <p>Curated premier club jerseys</p>
                </div>
                <div className="amazon-quad-grid">
                  {clubKits.map((item) => (
                    <Link key={`quad-club-${item.slug}`} href={`/product/${item.slug}`} className="amazon-quad-item">
                      <img src={item.image} alt={item.name} className="amazon-quad-img" />
                      <span className="amazon-quad-title">{item.name}</span>
                      <span className="amazon-quad-price">{item.price}</span>
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  className="line-link"
                  onClick={() => setStyle("Jersey")}
                  style={{ color: "var(--pink)", fontSize: 9 }}
                >
                  Shop Club Kits <ArrowDownRight size={12} />
                </button>
              </div>

              {/* Promo Card 2: Special Kits & Deals */}
              <div className="amazon-block-card">
                <div className="amazon-block-head">
                  <h3>Special Kits & Deals</h3>
                  <p>Flash discounts & rare drops</p>
                </div>
                <div className="amazon-quad-grid">
                  {specialKits.slice(0, 4).map((item) => (
                    <Link key={`quad-special-${item.slug}`} href={`/product/${item.slug}`} className="amazon-quad-item">
                      <img src={item.image} alt={item.name} className="amazon-quad-img" />
                      <span className="amazon-quad-title">{item.name}</span>
                      <span className="amazon-quad-price" style={{ color: "#a855f7" }}>{item.price}</span>
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  className="line-link"
                  onClick={() => setStyle("Heritage")}
                  style={{ color: "#a855f7", fontSize: 9 }}
                >
                  Shop Special Kits <ArrowDownRight size={12} />
                </button>
              </div>

              {/* Promo Card 3: World Cup National Teams */}
              <div className="amazon-block-card">
                <div className="amazon-block-head">
                  <h3>World Cup 2026 Drops</h3>
                  <p>National team iterations</p>
                </div>
                <div className="amazon-quad-grid">
                  {nationalKits.map((item) => (
                    <Link key={`quad-national-${item.slug}`} href={`/product/${item.slug}`} className="amazon-quad-item">
                      <img src={item.image} alt={item.name} className="amazon-quad-img" />
                      <span className="amazon-quad-title">{item.name}</span>
                      <span className="amazon-quad-price" style={{ color: "#38bdf8" }}>{item.price}</span>
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  className="line-link"
                  onClick={() => setStyle("National")}
                  style={{ color: "#38bdf8", fontSize: 9 }}
                >
                  Shop National Teams <ArrowDownRight size={12} />
                </button>
              </div>

              {/* Promo Card 4: Gym & Activewear */}
              <div className="amazon-block-card">
                <div className="amazon-block-head">
                  <h3>Pro Gym Sets</h3>
                  <p>Performance activewear</p>
                </div>
                <div className="amazon-quad-grid">
                  {gymKits.map((item) => (
                    <Link key={`quad-gym-${item.slug}`} href={`/product/${item.slug}`} className="amazon-quad-item">
                      <img src={item.image} alt={item.name} className="amazon-quad-img" />
                      <span className="amazon-quad-title">{item.name}</span>
                      <span className="amazon-quad-price">{item.price}</span>
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  className="line-link"
                  onClick={() => setStyle("Gym Kit")}
                  style={{ color: "var(--pink)", fontSize: 9 }}
                >
                  Shop Gym Kits <ArrowDownRight size={12} />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── MAIN PRODUCT GRID (IMAGE 2 COMPATIBLE 2-COLUMN MOBILE LAYOUT) ── */}
      <section className="shop-grid-section" style={{ background: "#0b0b0d", padding: "40px 0" }}>
        <div style={{ padding: "0 clamp(20px, 5vw, 72px)", marginBottom: 20 }}>
          <p className="eyebrow" style={{ color: "#888" }}>
            SHOWING {sortedForGrid.length} OF {products.length} ITEMS {style !== "All" ? `/ FILTER: ${style}` : ""}
          </p>
        </div>

        <section className="collection-grid">
          {sortedForGrid.length ? (
            sortedForGrid.map((product, index) => (
              <article className="collection-card" key={product.slug} style={{ position: "relative", background: "#131316", border: "1px solid #222226", borderRadius: 6, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  {/* Badges */}
                  <div style={{ position: "absolute", top: 18, left: 18, zIndex: 5, display: "flex", flexDirection: "column", gap: 4 }}>
                    {product.isBestseller && (
                      <span style={{ background: "var(--pink)", color: "#fff", fontSize: 7, fontWeight: 700, padding: "3px 6px", borderRadius: 2, display: "flex", alignItems: "center", gap: 3 }}>
                        <Flame size={8} /> BESTSELLER
                      </span>
                    )}
                    {product.isSpecial && !product.isBestseller && (
                      <span style={{ background: "#a855f7", color: "#fff", fontSize: 7, fontWeight: 700, padding: "3px 6px", borderRadius: 2, display: "flex", alignItems: "center", gap: 3 }}>
                        <Sparkles size={8} /> SPECIAL
                      </span>
                    )}
                    {product.isNewArrival && (
                      <span style={{ background: "#0284c7", color: "#fff", fontSize: 7, fontWeight: 700, padding: "3px 6px", borderRadius: 2, display: "flex", alignItems: "center", gap: 3 }}>
                        <Zap size={8} /> NEW
                      </span>
                    )}
                  </div>

                  {product.discountBadge && (
                    <span style={{ position: "absolute", top: 18, right: 18, zIndex: 5, background: "#10b981", color: "#fff", fontSize: 7, fontWeight: 700, padding: "3px 6px", borderRadius: 2 }}>
                      {product.discountBadge}
                    </span>
                  )}

                  {/* Product Image */}
                  <Link href={`/product/${product.slug}`} className="collection-image" style={{ borderRadius: 4, height: 260, background: "#0a0a0c" }}>
                    <img src={product.image} alt={product.name} style={{ objectFit: "contain", padding: 10 }} />
                  </Link>

                  {/* Card Meta */}
                  <div className="collection-card-meta" style={{ paddingTop: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p className="eyebrow" style={{ fontSize: 8, margin: "0 0 4px", color: "#777" }}>{product.category}</p>
                      <Link href={`/product/${product.slug}`}>
                        <h2 style={{ fontSize: 16, color: "#fff", lineHeight: 1.15, fontFamily: "Anton", textTransform: "uppercase" }}>{product.name}</h2>
                      </Link>
                      <small style={{ color: "#777", fontSize: 9 }}>{product.tone}</small>
                    </div>
                    <button
                      className="save-card"
                      onClick={() => toggleWishlist(product.slug)}
                      aria-label="Save product"
                      title={wishlist.includes(product.slug) ? "Remove from wishlist" : "Add to wishlist"}
                      style={{ padding: 4 }}
                    >
                      <Heart
                        size={16}
                        fill={wishlist.includes(product.slug) ? "currentColor" : "none"}
                        color={wishlist.includes(product.slug) ? "var(--pink)" : undefined}
                      />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <strong style={{ fontSize: 14, color: "var(--pink)" }}>{product.price}</strong>
                      {product.originalPrice && (
                        <span style={{ fontSize: 10, color: "#666", textDecoration: "line-through" }}>{product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Prominent Add to Cart Button (Image 2 style) */}
                  <button
                    className="add-to-cart-action-btn"
                    onClick={() => addToBag(product)}
                  >
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
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
