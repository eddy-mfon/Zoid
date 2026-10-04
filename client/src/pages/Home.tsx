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
  Star,
  Quote,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const MARK = "/zoid-logo.svg";
const STORY_IMG = "/manus-storage/zoid-story_425b40db.jpg";

/* ── Testimonials data ── */
const testimonials = [
  {
    id: "1",
    name: "Emeka N.",
    role: "Verified Buyer · Lagos",
    rating: 5,
    text: "The quality on the 1998 Brazil jersey is unbelievable. The weight of the fabric and detail on the crest took me straight back to childhood matchdays.",
    kit: "Brazil / 1998 Vintage",
    avatar: "/jerseys/National/Brazil 1998 home vintage jersey.jpg",
  },
  {
    id: "2",
    name: "Dr. Farouk A.",
    role: "Verified Buyer · Abuja",
    rating: 5,
    text: "Delivered to my door in Abuja in 3 days flat. ZOID Gym Set fits better than any big international activewear brand I've owned.",
    kit: "ZOID Pro Gym Set",
    avatar: "/manus-storage/zoid-jersey-detail_0ef688bb.jpg",
  },
  {
    id: "3",
    name: "Bisi Ogundipe",
    role: "Verified Buyer · Port Harcourt",
    rating: 5,
    text: "Japan 2026 Special kit is a work of art. The wave motif details in person look even crazier than the photos. Customer support was super responsive.",
    kit: "Japan / 2026 Special",
    avatar: "/jerseys/National/Japan 26 WCC.jpg",
  },
  {
    id: "4",
    name: "Kofi Mensah",
    role: "Verified Buyer · Accra / Lagos",
    rating: 5,
    text: "Finally an archive sports brand that understands African street style. Built on real grit and delivered with premium packaging.",
    kit: "France / 2026 Away",
    avatar: "/jerseys/National/France FIFA world cup 2026 away.jpg",
  },
];

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

  /* Pillar auto-cycle (active on desktop when not interacting) */
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 700) {
      return; // On mobile, highlight is driven by scroll position
    }
    const t = setInterval(() => setActivePillar((p) => (p + 1) % pillars.length), 3800);
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

  /* Mobile / scroll reactivity: highlight pillar cards progressively as user scrolls down */
  useEffect(() => {
    let ticking = false;

    const updatePillarOnScroll = () => {
      const cards = Array.from(document.querySelectorAll(".pillar-card")) as HTMLElement[];
      if (!cards.length) return;

      const vh = window.innerHeight;
      const triggerY = vh * 0.5; // Centerline of viewport

      let closestIdx = -1;
      let minDistance = Infinity;

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        // Check if card is within visible viewport range
        if (rect.bottom > vh * 0.15 && rect.top < vh * 0.85) {
          const cardCenter = rect.top + rect.height / 2;
          const dist = Math.abs(cardCenter - triggerY);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = i;
          }
        }
      });

      if (closestIdx !== -1) {
        setActivePillar(closestIdx);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updatePillarOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updatePillarOnScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
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
      <section
        style={{ background: "#0d0d0d", borderBottom: "1px solid #1f1f1f", padding: "72px clamp(24px,8vw,120px)" }}
        ref={(el) => {
          if (!el) return;
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const cards = el.querySelectorAll(".pillar-card");
                  cards.forEach((card, i) => {
                    setTimeout(() => {
                      (card as HTMLElement).style.opacity = "1";
                      (card as HTMLElement).style.transform = "translateY(0)";
                    }, i * 130);
                  });
                  observer.disconnect();
                }
              });
            },
            { threshold: 0.18 }
          );
          observer.observe(el);
        }}
      >
        <p className="eyebrow" style={{ color: "var(--pink)", marginBottom: 32 }}>
          WHAT ZOID STANDS FOR
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 0, border: "1px solid #222" }}>
          {pillars.map((p, i) => (
            <div
              key={p.num}
              className={`pillar-card ${activePillar === i ? "active-pillar" : ""}`}
              onMouseEnter={() => setActivePillar(i)}
              onClick={() => setActivePillar(i)}
              style={{
                padding: "40px 36px",
                borderRight: i < pillars.length - 1 ? "1px solid #222" : "none",
                cursor: "pointer",
                background: activePillar === i ? "rgba(179, 13, 13,0.07)" : "transparent",
                borderTop: activePillar === i ? "2px solid var(--pink)" : "2px solid transparent",
                transition: "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
                boxShadow: activePillar === i ? "inset 0 0 60px rgba(179, 13, 13,0.04)" : "none",
                /* scroll-reveal initial state */
                opacity: 0,
                transform: "translateY(28px)",
              }}
            >
              {/* Animated number indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span
                  style={{
                    fontSize: 9,
                    color: activePillar === i ? "var(--pink)" : "#444",
                    letterSpacing: "0.18em",
                    fontWeight: 700,
                    transition: "color 0.3s ease",
                  }}
                >
                  {p.num}
                </span>
                {activePillar === i && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 18,
                      height: 2,
                      background: "var(--pink)",
                      borderRadius: 2,
                      animation: "pillar-line-in 0.4s cubic-bezier(.23,1,.32,1) both",
                    }}
                  />
                )}
              </div>
              <h3
                style={{
                  fontFamily: "Anton",
                  fontSize: "clamp(28px,3vw,42px)",
                  margin: "0 0 16px",
                  color: activePillar === i ? "#fff" : "#777",
                  transition: "color 0.35s ease",
                  letterSpacing: "-0.01em",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  color: activePillar === i ? "#a9a49d" : "#555",
                  fontSize: 13,
                  lineHeight: 1.75,
                  margin: 0,
                  transition: "color 0.35s ease",
                }}
              >
                {p.text}
              </p>
              {/* Active dot */}
              {activePillar === i && (
                <div
                  style={{
                    marginTop: 22,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    animation: "pillar-line-in 0.4s cubic-bezier(.23,1,.32,1) both",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--pink)",
                      boxShadow: "0 0 10px var(--pink)",
                    }}
                  />
                  <span style={{ fontSize: 8, color: "var(--pink)", letterSpacing: "0.2em", fontWeight: 700 }}>
                    ACTIVE
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── VERIFIED CUSTOMER TESTIMONIALS SECTION ── */}
      <section style={{ padding: "80px clamp(24px, 8vw, 120px)", background: "#0e0e10", borderBottom: "1px solid #1f1f22" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--pink)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Star size={14} fill="var(--pink)" color="var(--pink)" /> WHAT THE COMMUNITY SAYS
            </p>
            <h2 style={{ fontFamily: "Anton", fontSize: "clamp(36px, 6vw, 72px)", margin: 0, textTransform: "uppercase", color: "#fff", lineHeight: 0.95 }}>
              TESTIMONIALS & <span style={{ color: "var(--pink)" }}>REVIEWS.</span>
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(179, 13, 13,0.08)", border: "1px solid rgba(179, 13, 13,0.25)", padding: "10px 18px", borderRadius: 4 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="var(--pink)" color="var(--pink)" />
              ))}
            </div>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>4.95/5 AVERAGE RATING</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {testimonials.map((t) => (
            <div
              key={t.id}
              style={{
                background: "#141417",
                border: "1px solid #242429",
                borderRadius: 6,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                transition: "transform 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(179, 13, 13,0.5)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#242429";
                e.currentTarget.style.transform = "none";
              }}
            >
              <Quote size={28} color="rgba(179, 13, 13,0.2)" style={{ position: "absolute", top: 20, right: 20 }} />
              
              <div>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={13} fill="var(--pink)" color="var(--pink)" />
                  ))}
                </div>
                <p style={{ color: "#ddd", fontSize: 13, lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>
                  "{t.text}"
                </p>
              </div>

              <div style={{ borderTop: "1px solid #222226", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--pink)" }}
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <strong style={{ color: "#fff", fontSize: 13, fontFamily: "Anton", letterSpacing: "0.04em" }}>{t.name}</strong>
                      <CheckCircle2 size={12} color="#10b981" />
                    </div>
                    <span style={{ fontSize: 9, color: "#888", display: "block" }}>{t.role}</span>
                  </div>
                </div>
                <span style={{ fontSize: 9, background: "#1f1f26", color: "var(--pink)", padding: "4px 8px", borderRadius: 3, fontWeight: 600 }}>
                  {t.kit}
                </span>
              </div>
            </div>
          ))}
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
              border: "1px solid rgba(179, 13, 13,0.6)",
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
                boxShadow: "0 8px 32px rgba(179, 13, 13, 0.45)",
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
              <div style={{ marginTop: 6, paddingTop: 8, borderTop: "1px solid #1c1c1c" }}>
                <span style={{ display: "block", color: "var(--pink)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
                  Emergency Hotline
                </span>
                <a href="tel:09020711737" style={{ color: "#fff", fontSize: 12, textDecoration: "none", fontWeight: 600 }}>
                  09020711737
                </a>
              </div>
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
            color: "#666",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>© ZOID STUDIOS / 2026</span>
          <span>Lagos — Nigeria</span>
          <span>Hotline: <a href="tel:09020711737" style={{ color: "var(--pink)", textDecoration: "none", fontWeight: 700 }}>09020711737</a></span>
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
            boxShadow: "0 4px 20px rgba(179, 13, 13,0.45)",
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
