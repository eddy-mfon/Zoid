/* ZOID Storefront — Branding-First Homepage: pure identity, story, and curated edits. */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { products, searchProducts } from "@/lib/catalog";
import { useZoidMotion } from "@/hooks/useZoidMotion";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Heart,
  Search,
  X,
  ChevronRight,
  Flame,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

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
  {
    id: "1",
    title: "The 1998 Samba Memory",
    author: "Tunde O.",
    loc: "Surulere, Lagos",
    text: "Watching Ronaldo in 1998 changed how I saw football.",
    img: "/jerseys/National/Brazil 1998 home vintage jersey.jpg",
  },
  {
    id: "2",
    title: "San Siro Under the Lights",
    author: "Chidi K.",
    loc: "Abuja",
    text: "Sourcing vintage Milan kits was my entry into sportswear curation.",
    img: "/manus-storage/ac-milan-2526_b917ea29.jpg",
  },
  {
    id: "3",
    title: "Street Culture & Sportswear",
    author: "Amina B.",
    loc: "Lekki, Lagos",
    text: "In Lagos, jerseys are everyday luxury — a badge of identity.",
    img: STORY_IMG,
  },
];

/* ── Brand pillars ── */
const pillars = [
  { num: "01", title: "CURATE", text: "Every piece earns its place through story, provenance, and material honesty." },
  { num: "02", title: "ARCHIVE", text: "We preserve football memory — from dusty Lagos pitches to European stadiums." },
  { num: "03", title: "RISE", text: "Crafted for the ones who grind without guarantee. Built on grit, worn with intent." },
];

