/* ZOID About Page — Brand Philosophy, Vision, Mission & Dossier */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowDownRight, ArrowRight, ArrowUp, Compass, Globe, Shield, Sparkles, Target, Zap, Menu, X } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";

const MARK = "/zoid-logo.svg";
const STORY_IMG = "/manus-storage/zoid-story_425b40db.jpg";
const MILAN_IMG = "/manus-storage/ac-milan-2526_b917ea29.jpg";

const pillars = [
  {
    num: "01",
    title: "CURATING BEFORE CREATING",
    body: "We don't produce for the sake of volume. Every kit in the ZOID edit is selected for its narrative weight, graphic discipline, and material longevity.",
  },
  {
    num: "02",
    title: "FOOTBALL AS UNIVERSAL LANGUAGE",
    body: "The jersey is a badge of identity. From Surulere to San Siro, from local turf to city streets, football sportswear carries stories that connect generations.",
  },
  {
    num: "03",
    title: "THE HEIGHT IS YOURS",
    body: "Your environment is not your limit. ZOID exists for the ones still rising — those who move with intention, persistence, and unyielding conviction.",
  },
  {
    num: "04",
    title: "COMMUNITY-FIRST ARCHIVE",
    body: "We collect memories alongside sportswear. Every submission to the ZOID Archives preserves match-day culture and African street perspective.",
  },
];

const brandDossier = [
  { label: "FOUNDED / ORIGIN", val: "Lagos, Nigeria (2026)" },
  { label: "BRAND CORE", val: "Archive Sportswear & Community Memories" },
  { label: "DELIVERY GUARANTEE", val: "2-Week Global Delivery from Lagos Hub" },
  { label: "CURATION STANDARD", val: "Authentication, Scarcity & Material Inspection" },
  { label: "CURATED CATAGORIES", val: "Curated Retro, Special Kits, Gym Activewear" },
];

