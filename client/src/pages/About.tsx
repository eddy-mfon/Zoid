/* ZOID About Page — Brand Philosophy, Vision, Mission & Dossier */
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowDownRight, ArrowRight, ArrowUp, Compass, Globe, Target, Layers, ShieldCheck } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import Navbar from "@/components/Navbar";

const MARK = "/zoid-logo.svg";
const STORY_IMG = "/manus-storage/zoid-story_425b40db.jpg";

export default function About() {
  const { count } = useShop();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
      <Navbar
        scrolled={scrolled}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />

      {/* ── HERO BANNER ───────── */}
      <section style={{
        padding: "130px clamp(24px, 8vw, 120px) 70px",
        background: "linear-gradient(180deg, #141414 0%, #0b0b0b 100%)",
        borderBottom: "1px solid #1f1f1f",
        position: "relative"
      }}>
        <div style={{ maxWidth: 880 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 12px", background: "rgba(179, 13, 13,0.12)",
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
            KEEP IT <span style={{ color: "var(--pink)" }}>GOING</span>
          </h1>

          <p style={{
            color: "#b5b0a8", fontSize: "clamp(15px, 2vw, 18px)",
            lineHeight: 1.7, maxWidth: 640, margin: 0
          }}>
            ZOID is an archive-led sportswear house born in Lagos, Nigeria. We connect football nostalgia, African street perspective, and contemporary design into an enduring brand identity.
          </p>
        </div>
      </section>

      {/* ── STRATEGIC DIRECTION: VISION, MISSION, PRODUCT MISSION, CORE INTERNAL VALUES ────────── */}
      <section
        style={{ padding: "90px clamp(24px, 8vw, 120px)", background: "#0d0d0d", borderBottom: "1px solid #1a1a1a" }}
      >
        <div style={{ marginBottom: 48 }}>
          <p className="eyebrow" style={{ color: "var(--pink)" }}>STRATEGIC DIRECTION</p>
          <h2 style={{ fontFamily: "Anton", fontSize: "clamp(38px, 6vw, 76px)", margin: "8px 0 0", textTransform: "uppercase", color: "#fff" }}>
            PILLARS & DIRECTION
          </h2>
        </div>

        {/* 4 Pillars Grid: Vision, Mission, Product Mission, Core Internal Values */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
          {/* Vision Card */}
          <div
            style={{
              background: "#141414",
              border: "1px solid #222",
              padding: 40, borderRadius: 6, position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(179, 13, 13,0.15)", display: "grid", placeItems: "center", color: "var(--pink)" }}>
                <Globe size={20} />
              </div>
              <h3 style={{ fontFamily: "Anton", fontSize: 24, margin: 0, color: "#fff" }}>OUR VISION</h3>
            </div>

            <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.75, margin: "0 0 24px" }}>
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
          <div
            style={{
              background: "#141414",
              border: "1px solid #222",
              padding: 40, borderRadius: 6, position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(179, 13, 13,0.15)", display: "grid", placeItems: "center", color: "var(--pink)" }}>
                <Target size={20} />
              </div>
              <h3 style={{ fontFamily: "Anton", fontSize: 24, margin: 0, color: "#fff" }}>OUR MISSION</h3>
            </div>

            <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.75, margin: "0 0 24px" }}>
              To collect, curate, and distribute sportswear pieces with narrative honesty, material quality, and dependable fulfillment — honoring the grit of those who wear them.
            </p>

            <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "grid", gap: 12 }}>
              {[
                "Dependable delivery promise from our Lagos hub",
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

          {/* Product Mission Card */}
          <div
            style={{
              background: "#141414",
              border: "1px solid #222",
              padding: 40, borderRadius: 6, position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(179, 13, 13,0.15)", display: "grid", placeItems: "center", color: "var(--pink)" }}>
                <Layers size={20} />
              </div>
              <h3 style={{ fontFamily: "Anton", fontSize: 24, margin: 0, color: "#fff" }}>PRODUCT MISSION</h3>
            </div>

            <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.75, margin: "0 0 24px" }}>
              To engineer and curate sportswear that marries athletic performance with street heritage. Every thread, stitch, and fabric choice honors durability, breathability, and timeless silhouette.
            </p>

            <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "grid", gap: 12 }}>
              {[
                "High-performance materials crafted for endurance and comfort",
                "Authentic retro silhouettes and verified archive pieces",
                "Uncompromising quality inspection on every single release"
              ].map((item, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#aaa" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--pink)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Core Internal Values Card */}
          <div
            style={{
              background: "#141414",
              border: "1px solid #222",
              padding: 40, borderRadius: 6, position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(179, 13, 13,0.15)", display: "grid", placeItems: "center", color: "var(--pink)" }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontFamily: "Anton", fontSize: 24, margin: 0, color: "#fff" }}>CORE INTERNAL VALUES</h3>
            </div>

            <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.75, margin: "0 0 24px" }}>
              Our internal compass shapes how we create, operate, and engage our community. Rooted in grit, transparency, and relentlessly keeping it going.
            </p>

            <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "grid", gap: 12 }}>
              {[
                "Grit & Intent — Doing the hard work without shortcuts",
                "Material Honesty — Transparency in sourcing, quality, and design",
                "Community First — Uplifting athlete culture and shared stories"
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

      {/* ── CALL TO ACTION STRIP ────────────────────── */}
      <section style={{
        background: "var(--pink)", color: "#fff",
        padding: "80px clamp(24px, 8vw, 120px)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24
      }}>
        <div>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>READY TO EXPLORE THE EDIT?</p>
          <h2 style={{ fontFamily: "Anton", fontSize: "clamp(36px, 5vw, 68px)", color: "#fff", margin: 0, textTransform: "uppercase", lineHeight: 0.9 }}>
            WORN WITH INTENT
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
        <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, color: "#777", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span>© ZOID STUDIOS / 2026</span>
          <span>Lagos — Nigeria</span>
          <span>Hotline: <a href="tel:09020711737" style={{ color: "var(--pink)", textDecoration: "none", fontWeight: 700 }}>09020711737</a></span>
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
            boxShadow: "0 4px 20px rgba(179, 13, 13,0.4)",
            border: "none", cursor: "pointer"
          }}
        >
          <ArrowUp size={18} />
        </button>
      )}
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
            boxShadow: "0 4px 20px rgba(179, 13, 13,0.4)",
            border: "none", cursor: "pointer"
          }}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </main>
  );
}
