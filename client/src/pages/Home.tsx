/* ZOID Storefront — Community-First Redesign */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { products, searchProducts } from "@/lib/catalog";
import { useShop } from "@/contexts/ShopContext";
import { useZoidMotion } from "@/hooks/useZoidMotion";
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp,
  Heart, Menu, Search, ShoppingBag, X,
  Flame, Sparkles, Tag,
} from "lucide-react";
import { toast } from "sonner";

const MARK = "/zoid-logo.svg";
const STORY_IMG = "/manus-storage/zoid-story_425b40db.jpg";

/* ── Hero slides ── */
const heroSlides = [
  {
    kicker: "LAGOS / COMMUNITY & CULTURE",
    title: "MORE THAN\nJERSEYS.",
    sub: "ZOID connects football nostalgia, African perspective, and street culture into a shared identity.",
    img: "/manus-storage/ac-milan-2526_b917ea29.jpg",
  },
  {
    kicker: "ZOID COMMUNITY ARCHIVES",
    title: "EVERY SHIRT\nHAS A STORY.",
    sub: "We collect memories from match days, local pitches, and urban streets across Africa and beyond.",
    img: "/manus-storage/zoid-story_425b40db.jpg",
  },
  {
    kicker: "NEW DROPS & NUMERICALS",
    title: "KEEP RISING.\nNEVER STOP.",
    sub: "Fresh releases, rare cuts, and performance gym kits crafted for the ones still rising.",
    img: "/jerseys/National/Brazil 1998 home vintage jersey.jpg",
  },
];

/* ── Archive snippets ── */
const archiveSnippets = [
  { id: "1", title: "The 1998 Samba Memory", author: "Tunde O.", loc: "Surulere, Lagos", text: "Watching Ronaldo in 1998 changed how I saw football.", img: "/jerseys/National/Brazil 1998 home vintage jersey.jpg" },
  { id: "2", title: "San Siro Under the Lights", author: "Chidi K.", loc: "Abuja", text: "Sourcing vintage Milan kits was my entry into sportswear curation.", img: "/manus-storage/ac-milan-2526_b917ea29.jpg" },
  { id: "3", title: "Street Culture & Sportswear", author: "Amina B.", loc: "Lekki, Lagos", text: "In Lagos, jerseys are everyday luxury — a badge of identity.", img: STORY_IMG },
];

/* ── Tab definitions ── */
const TABS = [
  { id: "bestsellers", label: "Bestsellers", Icon: Flame },
  { id: "special",     label: "Special Kits", Icon: Sparkles },
  { id: "discounts",   label: "Discounts",    Icon: Tag },
] as const;
type TabId = typeof TABS[number]["id"];

