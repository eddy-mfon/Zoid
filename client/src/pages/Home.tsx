/* ZOID Storefront — Branding-First Homepage: pure identity, story, and curated edits. */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { products, searchProducts } from "@/lib/catalog";
import CentralSearchModal from "@/components/CentralSearchModal";
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
    kicker: "04 / PILLAR OF GRIT",
    title: "BUILT ON\nGRIT",
    sub: "Won with intent, nothing meaningful is built in a single moment. Grit lives in the hours of practice, the difficult days, and the choice to show up when giving up feels easier. ZOID represents more than movement. It represents the mindset, effort, and determination behind every step forward.",
    img: "/manus-storage/ac-milan-2526_b917ea29.jpg",
  },
  {
    kicker: "05 / COMMUNITY MEMORIES",
    title: "THE\nARCHIVES",
    sub: "Every piece carries a story. Every story deserves to be heard. Behind every jersey, every design, and every ZOID piece is a story worth preserving. A collection of the people, memories, struggles, and milestones woven into what we wear.",
    img: "/manus-storage/zoid-story_425b40db.jpg",
  },
  {
    kicker: "ZOID ATHLETES",
    title: "THE IDENTITY\nOF A ZOID ATHLETE",
    sub: "Grit. Discipline. Purpose. Every piece we make reflects who you are",
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
  {
    num: "01",
    title: "IDENTITY",
    headline: "Before the world gives you a title, you already possess an identity.",
    body: "Every athlete has a story beyond the name and number on their jersey. Identity is where we come from, what shapes us, and the values we carry into everything we do. Before the performance, before the recognition, there is you.",
  },
  {
    num: "02",
    title: "ENVIRONMENT",
    headline: "Where we come from shapes how we move.",
    body: "From the landscapes we hail from to the cultures that ground us, our environment leaves its mark on who we become. It is a reminder that beauty, strength, and inspiration have always existed in the places we call home.",
  },
  {
    num: "03",
    title: "RISE",
    headline: "The decision to keep moving even when victory isn't certain.",
    body: "The work no one sees. The early mornings, the setbacks, the discipline to begin again. RISE and stand and refuse to let a difficult beginning decide how your story ends.",
  },
];

