/* ZOID Admin Portal — Interactive No-Code Management Suite */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { products, type Product } from "@/lib/catalog";
import {
  ArrowLeft, Check, Edit3, Eye, Flame, Layers, LayoutGrid, Minus,
  PackageCheck, Plus, RefreshCw, Save, Search, ShieldCheck,
  Sparkles, Tag, Trash2, TrendingUp, AlertTriangle, X
} from "lucide-react";
import { toast } from "sonner";

const MARK = "/zoid-logo.svg";

// Stock images presets for quick selection
const imagePresets = [
  { label: "AC Milan 25-26", url: "/manus-storage/ac-milan-2526_b917ea29.jpg" },
  { label: "Barcelona Away", url: "/manus-storage/barcelona_9a244f02.jpg" },
  { label: "Inter Milan", url: "/manus-storage/inter-milan-2526_65e7cadc.jpg" },
  { label: "Liverpool 25-26", url: "/manus-storage/liverpool-2526_78e5ffc7.jpg" },
  { label: "Man United 25-26", url: "/manus-storage/manchester-united-2526_2aca202f.jpg" },
  { label: "Brazil 1998", url: "/jerseys/National/Brazil 1998 home vintage jersey.jpg" },
  { label: "Japan 2026 Special", url: "/jerseys/National/Japan 26 WCC.jpg" },
  { label: "ZOID Gym Set Detail", url: "/manus-storage/zoid-jersey-detail_0ef688bb.jpg" },
];

