/* ZOID About Page — standalone brand story and community philosophy page */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowDownRight, ArrowUp, Menu, ShoppingBag, X } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";

const mark = "/zoid-logo.svg";
const storyImg = "/manus-storage/zoid-story_425b40db.jpg";

const pillars = [
  {
    num: "01",
    title: "CURATING BEFORE CREATING",
    body: "We don't make product for its own sake. Every piece in the ZOID edit has been chosen for what it carries — cultural weight, design integrity, and a story worth keeping.",
  },
  {
    num: "02",
    title: "FOOTBALL AS LANGUAGE",
    body: "The jersey is universal. In Lagos, in Abuja, in London — it's worn on match days and off them. It's a conversation, a flex, and a connection to something bigger.",
  },
  {
    num: "03",
    title: "THE HEIGHT IS YOURS",
    body: "Your environment is not your height. ZOID exists for the ones still rising — those who move with intention and refuse to let circumstance define the ceiling.",
  },
];

export default function About() {
  const { count } = useShop();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 44);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="zoid-shell collection-page" style={{ background: "#0b0b0b" }}>
      {/* Navbar */}
      <header className={scrolled ? "topbar topbar-scrolled" : "topbar"}>
        <Link className="brand" href="/">
          <img src={mark} alt="" />
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
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        minHeight: "60vh", background: "#111",
        display: "flex", alignItems: "center",
        padding: "120px clamp(24px, 8vw, 120px) 80px",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${storyImg})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
          <p className="eyebrow" style={{ color: "var(--pink)", marginBottom: 20 }}>LAGOS / CURATING BEFORE CREATING / 2026</p>
          <h1 style={{ fontFamily: "Anton", fontSize: "clamp(52px, 9vw, 110px)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 28px", color: "#fff" }}>
            BUILT ON GRIT.<br /><span style={{ color: "var(--pink)" }}>WORN</span> WITH INTENT.
          </h1>
          <p style={{ color: "#b0aba4", fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: "0 0 36px" }}>
            ZOID is an archive-led sports brand from Lagos, Nigeria. We are not just selling jerseys — we are preserving football culture, celebrating the streets that shaped us, and building a community for the ones who keep rising.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="pink-button" href="/collection">
              Explore the Edit <ArrowDownRight size={17} />
            </Link>
            <Link className="ghost-button" href="/archives">
              Community Archives
            </Link>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section style={{ padding: "100px clamp(24px, 8vw, 120px)", background: "#0d0d0d" }}>
        <p className="eyebrow" style={{ color: "var(--pink)", marginBottom: 16 }}>OUR PHILOSOPHY</p>
        <h2 style={{ fontFamily: "Anton", fontSize: "clamp(40px, 6vw, 80px)", margin: "0 0 64px", textTransform: "uppercase", color: "#fff" }}>
          WHY ZOID EXISTS.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
          {pillars.map((p) => (
            <div key={p.num} style={{ borderTop: "2px solid var(--pink)", paddingTop: 28 }}>
              <span style={{ fontFamily: "Anton", fontSize: 48, color: "rgba(231,25,75,0.2)", lineHeight: 1, display: "block", marginBottom: 16 }}>{p.num}</span>
              <h3 style={{ fontFamily: "Anton", fontSize: 22, color: "#fff", margin: "0 0 14px", textTransform: "uppercase" }}>{p.title}</h3>
              <p style={{ color: "#888", lineHeight: 1.7, fontSize: 14, margin: 0 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community Story */}
      <section style={{
        background: "var(--bone)", color: "#111",
        padding: "100px clamp(24px, 8vw, 120px)",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center"
      }}>
        <div>
          <p className="eyebrow" style={{ color: "#777", marginBottom: 16 }}>THE COMMUNITY</p>
          <h2 style={{ fontFamily: "Anton", fontSize: "clamp(40px, 5vw, 72px)", margin: "0 0 28px", lineHeight: 0.9, textTransform: "uppercase" }}>
            FROM LAGOS.<br />TO THE WORLD.
          </h2>
          <p style={{ color: "#555", lineHeight: 1.75, fontSize: 14, marginBottom: 28 }}>
            Our community spans Lagos streets, London estates, and wherever football is more than a game. The jersey is the bridge. ZOID is the thread that ties the shared journey together — from first kick to a career, from a local pitch to an international stage.
          </p>
          <Link className="pink-button" href="/archives">
            Read Community Stories <ArrowDownRight size={17} />
          </Link>
        </div>
        <div style={{ position: "relative" }}>
          <img src={storyImg} alt="ZOID community" style={{ width: "100%", height: 480, objectFit: "cover", filter: "grayscale(0.2)" }} />
        </div>
      </section>

      {/* CTA strip */}
      <section style={{
        background: "var(--pink)", padding: "80px clamp(24px, 8vw, 120px)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24
      }}>
        <div>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>READY TO EXPLORE?</p>
          <h2 style={{ fontFamily: "Anton", fontSize: "clamp(36px, 5vw, 64px)", color: "#fff", margin: 0, textTransform: "uppercase" }}>
            FIND YOUR KIT.
          </h2>
        </div>
        <Link href="/collection" style={{
          background: "#fff", color: "var(--pink)",
          padding: "14px 28px", fontWeight: 700, fontSize: 12,
          letterSpacing: "0.15em", textTransform: "uppercase",
          display: "inline-flex", alignItems: "center", gap: 10
        }}>
          Shop Collection <ArrowDownRight size={17} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: "#090909", padding: "48px clamp(24px, 8vw, 120px) 24px", borderTop: "1px solid #1f1f1f" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
          <Link className="brand" href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 700, letterSpacing: "0.22em" }}>
            <img src={mark} alt="" style={{ height: 16 }} />ZOID
          </Link>
          <div style={{ display: "flex", gap: 32, fontSize: 12, color: "#aaa" }}>
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

      {/* Scroll-to-top FAB */}
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