export default function Home() {
  const pageRef = useRef<HTMLElement | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [prevHero, setPrevHero] = useState<number | null>(null);
  const [utilityOpen, setUtilityOpen] = useState<"search" | "saved" | null>(null);
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activePillar, setActivePillar] = useState(0);
  const [hoveredArchive, setHoveredArchive] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const { wishlist, toggleWishlist } = useAuth();

  useZoidMotion(pageRef);

  /* Scrolled state */
  const scrolled = scrollY > 20;

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

  /* Fade out prevHero after 700ms */
  useEffect(() => {
    if (prevHero === null) return;
    const t = setTimeout(() => setPrevHero(null), 700);
    return () => clearInterval(t);
  }, [prevHero]);

  /* Pillar auto-cycle */
  useEffect(() => {
    const t = setInterval(() => setActivePillar((p) => (p + 1) % pillars.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("search") !== null) setUtilityOpen("search");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUtilityOpen(null);
    };
    const onScroll = () => {
      setScrollY(window.scrollY);
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

  function goHero(idx: number) {
    setPrevHero(heroIndex);
    setHeroIndex(idx);
  }

  // Bestsellers & Special Kits for vertical section
  const bestsellers = useMemo(() => products.filter((p) => p.isBestseller).slice(0, 4), []);
  const specialKits = useMemo(() => products.filter((p) => p.isSpecial).slice(0, 4), []);

  return (
    <main className="zoid-shell home-page" ref={pageRef}>
      {/* ── NAVBAR ──────────────────────────────────── */}
      <Navbar
        scrolled={scrolled}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        utilityOpen={utilityOpen}
        setUtilityOpen={setUtilityOpen}
        savedCount={wishlist.length}
      />

      {/* ── SEARCH OVERLAY ─────────────────────────── */}
      {utilityOpen === "search" && (
        <div className="search-overlay" role="dialog" aria-modal="true">
          <button className="search-overlay-backdrop" onClick={() => setUtilityOpen(null)} />
          <section className="search-overlay-panel">
            <div className="utility-panel-head">
              <div>
                <span>UNIVERSAL SEARCH</span>
                <small>Products, kits, stories & more</small>
              </div>
              <button onClick={() => setUtilityOpen(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="search-field">
              <Search size={20} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: Milan, Gym Kit, Brazil, Vintage, Lagos…"
              />
            </div>
            {!query && (
              <div className="search-discovery">
                <div className="search-discovery-group">
                  <span>POPULAR SEARCHES</span>
                  <div>
                    {["Gym Kit", "AC Milan", "Brazil 1998", "Special Kits", "Heritage"].map((t) => (
                      <button key={t} onClick={() => setQuery(t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="utility-results">
              {searchResults.slice(0, 6).map((item) => (
                <Link key={item.slug} href={`/product/${item.slug}`} onClick={() => setUtilityOpen(null)}>
                  <img src={item.image} alt="" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {item.category} · {item.price}
                    </small>
                  </span>
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
              <span>YOUR WISHLIST — {wishlist.length} ITEM{wishlist.length !== 1 ? "S" : ""}</span>
              <button onClick={() => setUtilityOpen(null)}>
                <X size={17} />
              </button>
            </div>
            {wishlist.length > 0 ? (
              wishlist.map((slug) => {
                const item = products.find((p) => p.slug === slug);
                if (!item) return null;
                return (
                  <div key={slug} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #282828", padding: "8px 0" }}>
                    <Link
                      href={`/product/${slug}`}
                      onClick={() => setUtilityOpen(null)}
                      style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, textDecoration: "none", color: "#fff" }}
                    >
                      <img src={item.image} alt="" style={{ width: 44, height: 54, objectFit: "cover", borderRadius: 3 }} />
                      <span>
                        <strong style={{ fontSize: 11, textTransform: "uppercase" }}>{item.name}</strong>
                        <small style={{ color: "var(--pink)", fontSize: 11 }}>{item.price}</small>
                      </span>
                    </Link>
                    <button onClick={() => toggleWishlist(slug)} style={{ color: "#777", padding: 6 }}>
                      <X size={14} />
                    </button>
                  </div>
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
        {prevHero !== null && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundImage: `url(${heroSlides[prevHero].img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0,
              transition: "opacity 0.7s ease",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            backgroundImage: `url(${heroSlides[heroIndex].img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 0.7s ease",
            opacity: 1,
          }}
        />
        <div className="hero-scrim" style={{ zIndex: 2 }} />
        <div className="hero-copy" style={{ position: "relative", zIndex: 3 }}>
          <p className="eyebrow" style={{ transition: "opacity 0.4s ease" }}>
            {heroSlides[heroIndex].kicker}
          </p>
          <h1 style={{ whiteSpace: "pre-line", transition: "opacity 0.4s ease" }}>{heroSlides[heroIndex].title}</h1>
          <p className="hero-intro" style={{ transition: "opacity 0.4s ease" }}>
            {heroSlides[heroIndex].sub}
          </p>
          <div className="hero-actions">
            <Link className="pink-button" href="/collection">
              Shop Collection <ArrowDownRight size={17} />
            </Link>
            <Link className="ghost-button" href="/about">
              Our Story
            </Link>
          </div>
          {/* Carousel controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 36 }}>
            <button
              onClick={() => goHero((heroIndex - 1 + heroSlides.length) % heroSlides.length)}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.35)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                flexShrink: 0,
              }}
              aria-label="Previous slide"
            >
              <ArrowLeft size={14} />
            </button>

            {heroSlides.map((_, idx) => (
              <span
                key={idx}
                onClick={() => goHero(idx)}
                style={{
                  cursor: "pointer",
                  width: heroIndex === idx ? 26 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: heroIndex === idx ? "var(--pink)" : "rgba(255,255,255,0.35)",
                  transition: "width 0.4s ease, background 0.4s ease",
                  flexShrink: 0,
                }}
              />
            ))}

            <button
              onClick={() => goHero((heroIndex + 1) % heroSlides.length)}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.35)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                flexShrink: 0,
              }}
              aria-label="Next slide"
            >
              <ArrowRight size={14} />
            </button>

            <small style={{ color: "rgba(255,255,255,0.5)", marginLeft: 4, fontSize: 10, letterSpacing: "0.12em" }}>
              0{heroIndex + 1} / 0{heroSlides.length}
            </small>
          </div>
        </div>
      </section>

      {/* ── BRAND PILLARS ───────────────────────────── */}
      <section style={{ background: "#0d0d0d", borderBottom: "1px solid #1f1f1f", padding: "72px clamp(24px,8vw,120px)" }}>
        <p className="eyebrow" style={{ color: "var(--pink)", marginBottom: 32 }}>
          WHAT ZOID STANDS FOR
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 0, border: "1px solid #222" }}>
          {pillars.map((p, i) => (
            <div
              key={p.num}
              onClick={() => setActivePillar(i)}
              style={{
                padding: "40px 36px",
                borderRight: i < pillars.length - 1 ? "1px solid #222" : "none",
                cursor: "pointer",
                background: activePillar === i ? "rgba(231,25,75,0.07)" : "transparent",
                borderTop: activePillar === i ? "2px solid var(--pink)" : "2px solid transparent",
                transition: "background 0.3s ease, border-color 0.3s ease",
              }}
            >
              <span style={{ fontSize: 9, color: activePillar === i ? "var(--pink)" : "#555", letterSpacing: "0.18em", display: "block", marginBottom: 12 }}>
                {p.num}
              </span>
              <h3 style={{ fontFamily: "Anton", fontSize: "clamp(28px,3vw,42px)", margin: "0 0 16px", color: activePillar === i ? "#fff" : "#aaa", transition: "color 0.3s ease" }}>
                {p.title}
              </h3>
              <p style={{ color: "#666", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEDICATED VERTICAL BESTSELLERS & SPECIAL KITS SECTION ── */}
      <section style={{ padding: "80px clamp(24px, 8vw, 120px)", background: "#111", borderBottom: "1px solid #1f1f1f" }}>
        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--pink)", marginBottom: 8 }}>CURATED HIGHLIGHTS</p>
            <h2 style={{ fontFamily: "Anton", fontSize: "clamp(38px, 6vw, 76px)", margin: 0, textTransform: "uppercase", color: "#fff", lineHeight: 0.95 }}>
              BESTSELLERS & <span style={{ color: "var(--pink)" }}>SPECIAL KITS.</span>
            </h2>
          </div>
          <Link className="pink-button" href="/collection">
            View All Collection <ArrowRight size={16} />
          </Link>
        </div>

        {/* 1. Bestsellers Vertical Grid */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, borderBottom: "1px solid #262626", paddingBottom: 12 }}>
            <Flame size={16} color="var(--pink)" />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "#fff", textTransform: "uppercase" }}>
              MOST WANTED / BESTSELLERS
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 24 }}>
            {bestsellers.map((item) => (
              <div
                key={item.slug}
                style={{
                  background: "#161616",
                  border: "1px solid #282828",
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: "transform 0.25s ease, border-color 0.25s ease",
                }}
              >
                <Link href={`/product/${item.slug}`} style={{ display: "block", position: "relative", overflow: "hidden", height: 280, background: "#0c0c0c" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12, transition: "transform 0.4s ease" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "var(--pink)",
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      padding: "4px 8px",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Flame size={10} /> BESTSELLER
                  </span>
                </Link>

                <div style={{ padding: 18 }}>
                  <span style={{ fontSize: 8, letterSpacing: "0.14em", color: "#777", textTransform: "uppercase" }}>{item.category}</span>
                  <Link href={`/product/${item.slug}`}>
                    <h3 style={{ fontFamily: "Anton", fontSize: 18, color: "#fff", margin: "4px 0 10px", textTransform: "uppercase" }}>
                      {item.name}
                    </h3>
                  </Link>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #242424", paddingTop: 12 }}>
                    <strong style={{ fontSize: 14, color: "var(--pink)" }}>{item.price}</strong>
                    <Link
                      href={`/product/${item.slug}`}
                      className="pink-button small"
                      style={{ fontSize: 9, padding: "0 12px", minHeight: 32 }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Special Kits Vertical Grid */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, borderBottom: "1px solid #262626", paddingBottom: 12 }}>
            <Sparkles size={16} color="#a855f7" />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "#fff", textTransform: "uppercase" }}>
              SPECIAL EDITIONS & GYM PERFORMANCE KITS
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 24 }}>
            {specialKits.map((item) => (
              <div
                key={item.slug}
                style={{
                  background: "#161616",
                  border: "1px solid #282828",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Link href={`/product/${item.slug}`} style={{ display: "block", position: "relative", overflow: "hidden", height: 280, background: "#0c0c0c" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "#a855f7",
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      padding: "4px 8px",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Sparkles size={10} /> SPECIAL KIT
                  </span>
                </Link>

                <div style={{ padding: 18 }}>
                  <span style={{ fontSize: 8, letterSpacing: "0.14em", color: "#777", textTransform: "uppercase" }}>{item.category}</span>
                  <Link href={`/product/${item.slug}`}>
                    <h3 style={{ fontFamily: "Anton", fontSize: 18, color: "#fff", margin: "4px 0 10px", textTransform: "uppercase" }}>
                      {item.name}
                    </h3>
                  </Link>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #242424", paddingTop: 12 }}>
                    <strong style={{ fontSize: 14, color: "var(--pink)" }}>{item.price}</strong>
                    <Link
                      href={`/product/${item.slug}`}
                      className="pink-button small"
                      style={{ fontSize: 9, padding: "0 12px", minHeight: 32 }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT TEASER ── */}
      <section
        style={{
          background: "var(--bone)",
          color: "#111",
          padding: "80px clamp(24px,8vw,120px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <p className="eyebrow" style={{ color: "#777" }}>
            ABOUT ZOID / INTERNATIONAL AFRICAN
          </p>
          <h2
            style={{
              fontFamily: "Anton",
              fontSize: "clamp(40px,6vw,80px)",
              lineHeight: 0.9,
              margin: "16px 0 24px",
              textTransform: "uppercase",
            }}
          >
            BUILT ON GRIT.
            <br />
            WORN WITH
            <br />
            INTENT.
          </h2>
          <p style={{ color: "#555", lineHeight: 1.75, fontSize: 14, marginBottom: 28 }}>
            ZOID is an archive-led sports brand from Lagos. We collect, curate, and create pieces that honor football heritage while celebrating the grit of those who keep rising — regardless of circumstance.
          </p>
          <Link className="pink-button" href="/about">
            Read Our Story <ArrowDownRight size={17} />
          </Link>
        </div>
        <div style={{ position: "relative" }}>
          <img src={STORY_IMG} alt="ZOID story" style={{ width: "100%", height: 420, objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              background: "rgba(12, 12, 12, 0.88)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(231,25,75,0.6)",
              borderRadius: 6,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            }}
          >
            <img src={MARK} alt="ZOID Logo" style={{ height: 26, width: "auto" }} />
            <div>
              <span style={{ color: "#fff", fontFamily: "Anton", fontSize: 18, letterSpacing: "0.14em", display: "block", lineHeight: 1 }}>
                ZOID
              </span>
              <span style={{ color: "var(--pink)", fontSize: 8, letterSpacing: "0.18em", fontWeight: 700, textTransform: "uppercase" }}>
                LAGOS ARCHIVE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ZOID ARCHIVES TEASER ────────────────────── */}
      <section style={{ padding: "80px clamp(24px,8vw,120px)", background: "#0d0d0d", borderTop: "1px solid #1f1f1f" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--pink)" }}>COMMUNITY MEMORIES & STORIES</p>
            <h2 style={{ fontFamily: "Anton", fontSize: "clamp(40px,6vw,80px)", margin: "8px 0 0", textTransform: "uppercase", color: "#fff" }}>
              ZOID ARCHIVES.
            </h2>
          </div>
          <Link className="pink-button" href="/archives">
            Explore All Stories <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {archiveSnippets.map((s) => (
            <Link
              key={s.id}
              href="/archives"
              onMouseEnter={() => setHoveredArchive(s.id)}
              onMouseLeave={() => setHoveredArchive(null)}
              style={{
                background: "#161616",
                border: "1px solid #222",
                borderRadius: 2,
                display: "block",
                overflow: "hidden",
                transform: hoveredArchive === s.id ? "translateY(-6px)" : "none",
                boxShadow: hoveredArchive === s.id ? "0 16px 40px rgba(0,0,0,0.5)" : "none",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                borderTop: hoveredArchive === s.id ? "2px solid var(--pink)" : "2px solid transparent",
              }}
            >
              <img src={s.img} alt={s.title} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
              <div style={{ padding: 20 }}>
                <p className="eyebrow" style={{ color: "#666", marginBottom: 6 }}>
                  {s.loc} · {s.author}
                </p>
                <h3 style={{ fontFamily: "Anton", fontSize: 18, color: "#fff", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>"{s.text}"</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--pink)", fontSize: 9, letterSpacing: "0.16em", fontWeight: 700 }}>
                  READ STORY <ChevronRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HIGH-IMPACT BRAND CTA (Tag Removed & Elevated Design) ────── */}
      <section
        style={{
          padding: "120px clamp(24px,8vw,120px)",
          background: "radial-gradient(circle at 50% 30%, #1f0b12 0%, #0c0c0c 80%)",
          borderTop: "1px solid #221217",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h2
            style={{
              fontFamily: "Anton",
              fontSize: "clamp(48px, 8vw, 104px)",
              margin: "0 0 24px",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
            }}
          >
            YOUR RISE HAS NO CEILING.
            <br />
            <span style={{ color: "var(--pink)" }}>WORN WITH INTENT.</span>
          </h2>

          <p
            style={{
              color: "#aaa",
              maxWidth: 600,
              margin: "0 auto 40px",
              fontSize: "clamp(14px, 1.8vw, 17px)",
              lineHeight: 1.7,
            }}
          >
            Step into the complete ZOID edit. Rare retro cuts, national team grails, and high-performance gym gear — backed by our 2-week delivery promise from Lagos.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              className="pink-button"
              href="/collection"
              style={{
                fontSize: 12,
                padding: "0 44px",
                minHeight: 56,
                boxShadow: "0 8px 32px rgba(231, 25, 75, 0.45)",
                fontWeight: 700,
                letterSpacing: "0.16em",
              }}
            >
              EXPLORE SHOP EDIT <ArrowDownRight size={18} />
            </Link>
            <Link
              className="ghost-button"
              href="/archives"
              style={{
                fontSize: 12,
                padding: "0 38px",
                minHeight: 56,
                fontWeight: 700,
                letterSpacing: "0.16em",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              ZOID ARCHIVES <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer style={{ background: "#090909", borderTop: "1px solid #1a1a1a", padding: "64px clamp(24px,8vw,120px) 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <Link className="brand" href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 700, letterSpacing: "0.22em", marginBottom: 16 }}>
              <img src={MARK} alt="" style={{ height: 15 }} />
              ZOID
            </Link>
            <p style={{ color: "#666", fontSize: 12, lineHeight: 1.7, margin: "0 0 20px" }}>
              Curating before creating.
              <br />
              Archive sportswear & community identity from Lagos.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["IG", "TW", "TT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    width: 32,
                    height: 32,
                    border: "1px solid #2a2a2a",
                    display: "grid",
                    placeItems: "center",
                    color: "#666",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {/* Shop */}
          <div>
            <h4 style={{ color: "var(--pink)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Shop</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["New Drops", "/collection"],
                ["Jerseys", "/collection"],
                ["Gym Kits", "/collection"],
                ["Special Kits", "/collection"],
              ].map(([l, h]) => (
                <Link key={l} href={h} style={{ color: "#888", fontSize: 12, transition: "color 0.2s" }}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
          {/* Brand */}
          <div>
            <h4 style={{ color: "var(--pink)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Brand</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["About ZOID", "/about"],
                ["ZOID Archives", "/archives"],
                ["Community", "/archives"],
                ["Contact", "/about"],
              ].map(([l, h]) => (
                <Link key={l} href={h} style={{ color: "#888", fontSize: 12 }}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
          {/* Newsletter */}
          <div>
            <h4 style={{ color: "var(--pink)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Stay Updated</h4>
            <p style={{ color: "#666", fontSize: 12, lineHeight: 1.65, marginBottom: 14 }}>
              Get drop alerts and archive updates direct to your inbox.
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="e.g. yourname@example.com"
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  background: "#141414",
                  border: "1px solid #2a2a2a",
                  color: "#fff",
                  fontSize: 12,
                  outline: "none",
                }}
              />
              <button
                className="pink-button small"
                onClick={() => {
                  if (newsletterEmail) {
                    toast.success("You're on the list.", { description: "We'll reach out when the next drop lands." });
                    setNewsletterEmail("");
                  }
                }}
              >
                Join
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #1a1a1a",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            color: "#444",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>© ZOID STUDIOS / 2026</span>
          <span>Lagos — Nigeria</span>
          <span>
            Built on grit <b style={{ color: "var(--pink)" }}>•</b> Worn with intent
          </span>
        </div>
      </footer>

      {/* ── SCROLL-TO-TOP FAB ───────────────────────── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 60,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--pink)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 4px 20px rgba(231,25,75,0.45)",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </main>
  );
}