export default function Home() {
  const pageRef = useRef<HTMLElement | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [prevHero, setPrevHero] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("bestsellers");
  const [cartOpen, setCartOpen] = useState(false);
  const [utilityOpen, setUtilityOpen] = useState<"search" | "saved" | null>(null);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { addToBag, bag, count: cartCount } = useShop();

  /* Auto-carousel with crossfade */
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex((prev) => {
        setPrevHero(prev);
        return (prev + 1) % heroSlides.length;
      });
    }, 6000);
    return () => clearInterval(t);
  }, []);

  /* Fade out prevHero after 600 ms */
  useEffect(() => {
    if (prevHero === null) return;
    const t = setTimeout(() => setPrevHero(null), 700);
    return () => clearTimeout(t);
  }, [prevHero]);

  useZoidMotion(pageRef);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("search") !== null) setUtilityOpen("search");

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setUtilityOpen(null); };
    const onScroll = () => {
      setScrolled(window.scrollY > 44);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Search */
  const searchResults = useMemo(() => (query.trim() ? searchProducts(query) : []), [query]);

  /* Curated items by tab */
  const curatedItems = useMemo(() => {
    if (activeTab === "bestsellers") return products.slice(0, 4);
    if (activeTab === "special") return products.filter((p) => p.category.includes("SPECIAL") || p.category.includes("ARCHIVE")).slice(0, 4);
    return products.slice(4, 8);
  }, [activeTab]);

  function goHero(idx: number) {
    setPrevHero(heroIndex);
    setHeroIndex(idx);
  }

  function toggleSaved(slug: string) {
    setSaved((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/collection" },
    { label: "About", href: "/about" },
    { label: "Archives", href: "/archives" },
  ];

  return (
    <main className="zoid-shell home-page" ref={pageRef}>

      {/* ── NAVBAR ──────────────────────────────────── */}
      <header className={scrolled ? "topbar topbar-scrolled" : "topbar"}>
        <Link className="brand" href="/">
          <img src={MARK} alt="" /><span>ZOID</span><i />
        </Link>
        <div className="nav-frame">
          <span className="nav-context">FIELD / 01</span>
          <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
            {navLinks.map(({ label, href }) => (
              <Link key={label} href={href} onClick={() => setMobileMenu(false)}
                className={href === "/" ? "active" : ""}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="top-actions action-rail">
          <button
            className={utilityOpen === "search" ? "icon-button utility-active" : "icon-button"}
            aria-label="Search" title="Search"
            onClick={() => setUtilityOpen(utilityOpen === "search" ? null : "search")}
          ><Search size={16} /></button>

          <button
            className={utilityOpen === "saved" ? "icon-button saved-button utility-active" : "icon-button saved-button"}
            aria-label={`Wishlist, ${saved.length} items`} title="Wishlist"
            onClick={() => setUtilityOpen(utilityOpen === "saved" ? null : "saved")}
            style={{ position: "relative" }}
          >
            <Heart size={16} fill={saved.length ? "currentColor" : "none"} color={saved.length ? "var(--pink)" : undefined} />
            {saved.length > 0 && (
              <b style={{ position: "absolute", top: -5, right: -5, background: "var(--pink)", color: "#fff", borderRadius: "50%", minWidth: 16, height: 16, fontSize: 9, display: "grid", placeItems: "center" }}>{saved.length}</b>
            )}
          </button>

          <button
            className="bag-button" title="Bag" aria-label={`Bag, ${cartCount} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={15} /><span>{cartCount}</span>
          </button>

          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── SEARCH OVERLAY ─────────────────────────── */}
      {utilityOpen === "search" && (
        <div className="search-overlay" role="dialog" aria-modal="true">
          <button className="search-overlay-backdrop" onClick={() => setUtilityOpen(null)} />
          <section className="search-overlay-panel">
            <div className="utility-panel-head">
              <div><span>UNIVERSAL SEARCH</span><small>Products, kits, stories & more</small></div>
              <button onClick={() => setUtilityOpen(null)}><X size={18} /></button>
            </div>
            <div className="search-field">
              <Search size={20} />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: Milan, Gym Kit, Brazil, Vintage, Lagos…" />
            </div>
            {!query && (
              <div className="search-discovery">
                <div className="search-discovery-group">
                  <span>POPULAR SEARCHES</span>
                  <div>
                    {["Gym Kit", "AC Milan", "Brazil 1998", "Special Kits", "Heritage"].map((t) => (
                      <button key={t} onClick={() => setQuery(t)}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="utility-results">
              {searchResults.slice(0, 6).map((item) => (
                <Link key={item.slug} href={`/product/${item.slug}`} onClick={() => setUtilityOpen(null)}>
                  <img src={item.image} alt="" />
                  <span><strong>{item.name}</strong><small>{item.category} · {item.price}</small></span>
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
            {query && searchResults.length === 0 && (
              <div className="utility-empty search-empty">
                <Search size={23} />
                <p>Nothing matched "{query}"</p>
                <small>Try a team name, category, or colour.</small>
                <button onClick={() => setQuery("")}>Clear</button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── WISHLIST PANEL ─────────────────────────── */}
      {utilityOpen === "saved" && (
        <section className="utility-panel" aria-label="Wishlist">
          <div className="utility-wishlist">
            <div className="utility-panel-head">
              <span>YOUR WISHLIST — {saved.length} ITEM{saved.length !== 1 ? "S" : ""}</span>
              <button onClick={() => setUtilityOpen(null)}><X size={17} /></button>
            </div>
            {saved.length > 0 ? (
              saved.map((slug) => {
                const item = products.find((p) => p.slug === slug);
                if (!item) return null;
                return (
                  <Link key={slug} href={`/product/${slug}`} onClick={() => setUtilityOpen(null)}>
                    <img src={item.image} alt="" />
                    <span><strong>{item.name}</strong><small>{item.price}</small></span>
                    <ArrowRight size={14} />
                  </Link>
                );
              })
            ) : (
              <div className="utility-empty">
                <Heart size={26} />
                <p>Tap the <Heart size={14} style={{ display: "inline", verticalAlign: "middle" }} /> on any item to save it here.</p>
                <button onClick={() => setUtilityOpen(null)}>Browse Collection</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── HERO CAROUSEL ──────────────────────────── */}
      <section className="hero" id="top" style={{ position: "relative", overflow: "hidden" }}>
        {/* Previous slide fading out */}
        {prevHero !== null && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: `url(${heroSlides[prevHero].img})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0, transition: "opacity 0.7s ease"
          }} />
        )}
        {/* Current slide */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: `url(${heroSlides[heroIndex].img})`,
          backgroundSize: "cover", backgroundPosition: "center",
          transition: "opacity 0.7s ease", opacity: 1
        }} />
        <div className="hero-scrim" style={{ zIndex: 2 }} />
        <div className="hero-copy" style={{ position: "relative", zIndex: 3 }}>
          <p className="eyebrow" style={{ transition: "opacity 0.4s ease" }}>{heroSlides[heroIndex].kicker}</p>
          <h1 style={{ whiteSpace: "pre-line", transition: "opacity 0.4s ease" }}>{heroSlides[heroIndex].title}</h1>
          <p className="hero-intro" style={{ transition: "opacity 0.4s ease" }}>{heroSlides[heroIndex].sub}</p>
          <div className="hero-actions">
            <Link className="pink-button" href="/collection">Shop Collection <ArrowDownRight size={17} /></Link>
            <Link className="ghost-button" href="/about">Our Story</Link>
          </div>
          {/* Carousel controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 36 }}>
            <button
              onClick={() => goHero((heroIndex - 1 + heroSlides.length) % heroSlides.length)}
              style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.35)", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}
              aria-label="Previous slide"
            ><ArrowLeft size={14} /></button>

            {heroSlides.map((_, idx) => (
              <span key={idx} onClick={() => goHero(idx)} style={{
                cursor: "pointer",
                width: heroIndex === idx ? 26 : 8,
                height: 8, borderRadius: 4,
                background: heroIndex === idx ? "var(--pink)" : "rgba(255,255,255,0.35)",
                transition: "width 0.4s ease, background 0.4s ease", flexShrink: 0
              }} />
            ))}

            <button
              onClick={() => goHero((heroIndex + 1) % heroSlides.length)}
              style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.35)", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}
              aria-label="Next slide"
            ><ArrowRight size={14} /></button>

            <small style={{ color: "rgba(255,255,255,0.5)", marginLeft: 4, fontSize: 10, letterSpacing: "0.12em" }}>
              0{heroIndex + 1} / 0{heroSlides.length}
            </small>
          </div>
        </div>
      </section>

      {/* ── KEEP RISING (new drops) ─────────────────── */}
      <section style={{ background: "#111", borderBottom: "1px solid #1f1f1f", padding: "60px clamp(24px,8vw,120px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--pink)" }}>NEW DROPS & NEEDED NUMERICALS</p>
            <h2 style={{ fontFamily: "Anton", fontSize: "clamp(42px,6vw,80px)", margin: "8px 0 12px", textTransform: "uppercase", color: "#fff" }}>KEEP RISING.</h2>
            <p style={{ color: "#aaa", fontSize: 13, maxWidth: 460, margin: "0 0 12px" }}>Fresh releases, rare cuts, and performance gym kits for the ones still rising.</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(231,25,75,0.12)", border: "1px solid var(--pink)", borderRadius: 4, color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--pink)" }} />
              2-WEEK DELIVERY GUARANTEE: ALL PURCHASES DELIVERED ON OR BEFORE 2 WEEKS AFTER ORDER
            </div>
          </div>
          <Link className="pink-button" href="/collection">
            View All Drops <ArrowDownRight size={16} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {products.slice(0, 4).map((item) => (
            <Link key={item.slug} href={`/product/${item.slug}`} style={{ display: "block", background: "#181818", borderRadius: 2, overflow: "hidden", transition: "transform 0.25s ease" }}>
              <img src={item.image} alt={item.name} style={{ width: "100%", height: 200, objectFit: "cover", display: "block", transition: "transform 0.35s ease" }} />
              <div style={{ padding: "12px 14px" }}>
                <strong style={{ display: "block", color: "#fff", fontSize: 13 }}>{item.name}</strong>
                <small style={{ color: "var(--pink)", fontWeight: 700 }}>{item.price}</small>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ABOUT TEASER ───────────────────────────── */}
      <section style={{ background: "var(--bone)", color: "#111", padding: "80px clamp(24px,8vw,120px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
        <div>
          <p className="eyebrow" style={{ color: "#777" }}>ABOUT ZOID / INTERNATIONAL AFRICAN</p>
          <h2 style={{ fontFamily: "Anton", fontSize: "clamp(40px,6vw,80px)", lineHeight: 0.9, margin: "16px 0 24px", textTransform: "uppercase" }}>BUILT ON GRIT.<br />WORN WITH<br />INTENT.</h2>
          <p style={{ color: "#555", lineHeight: 1.75, fontSize: 14, marginBottom: 28 }}>
            ZOID is an archive-led sports brand from Lagos. We collect, curate, and create pieces that honor football heritage while celebrating the grit of those who keep rising — regardless of circumstance.
          </p>
          <Link className="pink-button" href="/about">
            Read Our Story <ArrowDownRight size={17} />
          </Link>
        </div>
        <div style={{ position: "relative" }}>
          <img src={STORY_IMG} alt="ZOID story" style={{ width: "100%", height: 400, objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 20, left: 20, border: "1px solid var(--pink)", padding: "10px 14px", background: "rgba(9,9,9,0.7)", color: "#fff", fontSize: 10, letterSpacing: "0.14em", lineHeight: 1.4 }}>
            ZOID<br />FIELD<br />NOTES
          </div>
        </div>
      </section>

      {/* ── ZOID ARCHIVES TEASER ────────────────────── */}
      <section style={{ padding: "80px clamp(24px,8vw,120px)", background: "#0d0d0d", borderTop: "1px solid #1f1f1f" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--pink)" }}>COMMUNITY MEMORIES & STORIES</p>
            <h2 style={{ fontFamily: "Anton", fontSize: "clamp(40px,6vw,80px)", margin: "8px 0 0", textTransform: "uppercase", color: "#fff" }}>ZOID ARCHIVES.</h2>
          </div>
          <Link className="pink-button" href="/archives">Explore All Stories <ArrowRight size={16} /></Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {archiveSnippets.map((s) => (
            <div key={s.id} style={{ background: "#161616", border: "1px solid #222", borderRadius: 2 }}>
              <img src={s.img} alt={s.title} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
              <div style={{ padding: 20 }}>
                <p className="eyebrow" style={{ color: "#666", marginBottom: 6 }}>{s.loc} · {s.author}</p>
                <h3 style={{ fontFamily: "Anton", fontSize: 18, color: "#fff", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6, margin: 0 }}>"{s.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CURATED FORWARD ─────────────────────────── */}
      <section id="shop" style={{ padding: "80px clamp(24px,8vw,120px)", background: "#111" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, marginBottom: 36 }}>
          <div>
            <p className="eyebrow">CURATED SELECTION</p>
            <h2 style={{ fontFamily: "Anton", fontSize: "clamp(40px,6vw,80px)", margin: "8px 0 0", textTransform: "uppercase", color: "#fff" }}>
              CURATED <span style={{ color: "var(--pink)" }}>FORWARD.</span>
            </h2>
          </div>
          {/* Tab bar — text only, no stretched icons */}
          <div style={{ display: "flex", gap: 4, background: "#1a1a1a", padding: 4, borderRadius: 6, flexWrap: "wrap" }}>
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  padding: "9px 18px", fontSize: 10,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  fontWeight: 600, borderRadius: 4,
                  background: activeTab === id ? "var(--pink)" : "transparent",
                  color: activeTab === id ? "#fff" : "#888",
                  transition: "background 0.2s, color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {curatedItems.map((item) => (
            <div key={item.slug} style={{ background: "#161616", borderRadius: 2, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Link href={`/product/${item.slug}`}>
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: 260, objectFit: "cover", display: "block", transition: "transform 0.35s ease" }} />
                </Link>
                <button
                  onClick={() => toggleSaved(item.slug)}
                  aria-label={saved.includes(item.slug) ? "Remove from wishlist" : "Save to wishlist"}
                  style={{
                    position: "absolute", top: 10, right: 10,
                    width: 34, height: 34, borderRadius: "50%",
                    background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer",
                    display: "grid", placeItems: "center",
                    color: saved.includes(item.slug) ? "var(--pink)" : "#fff",
                    transition: "color 0.2s",
                  }}
                >
                  <Heart size={16} fill={saved.includes(item.slug) ? "currentColor" : "none"} />
                </button>
              </div>
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <p className="eyebrow" style={{ fontSize: 8, color: "#666", margin: 0 }}>{item.category}</p>
                <strong style={{ color: "#fff", fontSize: 13 }}>{item.name}</strong>
                <small style={{ color: "#888" }}>{item.tone}</small>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 12, borderTop: "1px solid #222" }}>
                  <span style={{ color: "var(--pink)", fontWeight: 700, fontSize: 14 }}>{item.price}</span>
                  <button
                    className="pink-button small"
                    onClick={() => addToBag(item, item.sizes[0])}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* High-Impact Eye-Catching CTA Banner after Curated Forward */}
        <div style={{
          marginTop: 64, textAlign: "center", padding: "64px 32px",
          background: "linear-gradient(135deg, #181818 0%, #0d0d0d 100%)",
          border: "1px solid var(--pink)", borderRadius: 8,
          boxShadow: "0 0 35px rgba(231,25,75,0.25)",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "rgba(231,25,75,0.15)", borderRadius: "50%", filter: "blur(40px)" }} />
          <p className="eyebrow" style={{ color: "var(--pink)", letterSpacing: "0.22em", marginBottom: 12 }}>FULL COLLECTION AVAILABLE</p>
          <h3 style={{ fontFamily: "Anton", fontSize: "clamp(36px,5vw,64px)", color: "#fff", margin: "0 0 16px", textTransform: "uppercase", textShadow: "0 0 20px rgba(231,25,75,0.3)" }}>
            READY FOR THE FULL EDIT?
          </h3>
          <p style={{ color: "#ccc", maxWidth: 500, margin: "0 auto 32px", fontSize: 14, lineHeight: 1.7 }}>
            Explore our complete archive: retro club jerseys, national team kits, limited releases, and performance gym gear.
          </p>
          <Link
            className="pink-button"
            href="/collection"
            style={{
              fontSize: 13, padding: "0 36px", minHeight: 52,
              boxShadow: "0 4px 25px rgba(231,25,75,0.5)",
              transform: "scale(1.04)"
            }}
          >
            ENTER SHOP CATALOGUE <ArrowDownRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer style={{ background: "#090909", borderTop: "1px solid #1a1a1a", padding: "64px clamp(24px,8vw,120px) 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <Link className="brand" href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 700, letterSpacing: "0.22em", marginBottom: 16 }}>
              <img src={MARK} alt="" style={{ height: 15 }} />ZOID
            </Link>
            <p style={{ color: "#666", fontSize: 12, lineHeight: 1.7, margin: "0 0 20px" }}>
              Curating before creating.<br />Archive sportswear &amp; community identity from Lagos.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["IG", "TW", "TT"].map((s) => (
                <a key={s} href="#" style={{ width: 32, height: 32, border: "1px solid #2a2a2a", display: "grid", placeItems: "center", color: "#666", fontSize: 9, letterSpacing: "0.1em", transition: "border-color 0.2s, color 0.2s" }}>{s}</a>
              ))}
            </div>
          </div>
          {/* Shop */}
          <div>
            <h4 style={{ color: "var(--pink)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Shop</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["New Drops", "/collection"], ["Jerseys", "/collection"], ["Gym Kits", "/collection"], ["Special Kits", "/collection"]].map(([l, h]) => (
                <Link key={l} href={h} style={{ color: "#888", fontSize: 12, transition: "color 0.2s" }}>{l}</Link>
              ))}
            </div>
          </div>
          {/* Brand */}
          <div>
            <h4 style={{ color: "var(--pink)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Brand</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["About ZOID", "/about"], ["ZOID Archives", "/archives"], ["Community", "/archives"], ["Contact", "/about"]].map(([l, h]) => (
                <Link key={l} href={h} style={{ color: "#888", fontSize: 12 }}>{l}</Link>
              ))}
            </div>
          </div>
          {/* Field Notes */}
          <div>
            <h4 style={{ color: "var(--pink)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Field Notes</h4>
            <p style={{ color: "#666", fontSize: 12, lineHeight: 1.65, marginBottom: 14 }}>Get drop alerts and archive updates direct to your inbox.</p>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                placeholder="Your email"
                style={{ flex: 1, padding: "10px 12px", background: "#141414", border: "1px solid #2a2a2a", color: "#fff", fontSize: 12, outline: "none" }}
              />
              <button
                className="pink-button small"
                onClick={() => toast.success("You're on the list.", { description: "We'll reach out when the next drop lands." })}
              >Join</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, color: "#444", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          <span>© ZOID STUDIOS / 2026</span>
          <span>Lagos — Nigeria</span>
          <span>Built on grit <b style={{ color: "var(--pink)" }}>•</b> Worn with intent</span>
        </div>
      </footer>

      {/* ── CART DRAWER ─────────────────────────────── */}
      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <div><p className="eyebrow">YOUR SELECTION</p><h3>THE BAG / {cartCount.toString().padStart(2, "0")}</h3></div>
              <button onClick={() => setCartOpen(false)}><X size={20} /></button>
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
                <button className="pink-button checkout" onClick={() => { setCartOpen(false); window.location.assign("/checkout"); }}>
                  Proceed to checkout <ArrowDownRight size={17} />
                </button>
              </>
            ) : (
              <div className="empty-bag">
                <ShoppingBag size={32} />
                <p>Your bag is waiting for a first pick.</p>
                <button className="line-link" onClick={() => setCartOpen(false)}>Explore the edit <ArrowDownRight size={16} /></button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ── SCROLL-TO-TOP FAB ───────────────────────── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 60,
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--pink)", color: "#fff",
            display: "grid", placeItems: "center",
            boxShadow: "0 4px 20px rgba(231,25,75,0.45)",
            border: "none", cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
        ><ArrowUp size={18} /></button>
      )}
    </main>
  );
}