export default function About() {
  const { count } = useShop();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState<"vision" | "mission">("vision");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="zoid-shell collection-page" style={{ background: "#0b0b0b", color: "#f4f0ea" }}>
      {/* ── NAVBAR ──────────────────────────────────── */}
      <header className={scrolled ? "topbar topbar-scrolled" : "topbar"}>
        <Link className="brand" href="/">
          <img src={MARK} alt="ZOID" />
          <span>ZOID</span>
          <i />
        </Link>
        <div className="nav-frame">
          <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
            <Link href="/" onClick={() => setMobileMenu(false)}>Home</Link>
            <Link href="/collection" onClick={() => setMobileMenu(false)}>Shop</Link>
            <Link className="active" href="/about" onClick={() => setMobileMenu(false)}>About</Link>
            <Link href="/archives" onClick={() => setMobileMenu(false)}>Archives</Link>
          </nav>
        </div>
        <div className="top-actions action-rail">
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── HERO BANNER (EDITORIAL WIREFRAME) ───────── */}
      <section style={{
        padding: "130px clamp(24px, 8vw, 120px) 70px",
        background: "linear-gradient(180deg, #141414 0%, #0b0b0b 100%)",
        borderBottom: "1px solid #1f1f1f",
        position: "relative"
      }}>
        <div style={{ maxWidth: 880 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 12px", background: "rgba(231,25,75,0.12)",
            border: "1px solid var(--pink)", borderRadius: 3,
            color: "var(--pink)", fontSize: 9, letterSpacing: "0.2em", fontWeight: 700,
            marginBottom: 24, textTransform: "uppercase"
          }}>
            <Compass size={13} /> BRAND MANIFESTO & PHILOSOPHY
          </div>

          <h1 style={{
            fontFamily: "Anton", fontSize: "clamp(54px, 9vw, 112px)",
            lineHeight: 0.88, textTransform: "uppercase", margin: "0 0 28px", color: "#fff"
          }}>
            CURATING<br />BEFORE <span style={{ color: "var(--pink)" }}>CREATING.</span>
          </h1>

          <p style={{
            color: "#b5b0a8", fontSize: "clamp(15px, 2vw, 18px)",
            lineHeight: 1.7, maxWidth: 640, margin: "0 0 40px"
          }}>
            ZOID is an archive-led sportswear house born in Lagos, Nigeria. We connect football nostalgia, African street perspective, and contemporary design into an enduring brand identity.
          </p>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 20, paddingTop: 28, borderTop: "1px solid #222"
          }}>
            <div>
              <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.18em", display: "block", marginBottom: 4 }}>ORIGIN</span>
              <strong style={{ fontSize: 14, color: "#fff", display: "block" }}>Lagos, Nigeria</strong>
            </div>
            <div>
              <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.18em", display: "block", marginBottom: 4 }}>ESTABLISHED</span>
              <strong style={{ fontSize: 14, color: "#fff", display: "block" }}>2026 Edition</strong>
            </div>
            <div>
              <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.18em", display: "block", marginBottom: 4 }}>PURPOSE</span>
              <strong style={{ fontSize: 14, color: "#fff", display: "block" }}>Football & Street grails</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION DUAL WIREFRAME ────────── */}
      <section style={{ padding: "90px clamp(24px, 8vw, 120px)", background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--pink)" }}>STRATEGIC DIRECTION</p>
            <h2 style={{ fontFamily: "Anton", fontSize: "clamp(38px, 6vw, 76px)", margin: "8px 0 0", textTransform: "uppercase", color: "#fff" }}>
              OUR VISION & MISSION.
            </h2>
          </div>
          {/* Toggle pill */}
          <div style={{ display: "flex", background: "#181818", padding: 4, borderRadius: 4, border: "1px solid #282828" }}>
            <button
              onClick={() => setActiveTab("vision")}
              style={{
                padding: "8px 20px", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
                fontWeight: 700, borderRadius: 3,
                background: activeTab === "vision" ? "var(--pink)" : "transparent",
                color: activeTab === "vision" ? "#fff" : "#888",
                transition: "all 0.2s ease",
              }}
            >
              VISION
            </button>
            <button
              onClick={() => setActiveTab("mission")}
              style={{
                padding: "8px 20px", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
                fontWeight: 700, borderRadius: 3,
                background: activeTab === "mission" ? "var(--pink)" : "transparent",
                color: activeTab === "mission" ? "#fff" : "#888",
                transition: "all 0.2s ease",
              }}
            >
              MISSION
            </button>
          </div>
        </div>

        {/* Dual Wireframe Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
          {/* Vision Card */}
          <div style={{
            background: activeTab === "vision" ? "#161616" : "#121212",
            border: activeTab === "vision" ? "1px solid var(--pink)" : "1px solid #222",
            padding: 40, borderRadius: 6, position: "relative", overflow: "hidden",
            transition: "all 0.3s ease",
            boxShadow: activeTab === "vision" ? "0 12px 35px rgba(231,25,75,0.15)" : "none"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(231,25,75,0.15)", display: "grid", placeItems: "center", color: "var(--pink)" }}>
                <Globe size={20} />
              </div>
              <div>
                <span style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--pink)", display: "block" }}>THE HORIZON</span>
                <h3 style={{ fontFamily: "Anton", fontSize: 24, margin: 0, color: "#fff" }}>OUR VISION</h3>
              </div>
            </div>

            <p style={{ color: "#ccc", fontSize: 15, lineHeight: 1.75, margin: "0 0 24px" }}>
              To establish ZOID as the global benchmark for African sportswear identity — proving that football nostalgia, street culture, and archive curation from Lagos can inspire communities worldwide.
            </p>

            <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "grid", gap: 12 }}>
              {[
                "Pioneer Lagos-led archive curation internationally",
                "Bridge match-day nostalgia with everyday street wear",
                "Empower African creative perspective in global sportswear"
              ].map((item, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#aaa" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--pink)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Mission Card */}
          <div style={{
            background: activeTab === "mission" ? "#161616" : "#121212",
            border: activeTab === "mission" ? "1px solid var(--pink)" : "1px solid #222",
            padding: 40, borderRadius: 6, position: "relative", overflow: "hidden",
            transition: "all 0.3s ease",
            boxShadow: activeTab === "mission" ? "0 12px 35px rgba(231,25,75,0.15)" : "none"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(231,25,75,0.15)", display: "grid", placeItems: "center", color: "var(--pink)" }}>
                <Target size={20} />
              </div>
              <div>
                <span style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--pink)", display: "block" }}>THE PLEDGE</span>
                <h3 style={{ fontFamily: "Anton", fontSize: 24, margin: 0, color: "#fff" }}>OUR MISSION</h3>
              </div>
            </div>

            <p style={{ color: "#ccc", fontSize: 15, lineHeight: 1.75, margin: "0 0 24px" }}>
              To collect, curate, and distribute sportswear pieces with narrative honesty, material quality, and dependable fulfillment — honoring the grit of those who wear them.
            </p>

            <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "grid", gap: 12 }}>
              {[
                "Strict 2-week delivery promise from our Lagos hub",
                "Authentic curation of retro grails and special gym sets",
                "Building a living digital community archive of fan stories"
              ].map((item, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#aaa" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--pink)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 4 PHILOSOPHY PILLARS GRID ───────────────── */}
      <section style={{ padding: "90px clamp(24px, 8vw, 120px)", background: "#111" }}>
        <p className="eyebrow" style={{ color: "var(--pink)", marginBottom: 16 }}>BRAND PILLARS</p>
        <h2 style={{ fontFamily: "Anton", fontSize: "clamp(38px, 6vw, 76px)", margin: "0 0 56px", textTransform: "uppercase", color: "#fff" }}>
          BUILT ON GRIT.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {pillars.map((p) => (
            <div key={p.num} style={{ background: "#161616", border: "1px solid #242424", padding: 32, borderRadius: 4, position: "relative" }}>
              <span style={{ fontFamily: "Anton", fontSize: 44, color: "rgba(231,25,75,0.22)", lineHeight: 1, display: "block", marginBottom: 14 }}>{p.num}</span>
              <h3 style={{ fontFamily: "Anton", fontSize: 20, color: "#fff", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{p.title}</h3>
              <p style={{ color: "#888", lineHeight: 1.65, fontSize: 13, margin: 0 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECHNICAL BRAND DOSSIER ─────────────────── */}
      <section style={{ padding: "90px clamp(24px, 8vw, 120px)", background: "#0b0b0b", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--pink)" }}>AUTHENTICITY & SPECIFICATIONS</p>
            <h2 style={{ fontFamily: "Anton", fontSize: "clamp(36px, 5vw, 68px)", margin: "12px 0 24px", lineHeight: 0.9, textTransform: "uppercase", color: "#fff" }}>
              ZOID TECHNICAL<br /><span style={{ color: "var(--pink)" }}>DOSSIER.</span>
            </h2>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
              Every product in our storefront is verified for material feel, color accuracy, and fit integrity. We believe in transparency — from our Lagos studio directly to your doorstep.
            </p>

            {/* Specification Table */}
            <div style={{ display: "grid", gap: 0, border: "1px solid #222", borderRadius: 4 }}>
              {brandDossier.map((item, idx) => (
                <div key={item.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 20px", background: idx % 2 === 0 ? "#141414" : "#111",
                  borderBottom: idx < brandDossier.length - 1 ? "1px solid #222" : "none"
                }}>
                  <span style={{ fontSize: 9, color: "#777", letterSpacing: "0.14em", textTransform: "uppercase" }}>{item.label}</span>
                  <strong style={{ fontSize: 12, color: "#fff", textTransform: "uppercase" }}>{item.val}</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <img src={STORY_IMG} alt="ZOID Dossier" style={{ width: "100%", height: 500, objectFit: "cover", borderRadius: 4, filter: "brightness(0.9)" }} />
            <div style={{
              position: "absolute", bottom: 24, left: 24,
              background: "rgba(10,10,10,0.9)", border: "1px solid var(--pink)",
              padding: "16px 20px", color: "#fff", borderRadius: 4
            }}>
              <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.18em", display: "block", marginBottom: 4 }}>BRAND PROMISE</span>
              <strong style={{ fontSize: 13, display: "block" }}>100% Curation & 2-Week Delivery</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION STRIP ────────────────────── */}
      <section style={{
        background: "var(--pink)", color: "#fff",
        padding: "80px clamp(24px, 8vw, 120px)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24
      }}>
        <div>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>READY TO EXPLORE THE EDIT?</p>
          <h2 style={{ fontFamily: "Anton", fontSize: "clamp(36px, 5vw, 68px)", color: "#fff", margin: 0, textTransform: "uppercase", lineHeight: 0.9 }}>
            WORN WITH INTENT.
          </h2>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/collection" style={{
            background: "#fff", color: "var(--pink)",
            padding: "16px 32px", fontWeight: 700, fontSize: 11,
            letterSpacing: "0.15em", textTransform: "uppercase",
            display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 3
          }}>
            Shop Collection <ArrowDownRight size={17} />
          </Link>
          <Link href="/archives" style={{
            background: "transparent", color: "#fff", border: "1px solid #fff",
            padding: "16px 32px", fontWeight: 700, fontSize: 11,
            letterSpacing: "0.15em", textTransform: "uppercase",
            display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 3
          }}>
            ZOID Archives <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer style={{ background: "#090909", padding: "54px clamp(24px, 8vw, 120px) 24px", borderTop: "1px solid #1f1f1f" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
          <Link className="brand" href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 700, letterSpacing: "0.22em" }}>
            <img src={MARK} alt="" style={{ height: 16 }} />ZOID
          </Link>
          <div style={{ display: "flex", gap: 32, fontSize: 12, color: "#aaa" }}>
            <Link href="/">Home</Link>
            <Link href="/collection">Shop</Link>
            <Link href="/archives">Archives</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, color: "#555", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span>© ZOID STUDIOS / 2026</span>
          <span>Lagos — Nigeria</span>
          <span>Built on grit • Worn with intent</span>
        </div>
      </footer>

      {/* ── SCROLL-TO-TOP FAB ───────────────────────── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 50,
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--pink)", color: "#fff",
            display: "grid", placeItems: "center",
            boxShadow: "0 4px 20px rgba(231,25,75,0.4)",
            border: "none", cursor: "pointer"
          }}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </main>
  );
}
