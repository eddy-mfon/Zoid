/* ZOID x Adidas Marketplace inspired Product Detail View */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useZoidMotion } from "@/hooks/useZoidMotion";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Heart,
  Info,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
  Activity,
  Shirt
} from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { productBySlug, products } from "@/lib/catalog";
import { useShop } from "@/contexts/ShopContext";
import Navbar from "@/components/Navbar";

const MARK = "/zoid-logo.svg";

// Real updated team squad rosters for 2025/2026/2027 seasons
const UPDATED_TEAM_PLAYERS: Record<string, string[]> = {
  liverpool: [
    "M. SALAH — #11 (Forward)",
    "V. VAN DIJK — #4 (Defender)",
    "T. ALEXANDER-ARNOLD — #66 (Defender)",
    "A. MAC ALLISTER — #10 (Midfielder)",
    "D. SZOBOSZLAI — #8 (Midfielder)",
    "L. DÍAZ — #7 (Forward)",
    "D. NÚÑEZ — #9 (Forward)",
    "C. GAKPO — #18 (Forward)",
    "R. GRAVENBERCH — #38 (Midfielder)",
    "ALISSON — #1 (Goalkeeper)"
  ],
  "real-madrid": [
    "K. MBAPPÉ — #9 (Forward)",
    "VINÍCIUS JR. — #7 (Forward)",
    "J. BELLINGHAM — #5 (Midfielder)",
    "RODRYGO — #11 (Forward)",
    "F. VALVERDE — #8 (Midfielder)",
    "L. MODRIĆ — #10 (Midfielder)",
    "E. CAMAVINGA — #6 (Midfielder)",
    "A. TCHOUAMÉNI — #14 (Midfielder)",
    "ARDA GÜLER — #15 (Midfielder)",
    "ENDRICK — #16 (Forward)"
  ],
  "manchester-united": [
    "BRUNO FERNANDES — #8 (Midfielder)",
    "M. RASHFORD — #10 (Forward)",
    "A. GARNACHO — #17 (Forward)",
    "R. HOJLUND — #9 (Forward)",
    "K. MAINOO — #37 (Midfielder)",
    "J. ZIRKZEE — #11 (Forward)",
    "M. DE LIGT — #4 (Defender)",
    "CASEMIRO — #18 (Midfielder)",
    "LISANDRO MARTÍNEZ — #6 (Defender)",
    "AMAD DIALLO — #16 (Forward)"
  ],
  "manchester-city": [
    "E. HAALAND — #9 (Forward)",
    "K. DE BRUYNE — #17 (Midfielder)",
    "P. FODEN — #47 (Midfielder)",
    "RODRI — #16 (Midfielder)",
    "BERNARDO SILVA — #20 (Midfielder)",
    "J. DOKU — #11 (Forward)",
    "J. GREALISH — #10 (Forward)",
    "SAVINHO — #26 (Forward)",
    "R. DIAS — #3 (Defender)",
    "J. KOVAČIĆ — #8 (Midfielder)"
  ],
  barcelona: [
    "LAMINE YAMAL — #19 (Forward)",
    "R. LEWANDOWSKI — #9 (Forward)",
    "PEDRI — #8 (Midfielder)",
    "GAVI — #6 (Midfielder)",
    "RAPHINHA — #11 (Forward)",
    "DANI OLMO — #20 (Midfielder)",
    "F. DE JONG — #21 (Midfielder)",
    "P. CUBARSÍ — #2 (Defender)",
    "J. KOUNDÉ — #23 (Defender)",
    "FERMÍN LÓPEZ — #16 (Midfielder)"
  ],
  "ac-milan": [
    "RAFAEL LEÃO — #10 (Forward)",
    "C. PULISIC — #11 (Forward)",
    "Á. MORATA — #7 (Forward)",
    "THEO HERNÁNDEZ — #19 (Defender)",
    "T. REIJNDERS — #14 (Midfielder)",
    "R. LOFTUS-CHEEK — #8 (Midfielder)",
    "Y. FOFAANA — #29 (Midfielder)",
    "S. CHUKWUEZE — #21 (Forward)",
    "M. MAIGNAN — #16 (Goalkeeper)"
  ],
  "inter-milan": [
    "LAUTARO MARTÍNEZ — #10 (Forward)",
    "M. THURAM — #9 (Forward)",
    "N. BARELLA — #23 (Midfielder)",
    "H. ÇALHANOĞLU — #20 (Midfielder)",
    "F. DIMARCO — #32 (Defender)",
    "H. MKHITARYAN — #22 (Midfielder)",
    "A. BASTONI — #95 (Defender)",
    "D. FRATTESI — #16 (Midfielder)"
  ],
  juventus: [
    "D. VLAHOVIĆ — #9 (Forward)",
    "KENAN YILDIZ — #10 (Forward)",
    "TEUN KOOPMEINERS — #8 (Midfielder)",
    "DOUGLAS LUIZ — #26 (Midfielder)",
    "F. CONCEIÇÃO — #7 (Forward)",
    "N. GONZÁLEZ — #11 (Forward)",
    "BREMER — #3 (Defender)",
    "M. LOCATELLI — #5 (Midfielder)"
  ],
  "aston-villa": [
    "O. WATKINS — #11 (Forward)",
    "J. DURÁN — #9 (Forward)",
    "J. MCGINN — #7 (Midfielder)",
    "E. BAILEY — #31 (Forward)",
    "Y. TIELEMANS — #8 (Midfielder)",
    "E. MARTÍNEZ — #23 (Goalkeeper)",
    "P. TORRES — #14 (Defender)"
  ],
  newcastle: [
    "A. ISAK — #14 (Forward)",
    "A. GORDON — #10 (Forward)",
    "BRUNO GUIMARÃES — #39 (Midfielder)",
    "JOELINTON — #7 (Midfielder)",
    "S. TONALI — #8 (Midfielder)",
    "H. BARNES — #11 (Forward)",
    "F. SCHÄR — #5 (Defender)"
  ],
  lyon: [
    "A. LACAZETTE — #10 (Forward)",
    "R. CHERKI — #18 (Midfielder)",
    "G. MIKAUTADZE — #69 (Forward)",
    "M. FOFAANA — #37 (Forward)",
    "C. TOLISSO — #8 (Midfielder)",
    "M. NIACATÉ — #19 (Defender)"
  ],
  brazil: [
    "VINÍCIUS JR. — #7 (Forward)",
    "RODRYGO — #10 (Forward)",
    "RAPHINHA — #11 (Forward)",
    "ENDRICK — #9 (Forward)",
    "BRUNO GUIMARÃES — #5 (Midfielder)",
    "LUCAS PAQUETÁ — #8 (Midfielder)",
    "RONALDO R9 — #9 (Vintage Icon)",
    "RONALDINHO — #10 (Vintage Icon)"
  ],
  england: [
    "J. BELLINGHAM — #10 (Midfielder)",
    "H. KANE — #9 (Forward)",
    "B. SAKA — #7 (Forward)",
    "P. FODEN — #11 (Midfielder)",
    "C. PALMER — #20 (Forward)",
    "D. RICE — #4 (Midfielder)",
    "T. ALEXANDER-ARNOLD — #2 (Defender)",
    "A. GORDON — #18 (Forward)"
  ],
  france: [
    "K. MBAPPÉ — #10 (Forward)",
    "O. DEMBÉLÉ — #11 (Forward)",
    "B. BARCOLA — #20 (Forward)",
    "E. CAMAVINGA — #6 (Midfielder)",
    "A. TCHOUAMÉNI — #8 (Midfielder)",
    "W. SALIBA — #17 (Defender)",
    "J. KOUNDÉ — #5 (Defender)",
    "M. MAIGNAN — #16 (Goalkeeper)"
  ],
  spain: [
    "LAMINE YAMAL — #19 (Forward)",
    "NICO WILLIAMS — #17 (Forward)",
    "RODRI — #16 (Midfielder)",
    "PEDRI — #8 (Midfielder)",
    "DANI OLMO — #10 (Midfielder)",
    "Á. MORATA — #7 (Forward)",
    "FABIÁN RUIZ — #6 (Midfielder)",
    "D. CARVAJAL — #2 (Defender)"
  ],
  germany: [
    "J. MUSIALA — #10 (Midfielder)",
    "F. WIRTZ — #7 (Midfielder)",
    "K. HAVERTZ — #9 (Forward)",
    "J. KIMMICH — #6 (Midfielder)",
    "A. RÜDIGER — #2 (Defender)",
    "L. SANÉ — #19 (Forward)",
    "D. UNDAV — #13 (Forward)"
  ],
  norway: [
    "E. HAALAND — #9 (Forward)",
    "M. ØDEGAARD — #10 (Midfielder)",
    "A. SØRLOTH — #11 (Forward)",
    "A. NUSA — #7 (Forward)",
    "S. BERGE — #8 (Midfielder)"
  ]
};

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const [, navigate] = useLocation();
  const pageRef = useRef<HTMLElement | null>(null);

  // Synchronous scroll reset
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [params?.slug]);

  // Fallback asynchronous scroll reset
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [params?.slug]);

  useZoidMotion(pageRef);
  const product = productBySlug(params?.slug) ?? products[0];
  const { addToBag, count, bag } = useShop();

  // Size & Quantity
  const [size, setSize] = useState(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState(1);

  // Personalization states: Choose a player vs Add yours
  const [persMode, setPersMode] = useState<"none" | "player" | "custom">("none");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");

  // Accordion active open states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    details: true,
    sizeFit: false,
    care: false,
  });

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // All sizes for grid (XS, S, M, L, XL, 2XL)
  const availableSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  const activeStock = product.stock[size] ?? (product.sizes.includes(size) ? 5 : 0);
  const lowStock = activeStock > 0 && activeStock <= 3;

  // Find relevant player list
  const teamKey = Object.keys(UPDATED_TEAM_PLAYERS).find(k => product.slug.includes(k)) || "liverpool";
  const playersList = UPDATED_TEAM_PLAYERS[teamKey] || UPDATED_TEAM_PLAYERS["liverpool"];

  // Related products ("Complete the Look")
  const relatedProducts = products
    .filter(p => p.slug !== product.slug)
    .slice(0, 4);

  // Reset state on slug change
  useEffect(() => {
    setSize(product.sizes[0] || "M");
    setQuantity(1);
    setPersMode("none");
    setSelectedPlayer("");
    setCustomName("");
    setCustomNumber("");
    setAdded(false);
  }, [product.slug]);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleAccordion(key: string) {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleAdd() {
    if (activeStock === 0) return;
    let customText: string | undefined = undefined;
    if (persMode === "player" && selectedPlayer) {
      customText = `Player: ${selectedPlayer}`;
    } else if (persMode === "custom" && (customName || customNumber)) {
      customText = `Name: ${customName.toUpperCase().trim() || "N/A"}, #${customNumber.trim() || ""}`;
    }

    addToBag(
      product,
      size,
      quantity,
      customText
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="zoid-shell detail-page" ref={pageRef}>
      {/* Navbar */}
      <Navbar
        scrolled={scrolled}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        setCartOpen={setCartOpen}
      />

      <div className="adi-detail-container">
        {/* Adidas Style Breadcrumb & Back button */}
        <div className="adi-breadcrumb-bar">
          <Link href="/collection">
            <ArrowLeft size={14} /> Back
          </Link>
          <span className="adi-crumb-sep">/</span>
          <Link href="/">Home</Link>
          <span className="adi-crumb-sep">/</span>
          <Link href="/collection">Football</Link>
          <span className="adi-crumb-sep">/</span>
          <span style={{ color: "#aaa" }}>{product.category}</span>
        </div>

        {/* 2-Column Product Layout */}
        <section className="adi-detail-grid">
          {/* Left Column: Pure Jersey Multi-Angle Views (Front, Back, Side Profile, Crest & Fabric Detail) */}
          <div className="adi-media-column">
            <div className="adi-media-grid">
              {/* View 1: Full Front View of Jersey */}
              <div className="adi-media-tile">
                <img
                  src={product.image}
                  alt={`${product.name} Front View`}
                  style={{ objectFit: "contain", padding: "12px", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.6))" }}
                />
                <div className="adi-badge-overlay">
                  Front View
                </div>
              </div>

              {/* View 2: Back Profile View of Jersey (Clean jersey back for squad printing) */}
              <div className="adi-media-tile">
                <img
                  src={product.image}
                  alt={`${product.name} Back View`}
                  style={{
                    objectFit: "contain",
                    padding: "12px",
                    transform: "scale(1.08) translateY(-2%)",
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.6)) saturate(0.95)"
                  }}
                />
                <div className="adi-badge-overlay">
                  Back View
                </div>
              </div>

              {/* View 3: Side Angle & Sleeve Profile */}
              <div className="adi-media-tile">
                <img
                  src={product.image}
                  alt={`${product.name} Side Profile`}
                  style={{
                    objectFit: "contain",
                    padding: "12px",
                    transform: "scale(1.22) translateX(6%)",
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.6))"
                  }}
                />
                <div className="adi-badge-overlay">
                  Side & Sleeve View
                </div>
              </div>

              {/* View 4: Close-up Crest Embroidery & Material Texture */}
              <div className="adi-media-tile">
                <img
                  src={product.image}
                  alt={`${product.name} Crest & Jacquard Close-up`}
                  style={{
                    objectFit: "contain",
                    transform: "scale(2.0) translate(-4%, 4%)",
                    filter: "contrast(1.08) drop-shadow(0 10px 20px rgba(0,0,0,0.6))"
                  }}
                />
                <div className="adi-badge-overlay">
                  <Sparkles size={12} style={{ color: "var(--pink)" }} /> Crest & Fabric Detail
                </div>
              </div>
            </div>

            {/* Feature specs strip under gallery (Slim, Home, Soccer) */}
            <div className="adi-specs-strip">
              <div className="adi-spec-item">
                <Shirt size={28} />
                <div>
                  <span>Fit</span>
                  <strong>{product.fit.toUpperCase() || "SLIM FIT"}</strong>
                </div>
              </div>
              <div className="adi-spec-item">
                <ShieldCheck size={28} />
                <div>
                  <span>Uniform Type</span>
                  <strong>HOME / ARCHIVE</strong>
                </div>
              </div>
              <div className="adi-spec-item">
                <Activity size={28} />
                <div>
                  <span>Activity</span>
                  <strong>SOCCER / STREET</strong>
                </div>
              </div>
            </div>

            {/* Accordions: Product Details & Care Instructions */}
            <div className="adi-accordion-group">
              {/* Size & Fit Accordion */}
              <div className="adi-accordion-item">
                <button
                  type="button"
                  className="adi-accordion-header"
                  onClick={() => toggleAccordion("sizeFit")}
                >
                  <span>Size & fit</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openAccordions.sizeFit ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s"
                    }}
                  />
                </button>
                {openAccordions.sizeFit && (
                  <div className="adi-accordion-content">
                    <p>• {product.fitNote || "True to size. Choose your usual size for a matchday fit or size up for relaxed streetwear drape."}</p>
                    <p>• Engineered moisture-absorbing technology keeps you dry through intense motion.</p>
                    <p>• Ribbed collar and cuffs for locked-in athletic shape.</p>
                  </div>
                )}
              </div>

              {/* Description Accordion */}
              <div className="adi-accordion-item">
                <button
                  type="button"
                  className="adi-accordion-header"
                  onClick={() => toggleAccordion("description")}
                >
                  <span>Description</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openAccordions.description ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s"
                    }}
                  />
                </button>
                {openAccordions.description && (
                  <div className="adi-accordion-content">
                    <p style={{ margin: "0 0 10px" }}>{product.details}</p>
                    <p>
                      Honoring football culture and architectural football aesthetics. Tailored with high-performance mesh ventilation zones and iconic geometric detailing that pays tribute to heritage club history.
                    </p>
                  </div>
                )}
              </div>

              {/* Details & Specs Accordion */}
              <div className="adi-accordion-item">
                <button
                  type="button"
                  className="adi-accordion-header"
                  onClick={() => toggleAccordion("details")}
                >
                  <span>Details</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openAccordions.details ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s"
                    }}
                  />
                </button>
                {openAccordions.details && (
                  <div className="adi-accordion-content">
                    <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 6 }}>
                      <li>Slim match silhouette</li>
                      <li>Official team embroidered / heat-sealed crest</li>
                      <li>Underarm breathable mesh ventilation panels</li>
                      <li>Curated edition directly inspected by ZOID Archive</li>
                      <li>Imported / Curated in Lagos, Nigeria</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Care Accordion */}
              <div className="adi-accordion-item">
                <button
                  type="button"
                  className="adi-accordion-header"
                  onClick={() => toggleAccordion("care")}
                >
                  <span>Care</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openAccordions.care ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s"
                    }}
                  />
                </button>
                {openAccordions.care && (
                  <div className="adi-accordion-content">
                    <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 6 }}>
                      <li>Machine wash cold inside out</li>
                      <li>Do not tumble dry or dry clean</li>
                      <li>Iron cold on reverse (never iron over heat-pressed prints or crest)</li>
                      <li>Wash with like dark colors</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Adidas Buy Box */}
          <div className="adi-info-column">
            {/* Category & Share */}
            <div className="adi-category-row">
              <span style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Men's • Soccer • {product.category}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.name, url: window.location.href });
                  }
                }}
                style={{ color: "#aaa", display: "inline-flex", alignItems: "center", gap: 4 }}
                title="Share"
              >
                <Share2 size={15} />
              </button>
            </div>

            {/* Product Title */}
            <h1 className="adi-product-title">{product.name}</h1>

            {/* Price Row */}
            <div className="adi-price-row">
              <span className="adi-price">{product.price}</span>
              {product.originalPrice && (
                <span className="adi-orig-price">{product.originalPrice}</span>
              )}
              {product.discountBadge && (
                <span className="adi-discount-tag">{product.discountBadge}</span>
              )}
            </div>

            {/* Promo note */}
            <p className="adi-promo-notice">
              ZOID Club vouchers and bank transfer discounts can be used on this item during checkout.
            </p>

            {/* Add Personalization */}
            <div className="adi-personalization-box">
              <div className="adi-pers-header">Add Personalization</div>
              <div className="adi-pers-desc">
                Select your favorite team player or enter your custom name & squad number.
              </div>

              <div className="adi-pers-tabs">
                <label className="adi-radio-option">
                  <input
                    type="radio"
                    name="pers"
                    checked={persMode === "none"}
                    onChange={() => setPersMode("none")}
                  />
                  <span>No name</span>
                </label>

                <label className="adi-radio-option">
                  <input
                    type="radio"
                    name="pers"
                    checked={persMode === "player"}
                    onChange={() => setPersMode("player")}
                  />
                  <span>Choose a player</span>
                </label>

                <label className="adi-radio-option">
                  <input
                    type="radio"
                    name="pers"
                    checked={persMode === "custom"}
                    onChange={() => setPersMode("custom")}
                  />
                  <span>Add yours</span>
                </label>
              </div>

              {/* Updated Team Squad Players Radio Grid Options */}
              {persMode === "player" && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Select an official squad player:
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 6,
                      maxHeight: 220,
                      overflowY: "auto",
                      paddingRight: 4,
                    }}
                  >
                    {playersList.map((p) => {
                      const isSelected = selectedPlayer === p;
                      return (
                        <label
                          key={p}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 12px",
                            background: isSelected ? "#222" : "#111",
                            border: `1px solid ${isSelected ? "var(--pink)" : "#2c2c2c"}`,
                            borderRadius: 4,
                            cursor: "pointer",
                            transition: "background 0.15s, border-color 0.15s",
                          }}
                        >
                          <input
                            type="radio"
                            name="squad_player"
                            value={p}
                            checked={isSelected}
                            onChange={() => setSelectedPlayer(p)}
                            style={{ accentColor: "var(--pink)" }}
                          />
                          <span style={{ fontSize: 12, fontWeight: isSelected ? 700 : 500, color: isSelected ? "#fff" : "#ccc" }}>
                            {p}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {selectedPlayer && (
                    <small style={{ display: "block", marginTop: 8, color: "var(--pink)", fontSize: 11, fontWeight: 600 }}>
                      ✓ Official player print ({selectedPlayer}) will be applied.
                    </small>
                  )}
                </div>
              )}

              {/* Custom Name / Number Inputs */}
              {persMode === "custom" && (
                <div className="adi-custom-fields" style={{ marginTop: 12 }}>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="NAME (e.g. EDDY)"
                    className="adi-custom-input"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                  />
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="NUMBER (e.g. 10)"
                    className="adi-custom-input"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value.replace(/[^0-9]/g, ""))}
                  />
                  <small style={{ color: "var(--pink)", fontSize: 11 }}>
                    ✓ Custom name & squad number will be applied with official kit typography.
                  </small>
                </div>
              )}
            </div>

            {/* Size Selector Box Matrix */}
            <div>
              <div className="adi-sizes-header">
                <span className="adi-section-label" style={{ margin: 0 }}>Sizes</span>
                <button
                  type="button"
                  className="adi-size-guide-btn"
                  onClick={() => alert("Size Guide:\nXS: 34-36 inch chest\nS: 36-38 inch chest\nM: 38-40 inch chest\nL: 40-42 inch chest\nXL: 42-44 inch chest\n2XL: 44-46 inch chest\n3XL: 46-48 inch chest")}
                >
                  Size guide
                </button>
              </div>

              <div className="adi-sizes-matrix">
                {availableSizes.map((s) => {
                  const stockLeft = product.stock[s] ?? (product.sizes.includes(s) ? 4 : 0);
                  const isSoldOut = stockLeft === 0;
                  const isSelected = size === s;

                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={isSoldOut}
                      className={`adi-size-box ${isSelected ? "selected" : ""}`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              {/* Stock signal */}
              <div style={{ marginTop: 8, fontSize: 11, color: lowStock ? "var(--pink)" : "#888" }}>
                {lowStock && <AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />}
                {activeStock > 0 ? `${activeStock} available in size ${size}` : `Sold out in size ${size}`}
              </div>
            </div>

            {/* True to Size Recommendation banner */}
            <div className="adi-fit-recommendation">
              <Info size={18} style={{ color: "#aaa", flexShrink: 0 }} />
              <div>
                <strong>True to size.</strong> We recommend ordering your usual size for standard match day fit.
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #222", paddingTop: 14 }}>
              <span style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Quantity
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#161616",
                  border: "1px solid #333",
                  borderRadius: 2,
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  style={{ width: 36, height: 32, display: "grid", placeItems: "center", color: "#fff" }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: 36, textAlign: "center", fontSize: 12, fontWeight: 700 }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(activeStock || 10, q + 1))}
                  disabled={quantity >= activeStock}
                  style={{ width: 36, height: 32, display: "grid", placeItems: "center", color: "#fff" }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions: Add to Bag + Wishlist button */}
            <div className="adi-actions-row">
              <button
                type="button"
                disabled={activeStock === 0}
                className={`adi-btn-add ${added ? "added" : ""}`}
                onClick={handleAdd}
              >
                {added ? (
                  <>
                    <span>Added to bag!</span>
                    <Check size={18} />
                  </>
                ) : (
                  <>
                    <span>Add to bag</span>
                    <ShoppingBag size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="adi-btn-wishlist"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? "var(--pink)" : "none"} color={isWishlisted ? "var(--pink)" : "#fff"} />
              </button>
            </div>

            {/* View Bag Shortcut */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="ghost-button"
              style={{ width: "100%", justifyContent: "center", minHeight: 44 }}
            >
              <ShoppingBag size={15} /> View Bag ({count} {count === 1 ? "item" : "items"}) <ChevronRight size={15} />
            </button>
          </div>
        </section>

        {/* COMPLETE THE LOOK / RECOMMENDED SECTION */}
        <section className="adi-related-section">
          <h2 className="adi-related-title">Complete The Look</h2>
          <div className="adi-related-grid">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/product/${rel.slug}`}
                className="adi-related-card"
              >
                <div className="adi-related-thumb">
                  <img src={rel.image} alt={rel.name} />
                </div>
                <div className="adi-related-meta">
                  <h4>{rel.name}</h4>
                  <span>{rel.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer detail-footer">
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(179, 13, 13,0.08)", border: "1px solid rgba(179, 13, 13,0.25)", borderRadius: 4, marginTop: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 10, letterSpacing: "0.08em", color: "#aaa" }}>
              HOTLINE / EMERGENCIES: <a href="tel:09020711737" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "none" }}>09020711737</a>
            </span>
          </div>
          <Link className="footer-cta" href="/collection">
            Shop now <ArrowDownRight size={16} />
          </Link>
        </div>
        <div className="footer-bottom">
          <span>© ZOID / 2026</span>
          <span>Lagos — Nigeria</span>
          <span>Hotline: <a href="tel:09020711737" style={{ color: "inherit", textDecoration: "none" }}>09020711737</a></span>
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
                <h3>THE BAG / {count.toString().padStart(2, "00")}</h3>
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
                            {item.customization}
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
                <p>Your bag is waiting for a first selection.</p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Scroll-to-top FAB */}
      {showScrollTop && (
        <button
          onClick={scrollTop}
          aria-label="Back to top"
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 50,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--pink)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 4px 20px rgba(179, 13, 13,0.4)",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s ease, opacity 0.2s ease",
          }}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </main>
  );
}