export default function Home() {
  const [location] = useLocation();
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

  /* Check URL for ?search=1 and automatically open central search */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("search") !== null) {
      setUtilityOpen("search");
    }
  }, [location]);

  function closeSearch() {
    setUtilityOpen(null);
    if (window.location.search.includes("search")) {
      window.history.replaceState({}, "", "/");
    }
  }

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

      {/* ── CENTRALIZED BLURRED SEARCH MODAL ─────────────────── */}
      <CentralSearchModal
        isOpen={utilityOpen === "search"}
        onClose={closeSearch}
      />

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
          <p
            className="hero-intro"
            style={{
              transition: "opacity 0.4s ease",
              fontSize: "clamp(14px, 1.4vw, 17px)",
              lineHeight: 1.7,
              maxWidth: 580,
              color: "#d8d5ce",
              margin: "24px 0 28px",
            }}
          >
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

      {/* ── RED ANNOUNCEMENT TICKER BANNER ── */}
      <div
        style={{
          background: "var(--pink)",
          color: "#fff",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          overflow: "hidden",
          borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: "#000", color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", padding: "3px 8px", borderRadius: 2 }}>
            NOTICE
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            2-Week Global Express Delivery from Lagos Hub • 100% Authenticated Drops
          </span>
        </div>
        <Link
          href="/collection"
          style={{
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            borderBottom: "1px solid rgba(255,255,255,0.6)",
            paddingBottom: 2,
          }}
        >
          View Collection <ArrowRight size={12} />
        </Link>
      </div>

      {/* ── BRAND PILLARS: EDITORIAL BRUTALIST GRID ── */}
      <section
        style={{
          background: "#0a0a0c",
          borderBottom: "1px solid #1f1f24",
          padding: "90px clamp(24px, 8vw, 120px)",
          position: "relative",
          overflow: "hidden",
        }}
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
                    }, i * 150);
                  });
                  observer.disconnect();
                }
              });
            },
            { threshold: 0.15 }
          );
          observer.observe(el);
        }}
      >
        {/* Subtle background ambient red glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "25%",
            width: "50%",
            height: 300,
            background: "radial-gradient(ellipse at center, rgba(179, 13, 13, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Section Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 48,
            borderBottom: "1px solid #1c1c22",
            paddingBottom: 24,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--pink)",
                  boxShadow: "0 0 10px var(--pink)",
                }}
              />
              <p className="eyebrow" style={{ color: "var(--pink)", margin: 0, letterSpacing: "0.22em" }}>
                CORE PRINCIPLES // ARCHIVE ETHOS
              </p>
            </div>
            <h2
              style={{
                fontFamily: "Anton",
                fontSize: "clamp(38px, 6vw, 76px)",
                margin: 0,
                textTransform: "uppercase",
                color: "#fff",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
              }}
            >
              WHAT ZOID <span style={{ color: "var(--pink)" }}>STANDS FOR</span>
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 10, color: "#666", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              HOVER TO ENGAGE PILLAR
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {pillars.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePillar(idx)}
                  style={{
                    width: activePillar === idx ? 28 : 10,
                    height: 5,
                    borderRadius: 2,
                    background: activePillar === idx ? "var(--pink)" : "#333",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  aria-label={`Select Pillar 0${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
            gap: 20,
            position: "relative",
            zIndex: 2,
          }}
        >
          {pillars.map((p, i) => {
            const isSelected = activePillar === i;
            return (
              <div
                key={p.num}
                className={`pillar-card ${isSelected ? "active-pillar" : ""}`}
                onMouseEnter={() => setActivePillar(i)}
                onClick={() => setActivePillar(i)}
                style={{
                  padding: "40px 32px 36px",
                  borderRadius: 4,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: isSelected
                    ? "linear-gradient(180deg, #181214 0%, #100d0e 100%)"
                    : "#111115",
                  border: isSelected
                    ? "1px solid rgba(179, 13, 13, 0.55)"
                    : "1px solid #1c1c24",
                  boxShadow: isSelected
                    ? "0 20px 45px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(179, 13, 13, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                    : "0 6px 20px rgba(0, 0, 0, 0.3)",
                  transform: isSelected ? "translateY(-4px)" : "none",
                  transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
                  opacity: 0,
                }}
              >
                {/* Top Glowing Edge Bar when active */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: isSelected ? 3 : 1,
                    background: isSelected
                      ? "linear-gradient(90deg, var(--pink) 0%, #ff4b4b 100%)"
                      : "transparent",
                    transition: "height 0.3s ease, background 0.3s ease",
                  }}
                />

                {/* Big Background Ghost Numeral */}
                <span
                  style={{
                    position: "absolute",
                    right: 18,
                    top: 10,
                    fontFamily: "Anton",
                    fontSize: "clamp(88px, 9vw, 130px)",
                    lineHeight: 0.8,
                    color: isSelected ? "rgba(179, 13, 13, 0.12)" : "rgba(255, 255, 255, 0.03)",
                    pointerEvents: "none",
                    userSelect: "none",
                    fontWeight: 900,
                    transition: "color 0.35s ease",
                  }}
                >
                  {p.num}
                </span>

                <div>
                  {/* Category Chip + Status */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        fontWeight: 800,
                        color: isSelected ? "var(--pink)" : "#666",
                        background: isSelected ? "rgba(179, 13, 13, 0.15)" : "#18181e",
                        border: isSelected ? "1px solid rgba(179, 13, 13, 0.35)" : "1px solid #23232c",
                        padding: "5px 12px",
                        borderRadius: 2,
                        textTransform: "uppercase",
                        transition: "all 0.3s ease",
                      }}
                    >
                      PILLAR // {p.num}
                    </span>

                    {isSelected && (
                      <span
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.16em",
                          fontWeight: 700,
                          color: "var(--pink)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--pink)",
                            boxShadow: "0 0 8px var(--pink)",
                          }}
                        />
                        FOCUSED
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "Anton",
                      fontSize: "clamp(32px, 3.8vw, 50px)",
                      margin: "0 0 16px",
                      color: isSelected ? "#fff" : "#999",
                      transition: "color 0.35s ease",
                      letterSpacing: "-0.01em",
                      lineHeight: 0.95,
                      textTransform: "uppercase",
                    }}
                  >
                    {p.title}
                  </h3>

                  {/* Bold Quote/Headline */}
                  <p
                    style={{
                      color: isSelected ? "#fff" : "#a8a29a",
                      fontSize: "clamp(15px, 1.35vw, 17.5px)",
                      lineHeight: 1.5,
                      fontWeight: 600,
                      margin: "0 0 18px",
                      transition: "color 0.35s ease",
                      borderLeft: isSelected ? "2px solid var(--pink)" : "2px solid #282832",
                      paddingLeft: 14,
                    }}
                  >
                    "{p.headline}"
                  </p>

                  {/* Body Paragraph */}
                  <p
                    style={{
                      color: isSelected ? "#c5bfb6" : "#6c6861",
                      fontSize: "clamp(13px, 1.1vw, 14.5px)",
                      lineHeight: 1.8,
                      margin: 0,
                      transition: "color 0.35s ease",
                    }}
                  >
                    {p.body}
                  </p>
                </div>

                {/* Footer of card */}
                <div
                  style={{
                    borderTop: isSelected ? "1px solid rgba(179, 13, 13, 0.3)" : "1px solid #1a1a22",
                    paddingTop: 18,
                    marginTop: 28,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: isSelected ? "#fff" : "#555",
                      fontWeight: 700,
                    }}
                  >
                    ZOID ETHOS // 2026
                  </span>
                  <span
                    style={{
                      color: isSelected ? "var(--pink)" : "#444",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {isSelected ? "EXPLORING" : "EXPLORE"} <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
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
              TESTIMONIALS & <span style={{ color: "var(--pink)" }}>REVIEWS</span>
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

      {/* ── HIGH-IMPACT RED STATEMENT SECTION ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #b30d0d 0%, #800707 60%, #570000 100%)",
          color: "#fff",
          padding: "70px clamp(24px, 8vw, 120px)",
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.4)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "2%",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            userSelect: "none",
            opacity: 0.14,
            filter: "brightness(0)",
          }}
        >
          <img
            src={MARK}
            alt=""
            style={{
              width: "clamp(180px, 24vw, 320px)",
              height: "auto",
              display: "block",
            }}
          />
        </div>
        <div style={{ maxWidth: 840, position: "relative", zIndex: 2 }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              fontWeight: 800,
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: 14,
            }}
          >
            LAGOS ARCHIVE // STREET CULTURE // NEVER SETTLE
          </p>
          <h2
            style={{
              fontFamily: "Anton",
              fontSize: "clamp(38px, 6.5vw, 84px)",
              lineHeight: 0.92,
              margin: "0 0 20px",
              textTransform: "uppercase",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            KEEP IT GOING.<br />
            NO MATTER THE ODDS.
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "clamp(14px, 1.8vw, 17px)",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "0 0 32px",
            }}
          >
            ZOID connects football nostalgia, African perspective, and modern sportswear into an unapologetic identity. Made for the ones still rising.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href="/collection"
              style={{
                background: "#090909",
                color: "#fff",
                padding: "0 32px",
                minHeight: 50,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRadius: 2,
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
              }}
            >
              Shop Curated Edits <ArrowRight size={16} />
            </Link>
            <Link
              href="/archives"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.4)",
                color: "#fff",
                padding: "0 28px",
                minHeight: 50,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRadius: 2,
                backdropFilter: "blur(6px)",
              }}
            >
              Read Archives
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXPLORE O STORIES — Prominent CTA Section ────────────────────── */}
      <section style={{
        padding: "80px clamp(24px,8vw,120px)",
        background: "linear-gradient(135deg, #0d0d0d 0%, #1a0a10 50%, #0d0d0d 100%)",
        borderTop: "1px solid #1f1f1f",
        textAlign: "center",
      }}>
        <p className="eyebrow" style={{ color: "var(--pink)", marginBottom: 16 }}>COMMUNITY MEMORIES & STORIES</p>
        <h2 style={{
          fontFamily: "Anton",
          fontSize: "clamp(40px,6vw,80px)",
          margin: "0 auto 20px",
          textTransform: "uppercase",
          color: "#fff",
          lineHeight: 0.95,
        }}>
          EXPLORE <span style={{ color: "var(--pink)" }}>ALL THE STORIES</span>
        </h2>
        <p style={{
          color: "#999",
          fontSize: "clamp(14px,1.6vw,17px)",
          lineHeight: 1.7,
          maxWidth: 560,
          margin: "0 auto 40px",
        }}>
          Every jersey carries a memory. Discover stories from match days, local pitches, and urban streets across Africa and beyond
        </p>

        {/* Story preview cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginBottom: 48 }}>
          {archiveSnippets.map((s) => (
            <Link
              key={s.id}
              href="/archives"
              onMouseEnter={() => setHoveredArchive(s.id)}
              onMouseLeave={() => setHoveredArchive(null)}
              style={{
                background: "#161616",
                border: "1px solid #222",
                borderRadius: 6,
                display: "block",
                overflow: "hidden",
                transform: hoveredArchive === s.id ? "translateY(-6px)" : "none",
                boxShadow: hoveredArchive === s.id ? "0 16px 40px rgba(0,0,0,0.5)" : "none",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                borderTop: hoveredArchive === s.id ? "2px solid var(--pink)" : "2px solid transparent",
                textAlign: "left",
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

        {/* Prominent CTA button */}
        <Link
          className="pink-button"
          href="/archives"
          style={{
            fontSize: 13,
            padding: "0 48px",
            minHeight: 56,
            boxShadow: "0 8px 32px rgba(179, 13, 13, 0.45)",
            fontWeight: 700,
            letterSpacing: "0.16em",
          }}
        >
          EXPLORE ALL STORIES <ArrowRight size={18} />
        </Link>
      </section>

      {/* ── HIGH-IMPACT BRAND CTA ────── */}
      <section
        style={{
          padding: "110px clamp(24px,8vw,120px)",
          background: "linear-gradient(135deg, #b30d0d 0%, #800707 55%, #4a0000 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.5)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Logo badge before headline */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              padding: "8px 20px",
              borderRadius: 40,
              marginBottom: 28,
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
            }}
          >
            <img src={MARK} alt="ZOID Logo" style={{ height: 20, width: "auto" }} />
            <span
              style={{
                fontFamily: "Anton",
                fontSize: 14,
                letterSpacing: "0.22em",
                color: "#fff",
                lineHeight: 1,
              }}
            >
              ZOID
            </span>
          </div>

          <h2
            style={{
              fontFamily: "Anton",
              fontSize: "clamp(48px, 8.5vw, 108px)",
              margin: "0 0 24px",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              textShadow: "0 4px 30px rgba(0,0,0,0.35)",
            }}
          >
            KEEP ON GOING
          </h2>

          <p
            style={{
              color: "rgba(255, 255, 255, 0.92)",
              maxWidth: 620,
              margin: "0 auto 40px",
              fontSize: "clamp(15px, 1.8vw, 18px)",
              lineHeight: 1.7,
            }}
          >
            Step into the complete ZOID edit. Rare retro cuts, national team grails, and high-performance gym gear — backed by our 2-week delivery promise from Lagos.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href="/collection"
              style={{
                background: "#090909",
                color: "#fff",
                fontSize: 12,
                padding: "0 44px",
                minHeight: 56,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                borderRadius: 2,
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#141414";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#090909";
                e.currentTarget.style.transform = "none";
              }}
            >
              EXPLORE SHOP EDIT <ArrowDownRight size={18} />
            </Link>
            <Link
              href="/archives"
              style={{
                fontSize: 12,
                padding: "0 38px",
                minHeight: 56,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.45)",
                background: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(8px)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 2,
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.transform = "none";
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
              Keep it going
              <br />
              Archive sportswear & community identity from Lagos
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
            Keep it going <b style={{ color: "var(--pink)" }}>•</b> Worn with intent
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
