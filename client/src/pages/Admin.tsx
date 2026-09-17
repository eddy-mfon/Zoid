/* ZOID Admin Portal — No-Code Management Suite for Non-Technical Managers */
import { useState } from "react";
import { Link } from "wouter";
import { products, type Product } from "@/lib/catalog";
import { ArrowLeft, Check, Edit2, Plus, RefreshCw, Save, Search, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"inventory" | "add" | "orders">("inventory");

  // New product form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("CURATED JERSEY");
  const [newPrice, setNewPrice] = useState("₦55,000");
  const [newImage, setNewImage] = useState("/manus-storage/ac-milan-2526_b917ea29.jpg");
  const [newTone, setNewTone] = useState("Red / Black");
  const [newDetails, setNewDetails] = useState("");
  const [stockM, setStockM] = useState(5);
  const [stockL, setStockL] = useState(5);
  const [stockXL, setStockXL] = useState(5);

  const filtered = catalog.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleStockChange(slug: string, size: string, newCount: number) {
    setCatalog(prev => prev.map(p => {
      if (p.slug === slug) {
        return {
          ...p,
          stock: { ...p.stock, [size]: Math.max(0, newCount) }
        };
      }
      return p;
    }));
    toast.success("Stock updated successfully");
  }

  function handlePriceChange(slug: string, newPriceVal: string) {
    setCatalog(prev => prev.map(p => {
      if (p.slug === slug) return { ...p, price: newPriceVal };
      return p;
    }));
    toast.success("Price updated successfully");
  }

  function handleDelete(slug: string) {
    if (confirm("Are you sure you want to remove this product from the storefront?")) {
      setCatalog(prev => prev.filter(p => p.slug !== slug));
      toast.success("Product removed from storefront");
    }
  }

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newName) {
      toast.error("Please provide a product name");
      return;
    }
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProduct: Product = {
      slug,
      name: newName,
      category: newCategory,
      price: newPrice,
      image: newImage,
      gallery: [{ label: "Front", image: newImage, treatment: "front" }],
      tone: newTone,
      style: newCategory.includes("GYM") ? "Gym Kit" : "Jersey",
      color: "Black",
      sizes: ["M", "L", "XL"],
      stock: { M: stockM, L: stockL, XL: stockXL },
      fit: "True to size",
      fitNote: "Choose your usual size for a relaxed match-day fit.",
      details: newDetails || "Curated piece from the ZOID archive.",
      delivery: "Delivered in 2 weeks"
    };

    setCatalog([newProduct, ...catalog]);
    toast.success(`${newName} added to live storefront!`, {
      description: "Non-technical update active across all store pages."
    });
    setNewName("");
    setNewDetails("");
    setActiveTab("inventory");
  }

  return (
    <main className="zoid-shell" style={{ minHeight: "100vh", background: "#0c0c0c", color: "#fff" }}>
      {/* Admin Top Header */}
      <header style={{
        height: 64, background: "#141414", borderBottom: "1px solid #262626",
        padding: "0 5vw", display: "flex", alignItems: "center", justifyContent: "space-between"
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

      {/* Main Body */}
      <div style={{ padding: "40px 5vw", maxWidth: 1200, margin: "0 auto" }}>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 12, borderBottom: "1px solid #222", paddingBottom: 16, marginBottom: 32 }}>
          <button
            onClick={() => setActiveTab("inventory")}
            style={{
              padding: "10px 20px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
              fontWeight: 700, borderRadius: 4,
              background: activeTab === "inventory" ? "var(--pink)" : "#181818",
              color: activeTab === "inventory" ? "#fff" : "#888"
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
              display: "flex", alignItems: "center", gap: 6
            }}
          >
            <Plus size={14} /> Add New Item / Gym Kit
          </button>
        </div>

        {/* INVENTORY MANAGEMENT TAB */}
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
                return (
                  <div key={product.slug} style={{ background: "#141414", border: "1px solid #262626", padding: 20, borderRadius: 6, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                    <img src={product.image} alt={product.name} style={{ width: 64, height: 74, objectFit: "cover", borderRadius: 4 }} />
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{product.category}</span>
                      <h4 style={{ fontFamily: "Anton", fontSize: 18, margin: "2px 0 6px", color: "#fff" }}>{product.name}</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 12, color: "#aaa" }}>Price:</span>
                        <input
                          value={product.price}
                          onChange={(e) => handlePriceChange(product.slug, e.target.value)}
                          style={{ background: "#222", border: "1px solid #444", color: "#fff", padding: "4px 8px", fontSize: 12, width: 100, borderRadius: 3 }}
                        />
                      </div>
                    </div>

                    {/* Stock Control per size */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#1c1c1c", padding: "10px 14px", borderRadius: 6 }}>
                      {["M", "L", "XL"].map((sz) => (
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

                    {/* Status Badge */}
                    <div style={{ textAlign: "right", minWidth: 100 }}>
                      <span style={{
                        display: "inline-block", fontSize: 10, padding: "4px 8px", borderRadius: 4, fontWeight: 700,
                        background: totalStock > 5 ? "rgba(41,163,106,0.2)" : totalStock > 0 ? "rgba(231,166,25,0.2)" : "rgba(231,25,75,0.2)",
                        color: totalStock > 5 ? "#29a36a" : totalStock > 0 ? "#e7a619" : "var(--pink)"
                      }}>
                        {totalStock > 5 ? "IN STOCK" : totalStock > 0 ? "LOW STOCK" : "OUT OF STOCK"}
                      </span>
                      <small style={{ display: "block", color: "#666", fontSize: 10, marginTop: 4 }}>Total: {totalStock} units</small>
                    </div>

                    <button
                      onClick={() => handleDelete(product.slug)}
                      style={{ border: "1px solid #333", background: "transparent", color: "#888", padding: 8, borderRadius: 4, cursor: "pointer" }}
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ADD NEW PRODUCT TAB */}
        {activeTab === "add" && (
          <form onSubmit={handleAddProduct} style={{ background: "#141414", border: "1px solid #262626", padding: 32, borderRadius: 6, maxWidth: 640 }}>
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
                  <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>Price (Naira)</label>
                  <input
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="₦55,000"
                    style={{ width: "100%", padding: 12, background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 13, borderRadius: 4 }}
                  />
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

              <div>
                <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>Initial Stock by Size</label>
                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <span style={{ fontSize: 10, color: "#aaa" }}>Size M</span>
                    <input type="number" min="0" value={stockM} onChange={(e) => setStockM(parseInt(e.target.value) || 0)} style={{ width: "100%", padding: 8, background: "#1a1a1a", border: "1px solid #333", color: "#fff", textAlign: "center", borderRadius: 4 }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: "#aaa" }}>Size L</span>
                    <input type="number" min="0" value={stockL} onChange={(e) => setStockL(parseInt(e.target.value) || 0)} style={{ width: "100%", padding: 8, background: "#1a1a1a", border: "1px solid #333", color: "#fff", textAlign: "center", borderRadius: 4 }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: "#aaa" }}>Size XL</span>
                    <input type="number" min="0" value={stockXL} onChange={(e) => setStockXL(parseInt(e.target.value) || 0)} style={{ width: "100%", padding: 8, background: "#1a1a1a", border: "1px solid #333", color: "#fff", textAlign: "center", borderRadius: 4 }} />
                  </div>
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
