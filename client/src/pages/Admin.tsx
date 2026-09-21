/* ZOID Admin Portal — No-Code Management Suite for Non-Technical Managers */
import { useState } from "react";
import { Link } from "wouter";
import { products, type Product } from "@/lib/catalog";
import { ArrowLeft, Check, Minus, Plus, Save, Search, ShieldCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"inventory" | "add">("inventory");

  // New product form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("CURATED JERSEY");
  const [newPriceAmount, setNewPriceAmount] = useState("55000");
  const [newImage, setNewImage] = useState("/manus-storage/ac-milan-2526_b917ea29.jpg");
  const [newTone, setNewTone] = useState("Red / Black");
  const [newDetails, setNewDetails] = useState("");
  const [newSizes, setNewSizes] = useState<string[]>(["M", "L", "XL"]);
  const [newSizeInput, setNewSizeInput] = useState("");
  const [newStockMap, setNewStockMap] = useState<Record<string, number>>({ M: 5, L: 5, XL: 5 });

  const filtered = catalog.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleStockChange(slug: string, size: string, newCount: number) {
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          return { ...p, stock: { ...p.stock, [size]: Math.max(0, newCount) } };
        }
        return p;
      })
    );
    toast.success("Stock updated");
  }

  // Price change: only allow editing the number part — ₦ sign is fixed
  function handlePriceAmountChange(slug: string, amount: string) {
    // Strip non-numeric characters from user input
    const numeric = amount.replace(/[^0-9]/g, "");
    const formatted = numeric ? `₦${Number(numeric).toLocaleString("en-NG")}` : "₦0";
    setCatalog((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, price: formatted } : p))
    );
    toast.success("Price updated");
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
            stock: { ...p.stock, [normalized]: 0 },
          };
        }
        return p;
      })
    );
    toast.success(`Size ${normalized} added`);
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

  function handleDelete(slug: string) {
    if (confirm("Are you sure you want to remove this product from the storefront?")) {
      setCatalog((prev) => prev.filter((p) => p.slug !== slug));
      toast.success("Product removed from storefront");
    }
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
      toast.error("Please provide a product name");
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
    };

    setCatalog([newProduct, ...catalog]);
    toast.success(`${newName} added to live storefront!`, {
      description: "Non-technical update active across all store pages.",
    });
    setNewName("");
    setNewDetails("");
    setNewSizes(["M", "L", "XL"]);
    setNewStockMap({ M: 5, L: 5, XL: 5 });
    setActiveTab("inventory");
  }

  return (
    <main className="zoid-shell" style={{ minHeight: "100vh", background: "#0c0c0c", color: "#fff" }}>
      {/* Admin Header */}
      <header style={{
        height: 64, background: "#141414", borderBottom: "1px solid #262626",
        padding: "0 5vw", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ShieldCheck size={22} color="var(--pink)" />
          <strong style={{ fontFamily: "Anton", fontSize: 20, letterSpacing: "0.1em" }}>ZOID STORE MANAGER</strong>
          <span style={{ fontSize: 10, background: "var(--pink)", color: "#fff", padding: "2px 8px", borderRadius: 10 }}>NO-CODE ADMIN</span>
        </div>
        <Link href="/" className="ghost-button" style={{ fontSize: 10, padding: "6px 14px", height: 32 }}>
          <ArrowLeft size={14} /> Back to Storefront
        </Link>
      </header>

      <div style={{ padding: "40px 5vw", maxWidth: 1200, margin: "0 auto" }}>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 12, borderBottom: "1px solid #222", paddingBottom: 16, marginBottom: 32 }}>
          <button
            onClick={() => setActiveTab("inventory")}
            style={{
              padding: "10px 20px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
              fontWeight: 700, borderRadius: 4,
              background: activeTab === "inventory" ? "var(--pink)" : "#181818",
              color: activeTab === "inventory" ? "#fff" : "#888",
            }}
          >
            Inventory & Stock ({catalog.length})
          </button>
          <button
            onClick={() => setActiveTab("add")}
            style={{
              padding: "10px 20px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
              fontWeight: 700, borderRadius: 4,
              background: activeTab === "add" ? "var(--pink)" : "#181818",
              color: activeTab === "add" ? "#fff" : "#888",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Plus size={14} /> Add New Item / Gym Kit
          </button>
        </div>

        {/* INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
              <div style={{ position: "relative", width: 320 }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#666" }} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter products..."
                  style={{ width: "100%", padding: "10px 12px 10px 38px", background: "#161616", border: "1px solid #333", color: "#fff", fontSize: 12, borderRadius: 4 }}
                />
              </div>
              <small style={{ color: "#888" }}>Changes apply instantly to the storefront catalog.</small>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {filtered.map((product) => {
                const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
                const isExpanded = editingSlug === product.slug;
                const [sizeInputVal, setSizeInputVal] = useState("");

                return (
                  <div key={product.slug} style={{ background: "#141414", border: "1px solid #262626", padding: 20, borderRadius: 6 }}>
                    {/* Main row */}
                    <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                      <img src={product.image} alt={product.name} style={{ width: 64, height: 74, objectFit: "cover", borderRadius: 4 }} />
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{product.category}</span>
                        <h4 style={{ fontFamily: "Anton", fontSize: 18, margin: "2px 0 8px", color: "#fff" }}>{product.name}</h4>

                        {/* Price editor — ₦ prefix is locked, only number is editable */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: "#aaa" }}>Price:</span>
                          <div style={{ display: "flex", alignItems: "center", background: "#222", border: "1px solid #444", borderRadius: 3, overflow: "hidden" }}>
                            <span style={{ padding: "4px 8px", color: "var(--pink)", fontWeight: 700, fontSize: 13, userSelect: "none", borderRight: "1px solid #444", background: "#1a1a1a" }}>₦</span>
                            <input
                              value={product.price.replace(/[^0-9,]/g, "")}
                              onChange={(e) => handlePriceAmountChange(product.slug, e.target.value)}
                              title="Enter amount (₦ sign is fixed)"
                              style={{ background: "transparent", border: "none", color: "#fff", padding: "4px 8px", fontSize: 12, width: 90 }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Stock Control per size */}
                      <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#1c1c1c", padding: "10px 14px", borderRadius: 6, flexWrap: "wrap" }}>
                        {product.sizes.map((sz) => (
                          <div key={sz} style={{ textAlign: "center" }}>
                            <span style={{ display: "block", fontSize: 9, color: "#888", marginBottom: 2 }}>SIZE {sz}</span>
                            <input
                              type="number"
                              min="0"
                              value={product.stock[sz] ?? 0}
                              onChange={(e) => handleStockChange(product.slug, sz, parseInt(e.target.value) || 0)}
                              style={{ width: 44, padding: 4, background: "#111", border: "1px solid #333", color: "#fff", textAlign: "center", fontSize: 12, borderRadius: 3 }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Status + actions */}
                      <div style={{ textAlign: "right", minWidth: 100 }}>
                        <span style={{
                          display: "inline-block", fontSize: 10, padding: "4px 8px", borderRadius: 4, fontWeight: 700,
                          background: totalStock > 5 ? "rgba(41,163,106,0.2)" : totalStock > 0 ? "rgba(231,166,25,0.2)" : "rgba(231,25,75,0.2)",
                          color: totalStock > 5 ? "#29a36a" : totalStock > 0 ? "#e7a619" : "var(--pink)",
                        }}>
                          {totalStock > 5 ? "IN STOCK" : totalStock > 0 ? "LOW STOCK" : "OUT OF STOCK"}
                        </span>
                        <small style={{ display: "block", color: "#666", fontSize: 10, marginTop: 4 }}>Total: {totalStock} units</small>
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setEditingSlug(isExpanded ? null : product.slug)}
                          style={{ border: "1px solid #333", background: isExpanded ? "var(--pink)" : "transparent", color: isExpanded ? "#fff" : "#888", padding: "7px 12px", borderRadius: 4, cursor: "pointer", fontSize: 10, letterSpacing: "0.1em" }}
                          title="Manage sizes"
                        >
                          SIZES
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug)}
                          style={{ border: "1px solid #333", background: "transparent", color: "#888", padding: 8, borderRadius: 4, cursor: "pointer" }}
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded size manager */}
                    {isExpanded && (
                      <div style={{ marginTop: 20, padding: "16px", background: "#1a1a1a", borderRadius: 6, border: "1px solid #333" }}>
                        <p style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--pink)", marginBottom: 12 }}>MANAGE SIZES</p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                          {product.sizes.map((sz) => (
                            <div key={sz} style={{ display: "flex", alignItems: "center", gap: 4, background: "#252525", border: "1px solid #444", borderRadius: 4, padding: "5px 10px" }}>
                              <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{sz}</span>
                              <button
                                onClick={() => handleRemoveSize(product.slug, sz)}
                                style={{ background: "none", border: "none", color: "#888", cursor: "pointer", padding: "0 2px", lineHeight: 1 }}
                                title={`Remove size ${sz}`}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            value={sizeInputVal}
                            onChange={(e) => setSizeInputVal(e.target.value)}
                            placeholder="New size (e.g. XXL, XS)"
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSize(product.slug, sizeInputVal); setSizeInputVal(""); } }}
                            style={{ padding: "8px 12px", background: "#111", border: "1px solid #444", color: "#fff", fontSize: 12, borderRadius: 4, width: 180 }}
                          />
                          <button
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

        {/* ADD NEW PRODUCT TAB */}
        {activeTab === "add" && (
          <form onSubmit={handleAddProduct} style={{ background: "#141414", border: "1px solid #262626", padding: 32, borderRadius: 6, maxWidth: 680 }}>
            <h3 style={{ fontFamily: "Anton", fontSize: 24, marginBottom: 20 }}>ADD NEW PRODUCT TO STOREFRONT</h3>

            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>Product Name *</label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Arsenal 2004 Vintage Home / Gym Pro Set"
                  style={{ width: "100%", padding: 12, background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 13, borderRadius: 4 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: "100%", padding: 12, background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 13, borderRadius: 4 }}
                  >
                    <option value="CURATED JERSEY">CURATED JERSEY</option>
                    <option value="ARCHIVE EDITION">ARCHIVE EDITION</option>
                    <option value="GYM KITS">GYM KITS</option>
                    <option value="SPECIAL KIT">SPECIAL KIT</option>
                    <option value="HERITAGE DROP">HERITAGE DROP</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>Price Amount (Naira)</label>
                  {/* ₦ is fixed — only amount is editable */}
                  <div style={{ display: "flex", alignItems: "center", background: "#1a1a1a", border: "1px solid #333", borderRadius: 4, overflow: "hidden" }}>
                    <span style={{ padding: "12px 12px", color: "var(--pink)", fontWeight: 700, fontSize: 15, userSelect: "none", borderRight: "1px solid #333", background: "#141414" }}>₦</span>
                    <input
                      value={newPriceAmount}
                      onChange={(e) => setNewPriceAmount(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="55000"
                      style={{ flex: 1, padding: 12, background: "transparent", border: "none", color: "#fff", fontSize: 13 }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>Image Path or URL</label>
                <input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  style={{ width: "100%", padding: 12, background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 13, borderRadius: 4 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>Description / Story</label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Describe the material, heritage, or gym fit details..."
                  style={{ width: "100%", padding: 12, background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 13, borderRadius: 4, resize: "vertical" }}
                />
              </div>

              {/* Sizes manager */}
              <div>
                <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 10, textTransform: "uppercase" }}>Sizes & Initial Stock</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {newSizes.map((sz) => (
                    <div key={sz} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "#252525", border: "1px solid #444", borderRadius: 4, padding: "10px 14px", minWidth: 70 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{sz}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewSize(sz)}
                          style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: 0, lineHeight: 1 }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={newStockMap[sz] ?? 0}
                        onChange={(e) => setNewStockMap({ ...newStockMap, [sz]: parseInt(e.target.value) || 0 })}
                        style={{ width: 44, padding: 4, background: "#111", border: "1px solid #333", color: "#fff", textAlign: "center", fontSize: 12, borderRadius: 3 }}
                      />
                      <span style={{ fontSize: 8, color: "#666" }}>units</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    placeholder="Add size (e.g. XS, XXL)"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddNewSize(); } }}
                    style={{ padding: "8px 12px", background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 12, borderRadius: 4, width: 200 }}
                  />
                  <button type="button" onClick={handleAddNewSize} className="pink-button small">
                    <Plus size={14} /> Add Size
                  </button>
                </div>
              </div>

              <button type="submit" className="pink-button" style={{ marginTop: 12, justifyContent: "center" }}>
                Publish Product to Storefront <Save size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