export default function Admin() {
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [stockStatusFilter, setStockStatusFilter] = useState<"all" | "in-stock" | "low-stock" | "out-of-stock">("all");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"inventory" | "add" | "analytics">("inventory");

  // New product form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("CURATED JERSEY");
  const [newPriceAmount, setNewPriceAmount] = useState("55000");
  const [newImage, setNewImage] = useState("/manus-storage/ac-milan-2526_b917ea29.jpg");
  const [newTone, setNewTone] = useState("Red / Black");
  const [newDetails, setNewDetails] = useState("");
  const [newIsBestseller, setNewIsBestseller] = useState(false);
  const [newIsSpecial, setNewIsSpecial] = useState(false);
  const [newSizes, setNewSizes] = useState<string[]>(["M", "L", "XL"]);
  const [newSizeInput, setNewSizeInput] = useState("");
  const [newStockMap, setNewStockMap] = useState<Record<string, number>>({ M: 5, L: 5, XL: 5 });

  // ── COMPUTED ANALYTICS METRICS ────────────────────────────────────
  const analytics = useMemo(() => {
    let totalItems = catalog.length;
    let totalUnits = 0;
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let bestsellerCount = 0;
    let specialCount = 0;

    catalog.forEach((p) => {
      const units = Object.values(p.stock).reduce((a, b) => a + b, 0);
      const numericPrice = Number(p.price.replace(/[^0-9]/g, "")) || 0;
      totalUnits += units;
      totalValue += units * numericPrice;
      if (units === 0) outOfStockCount++;
      else if (units <= 5) lowStockCount++;

      if (p.isBestseller) bestsellerCount++;
      if (p.isSpecial) specialCount++;
    });

    return { totalItems, totalUnits, totalValue, lowStockCount, outOfStockCount, bestsellerCount, specialCount };
  }, [catalog]);

  // ── FILTERED CATALOG ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    return catalog.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategoryFilter === "All" || p.category === selectedCategoryFilter;

      const totalUnits = Object.values(p.stock).reduce((a, b) => a + b, 0);
      let matchesStock = true;
      if (stockStatusFilter === "in-stock") matchesStock = totalUnits > 5;
      if (stockStatusFilter === "low-stock") matchesStock = totalUnits > 0 && totalUnits <= 5;
      if (stockStatusFilter === "out-of-stock") matchesStock = totalUnits === 0;

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [catalog, searchQuery, selectedCategoryFilter, stockStatusFilter]);

  // ── HANDLERS ──────────────────────────────────────────────────────
  function handleStockChange(slug: string, size: string, newCount: number) {
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          return { ...p, stock: { ...p.stock, [size]: Math.max(0, newCount) } };
        }
        return p;
      })
    );
    toast.success(`Size ${size} stock updated`);
  }

  function handlePriceAmountChange(slug: string, amount: string) {
    const numeric = amount.replace(/[^0-9]/g, "");
    const formatted = numeric ? `₦${Number(numeric).toLocaleString("en-NG")}` : "₦0";
    setCatalog((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, price: formatted } : p))
    );
    toast.success("Price updated");
  }

  function toggleBestseller(slug: string) {
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const nextState = !p.isBestseller;
          toast.success(nextState ? `Marked as Bestseller` : `Removed Bestseller tag`);
          return { ...p, isBestseller: nextState };
        }
        return p;
      })
    );
  }

  function toggleSpecial(slug: string) {
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const nextState = !p.isSpecial;
          toast.success(nextState ? `Marked as Special Kit` : `Removed Special Kit tag`);
          return { ...p, isSpecial: nextState };
        }
        return p;
      })
    );
  }

  function handleAddSize(slug: string, size: string) {
    if (!size.trim()) return;
    const normalized = size.trim().toUpperCase();
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug && !p.sizes.includes(normalized)) {
          return {
            ...p,
            sizes: [...p.sizes, normalized],
            stock: { ...p.stock, [normalized]: 5 },
          };
        }
        return p;
      })
    );
    toast.success(`Size ${normalized} added with initial stock of 5`);
  }

  function handleRemoveSize(slug: string, size: string) {
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const newSizes = p.sizes.filter((s) => s !== size);
          const newStock = { ...p.stock };
          delete newStock[size];
          return { ...p, sizes: newSizes, stock: newStock };
        }
        return p;
      })
    );
    toast.success(`Size ${size} removed`);
  }

  function handleDelete(slug: string, name: string) {
    if (confirm(`Remove "${name}" from storefront live catalog?`)) {
      setCatalog((prev) => prev.filter((p) => p.slug !== slug));
      toast.success(`${name} removed from storefront`);
    }
  }

  function handleApplyPresetSizes(preset: "standard" | "extended" | "one") {
    if (preset === "standard") {
      setNewSizes(["M", "L", "XL"]);
      setNewStockMap({ M: 5, L: 5, XL: 5 });
    } else if (preset === "extended") {
      setNewSizes(["S", "M", "L", "XL", "XXL"]);
      setNewStockMap({ S: 5, M: 8, L: 8, XL: 5, XXL: 3 });
    } else {
      setNewSizes(["ONE SIZE"]);
      setNewStockMap({ "ONE SIZE": 10 });
    }
    toast.success("Applied size preset");
  }

  function handleAddNewSize() {
    const s = newSizeInput.trim().toUpperCase();
    if (!s || newSizes.includes(s)) return;
    setNewSizes([...newSizes, s]);
    setNewStockMap({ ...newStockMap, [s]: 5 });
    setNewSizeInput("");
  }

  function handleRemoveNewSize(size: string) {
    setNewSizes((prev) => prev.filter((s) => s !== size));
    const updated = { ...newStockMap };
    delete updated[size];
    setNewStockMap(updated);
  }

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newName) {
      toast.error("Please enter a product name");
      return;
    }
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const formattedPrice = `₦${Number(newPriceAmount.replace(/[^0-9]/g, "")).toLocaleString("en-NG")}`;
    const newProduct: Product = {
      slug,
      name: newName,
      category: newCategory,
      price: formattedPrice,
      image: newImage,
      gallery: [{ label: "Front", image: newImage, treatment: "front" }],
      tone: newTone,
      style: newCategory.includes("GYM") ? "Gym Kit" : "Jersey",
      color: "Black",
      sizes: newSizes,
      stock: newStockMap,
      fit: "True to size",
      fitNote: "Choose your usual size for a relaxed match-day fit.",
      details: newDetails || "Curated piece from the ZOID archive.",
      delivery: "Delivered in 2 weeks",
      isBestseller: newIsBestseller,
      isSpecial: newIsSpecial,
    };

    setCatalog([newProduct, ...catalog]);
    toast.success(`${newName} published to live store!`, {
      description: "Catalog instantly updated for all visitors.",
    });
    setNewName("");
    setNewDetails("");
    setNewIsBestseller(false);
    setNewIsSpecial(false);
    setNewSizes(["M", "L", "XL"]);
    setNewStockMap({ M: 5, L: 5, XL: 5 });
    setActiveTab("inventory");
  }

  return (
    <main className="zoid-shell" style={{ minHeight: "100vh", background: "#080808", color: "#f4f0ea" }}>
      {/* ── TOP NAV HEADER ──────────────────────────── */}
      <header style={{
        height: 64, background: "#111111", borderBottom: "1px solid #222222",
        padding: "0 clamp(20px, 4vw, 48px)", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={MARK} alt="ZOID" style={{ height: 20 }} />
            <span style={{ fontFamily: "Anton", fontSize: 20, letterSpacing: "0.14em", color: "#fff" }}>ZOID</span>
          </Link>
          <span style={{ height: 16, width: 1, background: "#333" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={18} color="var(--pink)" />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff" }}>
              STORE MANAGER CONSOLE
            </span>
            <span style={{ fontSize: 8, background: "rgba(231,25,75,0.15)", border: "1px solid var(--pink)", color: "var(--pink)", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
              LIVE SYNC
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/collection" className="ghost-button" style={{ fontSize: 10, padding: "6px 14px", height: 34, gap: 6 }}>
            <Eye size={14} /> Preview Live Shop
          </Link>
          <Link href="/" className="pink-button small" style={{ height: 34 }}>
            <ArrowLeft size={14} /> Exit Admin
          </Link>
        </div>
      </header>

      <div style={{ padding: "36px clamp(20px, 4vw, 48px) 80px", maxWidth: 1280, margin: "0 auto" }}>

        {/* ── METRICS DASHBOARD KPI CARDS ────────────── */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 36 }}>
          {/* Card 1: Total Catalog */}
          <div style={{ background: "#121212", border: "1px solid #222", padding: 20, borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 9, color: "#777", letterSpacing: "0.14em", textTransform: "uppercase" }}>TOTAL PRODUCTS</span>
              <PackageCheck size={18} color="var(--pink)" />
            </div>
            <strong style={{ fontFamily: "Anton", fontSize: 32, color: "#fff", display: "block" }}>{analytics.totalItems}</strong>
            <span style={{ fontSize: 10, color: "#888", marginTop: 4, display: "block" }}>
              {analytics.bestsellerCount} Bestsellers · {analytics.specialCount} Special Kits
            </span>
          </div>

          {/* Card 2: Total Units in Stock */}
          <div style={{ background: "#121212", border: "1px solid #222", padding: 20, borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 9, color: "#777", letterSpacing: "0.14em", textTransform: "uppercase" }}>TOTAL UNITS IN STOCK</span>
              <Layers size={18} color="#29a36a" />
            </div>
            <strong style={{ fontFamily: "Anton", fontSize: 32, color: "#fff", display: "block" }}>{analytics.totalUnits}</strong>
            <span style={{ fontSize: 10, color: "#888", marginTop: 4, display: "block" }}>
              Across all sizes & variants
            </span>
          </div>

          {/* Card 3: Inventory Value */}
          <div style={{ background: "#121212", border: "1px solid #222", padding: 20, borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 9, color: "#777", letterSpacing: "0.14em", textTransform: "uppercase" }}>TOTAL INVENTORY VALUE</span>
              <TrendingUp size={18} color="#e7a619" />
            </div>
            <strong style={{ fontFamily: "Anton", fontSize: 28, color: "var(--pink)", display: "block" }}>
              ₦{analytics.totalValue.toLocaleString("en-NG")}
            </strong>
            <span style={{ fontSize: 10, color: "#888", marginTop: 4, display: "block" }}>
              Calculated at retail pricing
            </span>
          </div>

          {/* Card 4: Low Stock Alert */}
          <div style={{
            background: analytics.lowStockCount > 0 ? "rgba(231,166,25,0.06)" : "#121212",
            border: analytics.lowStockCount > 0 ? "1px solid rgba(231,166,25,0.3)" : "1px solid #222",
            padding: 20, borderRadius: 6
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 9, color: "#777", letterSpacing: "0.14em", textTransform: "uppercase" }}>STOCK ALERTS</span>
              <AlertTriangle size={18} color={analytics.lowStockCount > 0 ? "#e7a619" : "#666"} />
            </div>
            <strong style={{ fontFamily: "Anton", fontSize: 32, color: analytics.lowStockCount > 0 ? "#e7a619" : "#fff", display: "block" }}>
              {analytics.lowStockCount}
            </strong>
            <span style={{ fontSize: 10, color: "#888", marginTop: 4, display: "block" }}>
              Items with stock ≤ 5 units ({analytics.outOfStockCount} out of stock)
            </span>
          </div>
        </section>

        {/* ── MAIN NAVIGATION TAB BAR ────────────────── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid #222", paddingBottom: 16, marginBottom: 28, flexWrap: "wrap", gap: 16
        }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setActiveTab("inventory")}
              style={{
                padding: "10px 22px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                fontWeight: 700, borderRadius: 4, display: "flex", alignItems: "center", gap: 8,
                background: activeTab === "inventory" ? "var(--pink)" : "#161616",
                color: activeTab === "inventory" ? "#fff" : "#888",
                transition: "all 0.2s ease"
              }}
            >
              <LayoutGrid size={15} /> Catalog Inventory ({catalog.length})
            </button>
            <button
              onClick={() => setActiveTab("add")}
              style={{
                padding: "10px 22px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                fontWeight: 700, borderRadius: 4, display: "flex", alignItems: "center", gap: 8,
                background: activeTab === "add" ? "var(--pink)" : "#161616",
                color: activeTab === "add" ? "#fff" : "#888",
                transition: "all 0.2s ease"
              }}
            >
              <Plus size={15} /> Add New Product
            </button>
          </div>

          {/* Quick sync indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: "#666" }}>
            <RefreshCw size={13} style={{ animation: "spin 12s linear infinite" }} />
            <span>Storefront sync active</span>
          </div>
        </div>

        {/* ── TAB 1: INVENTORY & STOCK MANAGEMENT ─────── */}
        {activeTab === "inventory" && (
          <div>
            {/* Search & Filter Controls */}
            <div style={{
              background: "#121212", border: "1px solid #222", padding: 18, borderRadius: 6,
              marginBottom: 24, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap"
            }}>
              {/* Search input */}
              <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#666" }} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, category, or kit type..."
                  style={{
                    width: "100%", padding: "10px 12px 10px 38px",
                    background: "#1a1a1a", border: "1px solid #333",
                    color: "#fff", fontSize: 12, borderRadius: 4, outline: "none"
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 10, top: 10, color: "#888" }}>
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: "#777", letterSpacing: "0.12em", textTransform: "uppercase" }}>CATEGORY:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  style={{ background: "#1a1a1a", border: "1px solid #333", color: "#fff", padding: "9px 12px", fontSize: 11, borderRadius: 4 }}
                >
                  <option value="All">All Categories</option>
                  <option value="CURATED JERSEY">CURATED JERSEY</option>
                  <option value="ARCHIVE EDITION">ARCHIVE EDITION</option>
                  <option value="GYM KITS">GYM KITS</option>
                  <option value="SPECIAL KIT">SPECIAL KIT</option>
                  <option value="HERITAGE DROP">HERITAGE DROP</option>
                  <option value="NATIONAL TEAM">NATIONAL TEAM</option>
                </select>
              </div>

              {/* Stock Status Filter Pills */}
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { id: "all", label: "All Stock" },
                  { id: "in-stock", label: "In Stock (>5)" },
                  { id: "low-stock", label: "Low Stock (≤5)" },
                  { id: "out-of-stock", label: "Out of Stock" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStockStatusFilter(st.id as any)}
                    style={{
                      padding: "7px 12px", fontSize: 10, borderRadius: 4,
                      background: stockStatusFilter === st.id ? "rgba(231,25,75,0.15)" : "#1a1a1a",
                      border: stockStatusFilter === st.id ? "1px solid var(--pink)" : "1px solid #333",
                      color: stockStatusFilter === st.id ? "var(--pink)" : "#888",
                      fontWeight: 600
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, fontSize: 11, color: "#777" }}>
              <span>Showing {filtered.length} of {catalog.length} products</span>
              {searchQuery || selectedCategoryFilter !== "All" || stockStatusFilter !== "all" ? (
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategoryFilter("All"); setStockStatusFilter("all"); }}
                  style={{ color: "var(--pink)", background: "none", border: "none", cursor: "pointer", fontSize: 11 }}
                >
                  Reset All Filters
                </button>
              ) : null}
            </div>

            {/* Inventory Product Cards List */}
            <div style={{ display: "grid", gap: 16 }}>
              {filtered.map((product) => {
                const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
                const isExpanded = editingSlug === product.slug;
                const [sizeInputVal, setSizeInputVal] = useState("");

                return (
                  <div
                    key={product.slug}
                    style={{
                      background: "#121212",
                      border: isExpanded ? "1px solid var(--pink)" : "1px solid #222",
                      padding: 22, borderRadius: 6,
                      transition: "border-color 0.2s ease, background 0.2s ease"
                    }}
                  >
                    {/* Primary Row */}
                    <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>

                      {/* Thumbnail with tags overlay */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: 72, height: 86, objectFit: "cover", borderRadius: 4, background: "#090909" }}
                        />
                        {product.isBestseller && (
                          <span title="Bestseller" style={{ position: "absolute", top: -4, left: -4, background: "var(--pink)", color: "#fff", padding: 3, borderRadius: "50%", display: "grid", placeItems: "center" }}>
                            <Flame size={10} />
                          </span>
                        )}
                        {product.isSpecial && !product.isBestseller && (
                          <span title="Special Kit" style={{ position: "absolute", top: -4, left: -4, background: "#a855f7", color: "#fff", padding: 3, borderRadius: "50%", display: "grid", placeItems: "center" }}>
                            <Sparkles size={10} />
                          </span>
                        )}
                      </div>

                      {/* Product Details & Locked Naira Price Input */}
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
                            {product.category}
                          </span>
                          <span style={{ color: "#444" }}>·</span>
                          <span style={{ fontSize: 10, color: "#888" }}>{product.tone}</span>
                        </div>

                        <h4 style={{ fontFamily: "Anton", fontSize: 20, margin: "0 0 10px", color: "#fff", textTransform: "uppercase" }}>
                          {product.name}
                        </h4>

                        {/* Price editor (₦ locked prefix) */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 10, color: "#777", letterSpacing: "0.1em" }}>PRICE:</span>
                          <div style={{ display: "flex", alignItems: "center", background: "#1a1a1a", border: "1px solid #333", borderRadius: 4, overflow: "hidden" }}>
                            <span style={{ padding: "4px 9px", color: "var(--pink)", fontWeight: 700, fontSize: 13, userSelect: "none", borderRight: "1px solid #333", background: "#141414" }}>
                              ₦
                            </span>
                            <input
                              value={product.price.replace(/[^0-9,]/g, "")}
                              onChange={(e) => handlePriceAmountChange(product.slug, e.target.value)}
                              title="Enter amount (₦ sign is fixed)"
                              style={{ background: "transparent", border: "none", color: "#fff", padding: "4px 8px", fontSize: 12, width: 95, outline: "none", fontWeight: 600 }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Interactive Tags Toggles (Bestseller & Special Kit) */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 130 }}>
                        <button
                          onClick={() => toggleBestseller(product.slug)}
                          style={{
                            padding: "5px 10px", fontSize: 9, borderRadius: 3,
                            background: product.isBestseller ? "rgba(231,25,75,0.18)" : "#181818",
                            border: product.isBestseller ? "1px solid var(--pink)" : "1px solid #2a2a2a",
                            color: product.isBestseller ? "#fff" : "#777",
                            display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                            fontWeight: product.isBestseller ? 700 : 400
                          }}
                        >
                          <Flame size={12} color={product.isBestseller ? "var(--pink)" : "#666"} />
                          {product.isBestseller ? "BESTSELLER ON" : "Mark Bestseller"}
                        </button>

                        <button
                          onClick={() => toggleSpecial(product.slug)}
                          style={{
                            padding: "5px 10px", fontSize: 9, borderRadius: 3,
                            background: product.isSpecial ? "rgba(168,85,247,0.18)" : "#181818",
                            border: product.isSpecial ? "1px solid #a855f7" : "1px solid #2a2a2a",
                            color: product.isSpecial ? "#fff" : "#777",
                            display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                            fontWeight: product.isSpecial ? 700 : 400
                          }}
                        >
                          <Sparkles size={12} color={product.isSpecial ? "#a855f7" : "#666"} />
                          {product.isSpecial ? "SPECIAL KIT ON" : "Mark Special Kit"}
                        </button>
                      </div>

                      {/* Stock Counters per Size */}
                      <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#181818", padding: "10px 14px", borderRadius: 6, flexWrap: "wrap" }}>
                        {product.sizes.map((sz) => (
                          <div key={sz} style={{ textAlign: "center" }}>
                            <span style={{ display: "block", fontSize: 8, color: "#888", marginBottom: 3, fontWeight: 700 }}>{sz}</span>
                            <input
                              type="number"
                              min="0"
                              value={product.stock[sz] ?? 0}
                              onChange={(e) => handleStockChange(product.slug, sz, parseInt(e.target.value) || 0)}
                              style={{
                                width: 44, padding: "4px 2px",
                                background: "#0e0e0e", border: "1px solid #333",
                                color: (product.stock[sz] ?? 0) === 0 ? "var(--pink)" : "#fff",
                                textAlign: "center", fontSize: 12, borderRadius: 3, outline: "none", fontWeight: 700
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Stock Status Indicator */}
                      <div style={{ textAlign: "right", minWidth: 95 }}>
                        <span style={{
                          display: "inline-block", fontSize: 9, padding: "4px 8px", borderRadius: 4, fontWeight: 700,
                          background: totalStock > 5 ? "rgba(41,163,106,0.15)" : totalStock > 0 ? "rgba(231,166,25,0.15)" : "rgba(231,25,75,0.15)",
                          color: totalStock > 5 ? "#29a36a" : totalStock > 0 ? "#e7a619" : "var(--pink)",
                          letterSpacing: "0.08em"
                        }}>
                          {totalStock > 5 ? "IN STOCK" : totalStock > 0 ? "LOW STOCK" : "OUT OF STOCK"}
                        </span>
                        <small style={{ display: "block", color: "#666", fontSize: 10, marginTop: 4 }}>
                          {totalStock} units total
                        </small>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setPreviewProduct(product)}
                          style={{
                            border: "1px solid #333", background: "#181818", color: "#aaa",
                            padding: 8, borderRadius: 4, cursor: "pointer", display: "grid", placeItems: "center"
                          }}
                          title="Quick Live Preview"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => setEditingSlug(isExpanded ? null : product.slug)}
                          style={{
                            border: "1px solid #333",
                            background: isExpanded ? "var(--pink)" : "#181818",
                            color: isExpanded ? "#fff" : "#ccc",
                            padding: "7px 12px", borderRadius: 4, cursor: "pointer",
                            fontSize: 10, letterSpacing: "0.1em", fontWeight: 700,
                            display: "flex", alignItems: "center", gap: 4
                          }}
                          title="Manage Sizes"
                        >
                          <Tag size={12} /> Sizes
                        </button>

                        <button
                          onClick={() => handleDelete(product.slug, product.name)}
                          style={{ border: "1px solid #333", background: "#181818", color: "#888", padding: 8, borderRadius: 4, cursor: "pointer" }}
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Size Manager Panel */}
                    {isExpanded && (
                      <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #222", background: "#181818", padding: 18, borderRadius: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <span style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--pink)", fontWeight: 700, textTransform: "uppercase" }}>
                            SIZE SPECIFICATION MANAGER — {product.name}
                          </span>
                          <span style={{ fontSize: 10, color: "#777" }}>Add or remove size options for this item</span>
                        </div>

                        {/* Current Sizes Chips */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                          {product.sizes.map((sz) => (
                            <div key={sz} style={{ display: "flex", alignItems: "center", gap: 6, background: "#222", border: "1px solid #3a3a3a", borderRadius: 4, padding: "6px 12px" }}>
                              <span style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{sz}</span>
                              <span style={{ fontSize: 10, color: "var(--pink)" }}>({product.stock[sz] ?? 0} in stock)</span>
                              <button
                                onClick={() => handleRemoveSize(product.slug, sz)}
                                style={{ background: "none", border: "none", color: "#888", cursor: "pointer", padding: 0, marginLeft: 4 }}
                                title={`Remove size ${sz}`}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add New Size Input */}
                        <div style={{ display: "flex", gap: 8, maxWidth: 360 }}>
                          <input
                            value={sizeInputVal}
                            onChange={(e) => setSizeInputVal(e.target.value)}
                            placeholder="Add size (e.g. XS, XXL, 3XL)"
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSize(product.slug, sizeInputVal); setSizeInputVal(""); } }}
                            style={{ flex: 1, padding: "8px 12px", background: "#111", border: "1px solid #333", color: "#fff", fontSize: 12, borderRadius: 4, outline: "none" }}
                          />
                          <button
                            type="button"
                            onClick={() => { handleAddSize(product.slug, sizeInputVal); setSizeInputVal(""); }}
                            className="pink-button small"
                          >
                            <Plus size={14} /> Add Size
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 2: ADD NEW PRODUCT FORM ─────────────── */}
        {activeTab === "add" && (
          <form onSubmit={handleAddProduct} style={{ background: "#121212", border: "1px solid #222", padding: 36, borderRadius: 6, maxWidth: 760, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #222" }}>
              <Plus size={22} color="var(--pink)" />
              <div>
                <h3 style={{ fontFamily: "Anton", fontSize: 24, margin: 0, color: "#fff" }}>ADD NEW PRODUCT TO LIVE STOREFRONT</h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#888" }}>Fill in details to immediately publish a new jersey or activewear kit.</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: 20 }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>Product Name *</label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Arsenal 2004 Vintage Home / Gym Pro Set"
                  style={{ width: "100%", padding: 13, background: "#181818", border: "1px solid #333", color: "#fff", fontSize: 13, borderRadius: 4, outline: "none" }}
                />
              </div>

              {/* Category & Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: "100%", padding: 13, background: "#181818", border: "1px solid #333", color: "#fff", fontSize: 13, borderRadius: 4, outline: "none" }}
                  >
                    <option value="CURATED JERSEY">CURATED JERSEY</option>
                    <option value="ARCHIVE EDITION">ARCHIVE EDITION</option>
                    <option value="GYM KITS">GYM KITS</option>
                    <option value="SPECIAL KIT">SPECIAL KIT</option>
                    <option value="HERITAGE DROP">HERITAGE DROP</option>
                    <option value="NATIONAL TEAM">NATIONAL TEAM</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>Price Amount (Naira)</label>
                  {/* Fixed Naira prefix */}
                  <div style={{ display: "flex", alignItems: "center", background: "#181818", border: "1px solid #333", borderRadius: 4, overflow: "hidden" }}>
                    <span style={{ padding: "13px 14px", color: "var(--pink)", fontWeight: 700, fontSize: 15, userSelect: "none", borderRight: "1px solid #333", background: "#141414" }}>₦</span>
                    <input
                      value={newPriceAmount}
                      onChange={(e) => setNewPriceAmount(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="55000"
                      style={{ flex: 1, padding: 13, background: "transparent", border: "none", color: "#fff", fontSize: 13, outline: "none", fontWeight: 600 }}
                    />
                  </div>
                </div>
              </div>

              {/* Color Tone & Style */}
              <div>
                <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>Color Tone / Variant Description</label>
                <input
                  value={newTone}
                  onChange={(e) => setNewTone(e.target.value)}
                  placeholder="e.g. Red / Black / White accents"
                  style={{ width: "100%", padding: 13, background: "#181818", border: "1px solid #333", color: "#fff", fontSize: 13, borderRadius: 4, outline: "none" }}
                />
              </div>

              {/* Image Path with Preset Selector */}
              <div>
                <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>Image Source Path or URL</label>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    style={{ flex: 1, padding: 13, background: "#181818", border: "1px solid #333", color: "#fff", fontSize: 13, borderRadius: 4, outline: "none" }}
                  />
                  {newImage && (
                    <img src={newImage} alt="Preview" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 4, border: "1px solid var(--pink)" }} />
                  )}
                </div>

                {/* Preset image buttons */}
                <div style={{ marginTop: 10 }}>
                  <span style={{ fontSize: 9, color: "#666", display: "block", marginBottom: 6 }}>OR CHOOSE A STOCK PRESET:</span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {imagePresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setNewImage(preset.url)}
                        style={{
                          padding: "4px 8px", fontSize: 9, borderRadius: 3,
                          background: newImage === preset.url ? "var(--pink)" : "#222",
                          color: newImage === preset.url ? "#fff" : "#aaa",
                          border: "none", cursor: "pointer"
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature Highlights Toggles */}
              <div style={{ display: "flex", gap: 20, background: "#181818", padding: 16, borderRadius: 4, border: "1px solid #2a2a2a" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "#ccc" }}>
                  <input
                    type="checkbox"
                    checked={newIsBestseller}
                    onChange={(e) => setNewIsBestseller(e.target.checked)}
                    style={{ accentColor: "var(--pink)" }}
                  />
                  <span style={{ fontWeight: 600 }}>Tag as Bestseller</span> (Displays pink flame badge)
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "#ccc" }}>
                  <input
                    type="checkbox"
                    checked={newIsSpecial}
                    onChange={(e) => setNewIsSpecial(e.target.checked)}
                    style={{ accentColor: "#a855f7" }}
                  />
                  <span style={{ fontWeight: 600 }}>Tag as Special Kit</span> (Displays purple sparkles badge)
                </label>
              </div>

              {/* Description Story */}
              <div>
                <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>Product Story / Dossier Details</label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Describe the fabric, era, nostalgia, or performance features..."
                  style={{ width: "100%", padding: 13, background: "#181818", border: "1px solid #333", color: "#fff", fontSize: 13, borderRadius: 4, resize: "vertical", outline: "none" }}
                />
              </div>

              {/* Size & Initial Stock Manager */}
              <div style={{ background: "#181818", padding: 20, borderRadius: 6, border: "1px solid #282828" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <label style={{ fontSize: 10, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>
                    SIZES & INITIAL STOCK INVENTORY
                  </label>
                  {/* Quick Presets */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button type="button" onClick={() => handleApplyPresetSizes("standard")} style={{ padding: "3px 8px", fontSize: 9, background: "#222", border: "1px solid #333", color: "#aaa", borderRadius: 3 }}>
                      Preset: M, L, XL
                    </button>
                    <button type="button" onClick={() => handleApplyPresetSizes("extended")} style={{ padding: "3px 8px", fontSize: 9, background: "#222", border: "1px solid #333", color: "#aaa", borderRadius: 3 }}>
                      Preset: S—XXL
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                  {newSizes.map((sz) => (
                    <div key={sz} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "#222", border: "1px solid #383838", borderRadius: 4, padding: "10px 14px", minWidth: 72 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{sz}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewSize(sz)}
                          style={{ background: "none", border: "none", color: "#777", cursor: "pointer", padding: 0 }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={newStockMap[sz] ?? 0}
                        onChange={(e) => setNewStockMap({ ...newStockMap, [sz]: parseInt(e.target.value) || 0 })}
                        style={{ width: 44, padding: 4, background: "#111", border: "1px solid #333", color: "#fff", textAlign: "center", fontSize: 12, borderRadius: 3, fontWeight: 700 }}
                      />
                      <span style={{ fontSize: 8, color: "#666" }}>units</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    placeholder="Add custom size (e.g. XS, 3XL)"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddNewSize(); } }}
                    style={{ padding: "8px 12px", background: "#111", border: "1px solid #333", color: "#fff", fontSize: 12, borderRadius: 4, width: 200 }}
                  />
                  <button type="button" onClick={handleAddNewSize} className="pink-button small">
                    <Plus size={14} /> Add Size
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button type="submit" className="pink-button" style={{ marginTop: 12, justifyContent: "center", minHeight: 52, fontSize: 12 }}>
                Publish Product to Storefront <Save size={16} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── LIVE PREVIEW MODAL DRAWER ──────────────── */}
      {previewProduct && (
        <div className="drawer-backdrop" onClick={() => setPreviewProduct(null)}>
          <aside
            className="cart-drawer"
            style={{ width: "min(480px, 100%)", background: "#111", color: "#fff" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head" style={{ borderColor: "#222" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--pink)" }}>LIVE STOREFRONT PREVIEW</p>
                <h3 style={{ fontSize: 22, color: "#fff" }}>{previewProduct.name}</h3>
              </div>
              <button onClick={() => setPreviewProduct(null)} style={{ color: "#fff" }}><X size={20} /></button>
            </div>

            <div style={{ padding: "24px 0" }}>
              <img
                src={previewProduct.image}
                alt={previewProduct.name}
                style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 4, marginBottom: 20 }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
                  {previewProduct.category}
                </span>
                <strong style={{ fontSize: 18, color: "#fff" }}>{previewProduct.price}</strong>
              </div>

              <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>{previewProduct.details}</p>

              <div style={{ padding: 16, background: "#181818", border: "1px solid #282828", borderRadius: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 9, color: "#777", letterSpacing: "0.12em", display: "block", marginBottom: 8, textTransform: "uppercase" }}>
                  AVAILABLE SIZES & STOCK:
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {previewProduct.sizes.map((sz) => (
                    <span key={sz} style={{ padding: "4px 10px", background: "#222", border: "1px solid #333", fontSize: 11, borderRadius: 3, color: "#fff" }}>
                      {sz} ({previewProduct.stock[sz] ?? 0} left)
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {previewProduct.isBestseller && (
                  <span style={{ padding: "4px 10px", background: "var(--pink)", color: "#fff", fontSize: 9, borderRadius: 20, fontWeight: 700 }}>
                    🔥 BESTSELLER
                  </span>
                )}
                {previewProduct.isSpecial && (
                  <span style={{ padding: "4px 10px", background: "#a855f7", color: "#fff", fontSize: 9, borderRadius: 20, fontWeight: 700 }}>
                    ✨ SPECIAL KIT
                  </span>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
