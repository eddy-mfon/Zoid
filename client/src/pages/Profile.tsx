/* ZOID Storefront — User Profile & Order History Page */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/lib/catalog";
import { useShop } from "@/contexts/ShopContext";
import {
  ArrowLeft, Heart, LogOut, PackageCheck, ShoppingBag,
  Ticket, User, ArrowDownRight, Check, ChevronRight, Menu, X
} from "lucide-react";
import { toast } from "sonner";

const MARK = "/zoid-logo.svg";

export default function Profile() {
  const [, navigate] = useLocation();
  const { user, isLoggedIn, logout, wishlist, toggleWishlist } = useAuth();
  const { addToBag, count: cartCount } = useShop();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist">("orders");

  if (!isLoggedIn || !user) {
    return (
      <main className="zoid-shell collection-page" style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center", padding: "60px 24px", maxWidth: 440 }}>
          <User size={48} color="var(--pink)" style={{ marginBottom: 16 }} />
          <h1 style={{ fontFamily: "Anton", fontSize: 40, margin: "0 0 16px" }}>ACCOUNT LOGIN REQUIRED</h1>
          <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            Please log in or create an account to view your order history, delivery status, and saved wishlist.
          </p>
          <button
            className="pink-button"
            onClick={() => navigate("/")}
            style={{ width: "100%", justifyContent: "center" }}
          >
            Return to Storefront <ArrowLeft size={16} />
          </button>
        </div>
      </main>
    );
  }

  // Find wishlist products
  const wishlistProducts = products.filter((p) => wishlist.includes(p.slug));

  return (
    <main className="zoid-shell collection-page" style={{ minHeight: "100vh", background: "#0b0b0b", color: "#f4f0ea" }}>
      {/* Navbar */}
      <header className="topbar">
        <Link className="brand" href="/">
          <img src={MARK} alt="ZOID" />
          <span>ZOID</span>
          <i />
        </Link>
        <div className="nav-frame">
          <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
            <Link href="/">Home</Link>
            <Link href="/collection">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/archives">Archives</Link>
          </nav>
        </div>
        <div className="top-actions action-rail">
          <Link href="/collection" className="bag-button">
            <ShoppingBag size={15} /> {cartCount} Bag
          </Link>
          <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Header Banner */}
      <div className="collection-intro" style={{ background: "#141414", borderBottom: "1px solid #222", padding: "100px clamp(24px,6vw,96px) 50px" }}>
        <div>
          <Link className="back-link" href="/collection">
            <ArrowLeft size={15} /> Continue Shopping
          </Link>
          <p className="eyebrow" style={{ color: "var(--pink)" }}>COMMUNITY MEMBER / PROFILE</p>
          <h1 style={{ color: "#fff" }}>
            MY<br /><span>ACCOUNT.</span>
          </h1>
        </div>

        {/* User Card */}
        <div style={{
          background: "#1c1c1c", border: "1px solid #333", borderRadius: 6,
          padding: 24, minWidth: 280, display: "flex", flexDirection: "column", gap: 12
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: "var(--pink)",
              color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 18
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong style={{ fontSize: 16, color: "#fff", display: "block" }}>{user.name}</strong>
              <small style={{ color: "#888", fontSize: 11 }}>{user.email}</small>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa" }}>
            <span>Phone: {user.phone}</span>
            <span>Joined: {user.createdAt}</span>
          </div>

          <button
            onClick={() => { logout(); navigate("/"); }}
            style={{
              marginTop: 4, background: "rgba(231,25,75,0.1)", border: "1px solid rgba(231,25,75,0.3)",
              color: "var(--pink)", padding: "8px 12px", borderRadius: 4, cursor: "pointer",
              fontSize: 10, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6
            }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <section style={{ padding: "40px clamp(24px, 6vw, 96px) 120px" }}>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 16, borderBottom: "1px solid #222", paddingBottom: 16, marginBottom: 36 }}>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "10px 24px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
              fontWeight: 700, borderRadius: 4, display: "flex", alignItems: "center", gap: 8,
              background: activeTab === "orders" ? "var(--pink)" : "#161616",
              color: activeTab === "orders" ? "#fff" : "#888",
              border: "none", cursor: "pointer"
            }}
          >
            <PackageCheck size={16} /> My Orders ({user.orders.length})
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            style={{
              padding: "10px 24px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
              fontWeight: 700, borderRadius: 4, display: "flex", alignItems: "center", gap: 8,
              background: activeTab === "wishlist" ? "var(--pink)" : "#161616",
              color: activeTab === "wishlist" ? "#fff" : "#888",
              border: "none", cursor: "pointer"
            }}
          >
            <Heart size={16} /> Saved Wishlist ({wishlist.length})
          </button>
        </div>

        {/* ── ORDERS HISTORY TAB ───────────────────────── */}
        {activeTab === "orders" && (
          <div>
            {user.orders.length > 0 ? (
              <div style={{ display: "grid", gap: 24 }}>
                {user.orders.map((order) => (
                  <div key={order.id} style={{ background: "#141414", border: "1px solid #262626", borderRadius: 8, overflow: "hidden" }}>
                    {/* Order Header */}
                    <div style={{
                      background: "#1a1a1a", borderBottom: "1px solid #262626",
                      padding: "18px 24px", display: "flex", justifyContent: "space-between",
                      alignItems: "center", flexWrap: "wrap", gap: 12
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Ticket size={20} color="var(--pink)" />
                        <div>
                          <span style={{ fontSize: 9, color: "#888", letterSpacing: "0.14em", display: "block" }}>ORDER TICKET</span>
                          <strong style={{ fontFamily: "Anton", fontSize: 18, color: "#fff", letterSpacing: "0.08em" }}>{order.id}</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <span style={{ fontSize: 11, color: "#888" }}>Date: {order.date}</span>
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                          background: order.status === "Delivered" ? "rgba(41,163,106,0.15)" : "rgba(231,25,75,0.15)",
                          color: order.status === "Delivered" ? "#29a36a" : "var(--pink)",
                          letterSpacing: "0.1em"
                        }}>
                          {order.status.toUpperCase()} (2-WEEK DELIVERY)
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div style={{ padding: 24, borderBottom: "1px solid #222" }}>
                      <p style={{ fontSize: 9, letterSpacing: "0.16em", color: "#666", marginBottom: 16 }}>ITEMS IN THIS ORDER</p>
                      <div style={{ display: "grid", gap: 16 }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <img src={item.image} alt={item.name} style={{ width: 56, height: 68, objectFit: "cover", borderRadius: 4, background: "#0c0c0c" }} />
                            <div style={{ flex: 1 }}>
                              <strong style={{ fontSize: 13, color: "#fff", display: "block", textTransform: "uppercase" }}>{item.name}</strong>
                              <span style={{ fontSize: 11, color: "#888" }}>Size {item.size} · Quantity: {item.quantity}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--pink)" }}>{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary Footer */}
                    <div style={{ padding: "16px 24px", background: "#0e0e0e", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <span style={{ fontSize: 9, color: "#666", letterSpacing: "0.12em", display: "block" }}>DELIVERY DESTINATION</span>
                        <span style={{ fontSize: 12, color: "#aaa" }}>{order.deliveryAddress}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 9, color: "#666", letterSpacing: "0.12em", display: "block" }}>TOTAL CHARGED</span>
                        <strong style={{ fontSize: 16, color: "#fff" }}>{order.formattedTotal}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "80px 0", textAlign: "center", color: "#888" }}>
                <PackageCheck size={42} style={{ marginBottom: 12, color: "#444" }} />
                <h3 style={{ fontFamily: "Anton", fontSize: 24, color: "#fff", margin: "0 0 8px" }}>NO ORDERS PLACED YET</h3>
                <p style={{ fontSize: 13, color: "#666", maxWidth: 360, margin: "0 auto 24px" }}>
                  Your order history will appear here as soon as you complete a purchase.
                </p>
                <Link className="pink-button" href="/collection">
                  Explore Shop Catalogue <ArrowDownRight size={16} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── WISHLIST TAB ─────────────────────────────── */}
        {activeTab === "wishlist" && (
          <div>
            {wishlistProducts.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
                {wishlistProducts.map((p) => (
                  <div key={p.slug} style={{ background: "#141414", border: "1px solid #242424", borderRadius: 6, overflow: "hidden" }}>
                    <Link href={`/product/${p.slug}`}>
                      <img src={p.image} alt={p.name} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
                    </Link>
                    <div style={{ padding: 18 }}>
                      <span style={{ fontSize: 8, color: "var(--pink)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
                        {p.category}
                      </span>
                      <strong style={{ fontSize: 14, color: "#fff", display: "block", margin: "4px 0 10px", textTransform: "uppercase" }}>
                        {p.name}
                      </strong>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #222", paddingTop: 12 }}>
                        <strong style={{ fontSize: 14, color: "var(--pink)" }}>{p.price}</strong>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            className="pink-button small"
                            onClick={() => addToBag(p, p.sizes[0])}
                          >
                            Add to Bag
                          </button>
                          <button
                            onClick={() => toggleWishlist(p.slug)}
                            style={{ background: "none", border: "1px solid #333", color: "#888", padding: "6px 8px", borderRadius: 3, cursor: "pointer" }}
                            title="Remove from wishlist"
                          >
                            <Heart size={14} fill="currentColor" color="var(--pink)" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "80px 0", textAlign: "center", color: "#888" }}>
                <Heart size={42} style={{ marginBottom: 12, color: "#444" }} />
                <h3 style={{ fontFamily: "Anton", fontSize: 24, color: "#fff", margin: "0 0 8px" }}>YOUR WISHLIST IS EMPTY</h3>
                <p style={{ fontSize: 13, color: "#666", maxWidth: 360, margin: "0 auto 24px" }}>
                  Save your favorite retro kits and special activewear to keep track of items you love.
                </p>
                <Link className="pink-button" href="/collection">
                  Browse Collection <ArrowDownRight size={16} />
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-topline">
          <span>ZOID / LAGOS</span>
          <span>ACCOUNT & PROFILE</span>
        </div>
        <div className="footer-core">
          <Link className="footer-wordmark" href="/">
            <img src={MARK} alt="" />
            <span>ZOID</span>
          </Link>
          <p>For the ones still rising.</p>
          <Link className="footer-cta" href="/collection">
            Shop the Edit <ArrowDownRight size={16} />
          </Link>
        </div>
        <div className="footer-bottom">
          <span>© ZOID STUDIOS / 2026</span>
          <span>Built on grit • Worn with intent</span>
        </div>
      </footer>
    </main>
  );
}
