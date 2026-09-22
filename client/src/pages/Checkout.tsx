/* ZOID Concrete Ritual: checkout is the quiet handoff—focused, legible, and still rooted in the field archive. */
import { useState, useEffect } from "react";
import { ArrowDownRight, ArrowLeft, Check, LockKeyhole, LogIn, ShoppingBag, Ticket, Trash2, UserCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { formatNaira, useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { nanoid } from "nanoid";

const MARK = "/zoid-logo.svg";

function generateOrderNumber() {
  return `ZD-${nanoid(6).toUpperCase()}`;
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { bag, count, total, removeFromBag, clearBag } = useShop();
  const { user, isLoggedIn, openAuthModal, addOrder } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(generateOrderNumber);
  const [orderDate] = useState(() => new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" }));

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    state: "Lagos State",
    notes: "",
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email,
        phone: prev.phone || user.phone,
      }));
    }
  }, [user]);

  function update(field: keyof typeof form, value: string) {
    setForm((state) => ({ ...state, [field]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (bag.length === 0) return;

    // Save order to AuthContext profile if logged in or active
    const savedOrder = addOrder({
      items: bag.map((item) => ({
        slug: item.slug,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      total,
      deliveryAddress: `${form.address}, ${form.state}`,
    });

    setOrderNumber(savedOrder.id);
    setSubmitted(true);
    clearBag();
  }

  // ── ORDER SUCCESS TICKET ──────────────────────────────────────────
  if (submitted) {
    return (
      <main className="checkout-page checkout-success" style={{ background: "#f2f0eb", color: "#111" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px" }}>
          {/* Confirmation check */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
            <div className="success-mark"><Check size={28} /></div>
            <div>
              <p className="eyebrow" style={{ color: "#777", margin: 0 }}>ORDER CONFIRMED</p>
              <p style={{ color: "#333", fontSize: 13, margin: "4px 0 0" }}>Confirmation email sent to <strong>{form.email}</strong>.</p>
            </div>
          </div>

          {/* Order Ticket */}
          <div style={{
            background: "#fff",
            border: "1px solid #d5d0c8",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}>
            {/* Ticket header */}
            <div style={{
              background: "var(--pink)", color: "#fff",
              padding: "20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Ticket size={22} />
                <div>
                  <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.18em", opacity: 0.8 }}>ORDER TICKET</p>
                  <p style={{ margin: 0, fontFamily: "Anton", fontSize: 20, letterSpacing: "0.08em" }}>{orderNumber}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.12em", opacity: 0.8 }}>ORDER DATE</p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600 }}>{orderDate}</p>
              </div>
            </div>

            {/* Customer info */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8e3dc" }}>
              <p style={{ fontSize: 9, letterSpacing: "0.16em", color: "#999", marginBottom: 10 }}>CUSTOMER DETAILS</p>
              <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14 }}>{form.name}</p>
              <p style={{ margin: "0 0 2px", fontSize: 12, color: "#666" }}>{form.email}</p>
              <p style={{ margin: "0 0 2px", fontSize: 12, color: "#666" }}>{form.phone}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{form.address}, {form.state}</p>
            </div>

            {/* Profile sync note */}
            <div style={{ padding: "16px 24px", background: "rgba(231,25,75,0.06)", borderBottom: "1px solid #e8e3dc", display: "flex", alignItems: "center", gap: 10 }}>
              <UserCheck size={18} color="var(--pink)" />
              <p style={{ margin: 0, fontSize: 11, color: "#333" }}>
                This order has been saved to your account. You can view its delivery status anytime on your <Link href="/profile" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "underline" }}>Profile Page</Link>.
              </p>
            </div>

            {/* Delivery info */}
            <div style={{ padding: "20px 24px", background: "#faf9f7" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.16em", color: "#999", margin: 0 }}>DELIVERY</p>
                <span style={{ background: "rgba(41,163,106,0.15)", color: "#1a8a52", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.1em" }}>
                  2-WEEK GUARANTEE
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                Ships from Lagos. Delivery within 14 days of order confirmation. Tracking details will be sent to your email.
              </p>
            </div>
          </div>

          {/* Dashed ticket bottom */}
          <div style={{
            borderLeft: "1px dashed #d5d0c8", borderRight: "1px dashed #d5d0c8", borderBottom: "1px dashed #d5d0c8",
            padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "#fff", borderRadius: "0 0 8px 8px",
            marginTop: -1,
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.12em", color: "#999" }}>TOTAL CHARGED</p>
              <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "var(--pink)" }}>{formatNaira(total || 0)}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link className="pink-button" href="/profile" style={{ fontSize: 11 }}>
                View My Profile <ArrowDownRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── CHECKOUT FORM ──────────────────────────────────────────────────
  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <Link className="brand" href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={MARK} alt="" style={{ height: 16 }} />
          <span style={{ fontWeight: 700, letterSpacing: "0.2em", fontSize: 16 }}>ZOID</span>
        </Link>
        <span className="secure-label"><LockKeyhole size={13} /> SECURE CHECKOUT</span>
      </header>

      <div className="checkout-wrap">
        <div className="checkout-intro">
          <Link className="back-link" href="/collection"><ArrowLeft size={15} /> Back to collection</Link>
          <p className="eyebrow">CHECKOUT / {count.toString().padStart(2, "0")} PIECES</p>
          <h1>MAKE THE<br /><span>HANDOFF.</span></h1>
          <p>Every order ships from Lagos and is delivered within two weeks. Your selected sizes are reserved once the order is submitted.</p>
        </div>

        <div className="checkout-grid">
          {/* Form */}
          <form className="checkout-form" onSubmit={submit}>
            {/* Account Status Banner */}
            {isLoggedIn ? (
              <div style={{
                background: "rgba(41,163,106,0.1)", border: "1px solid rgba(41,163,106,0.3)",
                padding: "12px 16px", borderRadius: 4, marginBottom: 24,
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserCheck size={16} color="#29a36a" />
                  <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>Logged in as {user?.name}</span>
                </div>
                <span style={{ fontSize: 9, color: "#29a36a", letterSpacing: "0.12em", fontWeight: 700 }}>DETAILS AUTO-FILLED</span>
              </div>
            ) : (
              <div style={{
                background: "rgba(231,25,75,0.08)", border: "1px solid rgba(231,25,75,0.25)",
                padding: "14px 16px", borderRadius: 4, marginBottom: 24,
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10
              }}>
                <span style={{ fontSize: 11, color: "#e8e2da" }}>
                  Have an account? Log in to auto-fill details & track your orders.
                </span>
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  style={{
                    background: "var(--pink)", color: "#fff", border: "none",
                    padding: "5px 12px", borderRadius: 3, fontSize: 10,
                    fontWeight: 700, letterSpacing: "0.12em", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4
                  }}
                >
                  <LogIn size={12} /> Log In / Sign Up
                </button>
              </div>
            )}

            <div className="form-section">
              <p className="eyebrow">01 / YOUR DETAILS</p>
              <label>
                Full name *
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                />
              </label>
              <label>
                Email address *
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Phone number *
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+234 XXX XXX XXXX"
                />
              </label>
            </div>

            <div className="form-section">
              <p className="eyebrow">02 / DELIVERY</p>
              <label>
                Delivery address *
                <textarea
                  required
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="House number, street, area"
                  rows={3}
                />
              </label>
              <label>
                State / City *
                <input
                  required
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  placeholder="e.g. Lagos State"
                />
              </label>
              <label>
                Order notes (optional)
                <input
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Any special instructions for delivery"
                />
              </label>
            </div>

            {/* Payment info note */}
            <div style={{
              padding: "16px 18px", background: "#f9f7f4", border: "1px solid #e2ddd7", borderRadius: 4, marginBottom: 20,
            }}>
              <p style={{ margin: 0, fontSize: 11, color: "#6c665f", lineHeight: 1.6 }}>
                <strong style={{ color: "#333" }}>Payment on delivery & Bank Transfer</strong><br />
                Our team will contact you to confirm payment details upon receiving your order.
              </p>
            </div>

            <button
              className="pink-button checkout-submit"
              type="submit"
              disabled={bag.length === 0}
              style={{ opacity: bag.length === 0 ? 0.5 : 1 }}
            >
              {bag.length === 0 ? "No items in bag" : <>Confirm Order <Check size={16} /></>}
            </button>
          </form>

          {/* Order Summary */}
          <aside className="checkout-summary">
            <div className="summary-head">
              <p className="eyebrow">YOUR SELECTION</p>
              <strong>{count.toString().padStart(2, "0")} PIECES</strong>
            </div>

            {bag.length ? (
              bag.map((item) => (
                <div className="summary-item" key={`${item.slug}-${item.size}`}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.size} · Qty {item.quantity}</small>
                    <span>{item.price}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromBag(item.slug, item.size)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="checkout-empty">
                <ShoppingBag size={28} style={{ color: "#bbb", marginBottom: 8 }} />
                <p>Your bag is empty.</p>
                <button type="button" onClick={() => navigate("/collection")} className="line-link">
                  Browse the edit <ArrowLeft size={14} />
                </button>
              </div>
            )}

            <div className="summary-total">
              <span>Subtotal</span>
              <strong>{formatNaira(total)}</strong>
            </div>
            <p className="summary-delivery">
              Delivery / 2 weeks<br />Shipping confirmation follows your order.
            </p>

            {/* Delivery guarantee badge */}
            <div style={{
              marginTop: 16, padding: "10px 14px", background: "rgba(41,163,106,0.08)",
              border: "1px solid rgba(41,163,106,0.25)", borderRadius: 4,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <Check size={14} style={{ color: "#29a36a", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 10, color: "#1a8a52", lineHeight: 1.5 }}>
                <strong>2-week delivery guarantee</strong><br />All orders delivered within 14 days.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
