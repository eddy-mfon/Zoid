/* ZOID Concrete Ritual: checkout is the quiet handoff—focused, legible, and authenticated. */
import { useState, useEffect, useMemo } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  Check,
  LockKeyhole,
  ShoppingBag,
  Ticket,
  Trash2,
  GraduationCap,
  Truck,
  PhoneCall,
  MessageSquare
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { formatNaira, useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { nanoid } from "nanoid";
import {
  NIGERIAN_UNIVERSITIES,
  NIGERIAN_STATES,
  NIGERIAN_CITIES_BY_STATE
} from "@/lib/nigeriaLocations";

const MARK = "/zoid-logo.svg";

function generateOrderNumber() {
  return `ZD-${nanoid(6).toUpperCase()}`;
}

type DeliveryOptionType = "standard" | "express" | "pickup" | "not_mentioned";

interface DeliveryMethod {
  id: DeliveryOptionType;
  title: string;
  subtitle: string;
  fee: number;
}

const deliveryMethods: DeliveryMethod[] = [
  {
    id: "standard",
    title: "Standard Door / Campus Delivery",
    subtitle: "Lagos & University Campuses · 2-week guaranteed delivery",
    fee: 2500,
  },
  {
    id: "express",
    title: "Express Priority Dispatch",
    subtitle: "Expedited handling & priority courier tracking",
    fee: 4500,
  },
  {
    id: "pickup",
    title: "Self-Pickup Point",
    subtitle: "ZOID Lagos Archive Hub (Free pickup)",
    fee: 0,
  },
  {
    id: "not_mentioned",
    title: "Not Mentioned (Location Not Listed)",
    subtitle: "Outside standard zones or special regional logistics",
    fee: 0,
  },
];

export default function Checkout() {
  const [, navigate] = useLocation();
  const { bag, count, total, removeFromBag, clearBag } = useShop();
  const { user, isLoggedIn, addOrder } = useAuth();

  // AUTH GUARD: Unauthenticated users are immediately redirected to login
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout");
    }
  }, [isLoggedIn, navigate]);

  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(generateOrderNumber);
  const [orderDate] = useState(() =>
    new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })
  );

  // Snapshot of placed order for receipt display
  const [placedItems, setPlacedItems] = useState<typeof bag>([]);
  const [placedSubtotal, setPlacedSubtotal] = useState(0);

  // University student flag
  const [isStudent, setIsStudent] = useState(false);

  // Delivery option
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOptionType>("standard");

  // Form state
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    // General non-student address
    address: "",
    city: "Ikeja",
    state: "Lagos State",
    // Student specific address fields
    schoolName: "",
    hostelAndRoom: "",
    studentCityState: "Lagos State",
    // Shared notes
    notes: "",
  });

  // Pre-fill user details when logged in
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

  // Dynamically compute available cities for selected state
  const availableCities = useMemo(() => {
    return NIGERIAN_CITIES_BY_STATE[form.state] || NIGERIAN_CITIES_BY_STATE["Lagos State"] || [];
  }, [form.state]);

  const selectedMethod = deliveryMethods.find((m) => m.id === deliveryOption) || deliveryMethods[0];
  const deliveryFee = selectedMethod.fee;
  const grandTotal = total + deliveryFee;

  const fullDeliveryAddress = isStudent
    ? `${form.schoolName}, ${form.hostelAndRoom}, ${form.studentCityState}`
    : `${form.address}, ${form.city}, ${form.state}`;

  const whatsappMessage = encodeURIComponent(
    "I am contacting because my location is not on the deliverable locations and the link led me here"
  );
  const whatsappUrl = `https://wa.me/2349020711737?text=${whatsappMessage}`;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (bag.length === 0) return;

    // Snapshot items for receipt
    setPlacedItems([...bag]);
    setPlacedSubtotal(total);

    // Save order to AuthContext profile
    const savedOrder = addOrder({
      items: bag.map((item) => ({
        slug: item.slug,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        customization: item.customization,
      })),
      total: grandTotal,
      deliveryAddress: fullDeliveryAddress,
      deliveryMethod: selectedMethod.title,
      deliveryFee,
      isStudent,
    });

    setOrderNumber(savedOrder.id);
    setSubmitted(true);
    clearBag();
  }

  // If not logged in, render null while redirection takes effect
  if (!isLoggedIn) {
    return null;
  }

  // ── ORDER SUCCESS RECEIPT / TICKET ──────────────────────────────
  if (submitted) {
    return (
      <main className="checkout-page checkout-success" style={{ background: "#0d0d0d", color: "#f4f0ea", minHeight: "100vh", padding: "60px 20px 100px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Confirmation Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(231,25,75,0.15)",
                border: "2px solid var(--pink)",
                color: "var(--pink)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 16px",
              }}
            >
              <Check size={32} />
            </div>
            <p className="eyebrow" style={{ color: "var(--pink)", margin: "0 0 6px" }}>
              ORDER CONFIRMED & LOGGED
            </p>
            <h1 style={{ fontFamily: "Anton", fontSize: "clamp(36px, 6vw, 56px)", margin: "0 0 10px", color: "#fff", textTransform: "uppercase" }}>
              OFFICIAL RECEIPT
            </h1>
            <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>
              Order confirmation has been sent to <strong>{form.email}</strong>.
            </p>
          </div>

          {/* Official Order Receipt Card */}
          <div
            style={{
              background: "#141414",
              border: "1px solid #282828",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 18px 48px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header Ribbon */}
            <div
              style={{
                background: "var(--pink)",
                color: "#fff",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Ticket size={24} />
                <div>
                  <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.18em", opacity: 0.9 }}>RECEIPT / TICKET NO.</p>
                  <p style={{ margin: 0, fontFamily: "Anton", fontSize: 22, letterSpacing: "0.08em" }}>{orderNumber}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.14em", opacity: 0.9 }}>ORDER DATE</p>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>{orderDate}</p>
              </div>
            </div>

            {/* Individual Products Breakdown */}
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #222" }}>
              <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 700, margin: "0 0 18px" }}>
                INDIVIDUAL PRODUCTS & PRICING
              </p>

              <div style={{ display: "grid", gap: 16 }}>
                {placedItems.map((item, idx) => {
                  const unitPriceNum = Number(item.price.replace(/[^0-9]/g, "")) || 0;
                  const itemLineTotal = unitPriceNum * item.quantity;

                  return (
                    <div
                      key={`${item.slug}-${item.size}-${idx}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "12px 14px",
                        background: "#1c1c1c",
                        border: "1px solid #282828",
                        borderRadius: 6,
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 54, height: 68, objectFit: "cover", borderRadius: 4, background: "#0a0a0a" }}
                      />
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: 13, color: "#fff", display: "block", textTransform: "uppercase" }}>
                          {item.name}
                        </strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4, fontSize: 11, color: "#888" }}>
                          <span>Size: <strong style={{ color: "#fff" }}>{item.size}</strong></span>
                          <span>Qty: <strong style={{ color: "#fff" }}>{item.quantity}</strong></span>
                          <span>Unit Price: <strong style={{ color: "#fff" }}>{item.price}</strong></span>
                        </div>
                        {item.customization && (
                          <div style={{ marginTop: 6, fontSize: 10, color: "var(--pink)", background: "rgba(231,25,75,0.1)", padding: "3px 8px", borderRadius: 3, display: "inline-block" }}>
                            Customization: <strong>{item.customization}</strong>
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 9, color: "#777", display: "block" }}>TOTAL</span>
                        <strong style={{ fontSize: 14, color: "#fff", fontWeight: 700 }}>
                          {formatNaira(itemLineTotal)}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price & Delivery Fee Summary Breakdown */}
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #222", background: "#111" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginBottom: 8 }}>
                <span>Items Subtotal ({placedItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{formatNaira(placedSubtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginBottom: 8 }}>
                <span>Delivery Method: <strong>{selectedMethod.title}</strong></span>
                <span style={{ color: deliveryFee > 0 ? "#fff" : "#29a36a", fontWeight: 600 }}>
                  {deliveryFee > 0 ? formatNaira(deliveryFee) : "FREE / ₦0"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 12,
                  marginTop: 8,
                  borderTop: "1px dashed #333",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>
                  FINAL TOTAL CHARGED
                </span>
                <strong style={{ fontSize: 20, color: "var(--pink)", fontFamily: "Anton", letterSpacing: "0.05em" }}>
                  {formatNaira(placedSubtotal + deliveryFee)}
                </strong>
              </div>
            </div>

            {/* Customer & Delivery Address Details */}
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #222" }}>
              <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "#777", textTransform: "uppercase", margin: "0 0 12px" }}>
                RECIPIENT & DESTINATION DETAILS
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                <div>
                  <span style={{ fontSize: 10, color: "#666", display: "block" }}>CUSTOMER</span>
                  <strong style={{ fontSize: 13, color: "#fff" }}>{form.name}</strong>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#aaa" }}>{form.email}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#aaa" }}>{form.phone}</p>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: "#666", display: "block" }}>
                    {isStudent ? "CAMPUS HOSTEL LOCATION" : "DELIVERY ADDRESS"}
                  </span>
                  <p style={{ margin: 0, fontSize: 13, color: "#fff", fontWeight: 600, lineHeight: 1.4 }}>
                    {fullDeliveryAddress}
                  </p>
                  {form.notes && (
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--pink)" }}>
                      Instructions: "{form.notes}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Guarantee Note */}
            <div style={{ padding: "16px 28px", background: "rgba(41,163,106,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
              <Truck size={20} color="#29a36a" />
              <p style={{ margin: 0, fontSize: 11, color: "#dedede", lineHeight: 1.5 }}>
                <strong style={{ color: "#29a36a" }}>2-Week Delivery Guarantee:</strong> All orders are dispatched from Lagos and delivered within 14 days. Tracking details and dispatch updates will be sent to your email.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <Link className="pink-button" href="/profile" style={{ fontSize: 11 }}>
              View My Account & Orders <ArrowDownRight size={15} />
            </Link>
            <Link className="ghost-button" href="/collection" style={{ fontSize: 11 }}>
              Continue Browsing Collection
            </Link>
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
        <span className="secure-label">
          <LockKeyhole size={13} /> SECURE CHECKOUT
        </span>
      </header>

      <div className="checkout-wrap">
        <div className="checkout-intro">
          <Link className="back-link" href="/collection">
            <ArrowLeft size={15} /> Back to collection
          </Link>
          <p className="eyebrow">CHECKOUT / {count.toString().padStart(2, "0")} PIECES</p>
          <h1>
            MAKE THE
            <br />
            <span>HANDOFF.</span>
          </h1>
          <p>
            Every order ships from Lagos and is delivered within two weeks. Your selected sizes are reserved once the order is submitted.
          </p>
        </div>

        <div className="checkout-grid">
          {/* Form */}
          <form className="checkout-form" onSubmit={submit}>
            {/* 01 / YOUR DETAILS */}
            <div className="form-section">
              <p className="eyebrow">01 / YOUR DETAILS</p>
              <label>
                Full name *
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Chukwudi Adeleke"
                />
              </label>
              <label>
                Email address *
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="e.g. adeleke@example.com"
                />
              </label>
              <label>
                Phone number *
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="e.g. +234 802 345 6789"
                />
              </label>
            </div>

            {/* 02 / DELIVERY ADDRESS & UNIVERSITY STUDENT TOGGLE */}
            <div className="form-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <p className="eyebrow" style={{ margin: 0 }}>02 / DELIVERY ADDRESS</p>
              </div>

              {/* University Student Checkbox */}
              <div
                style={{
                  padding: "12px 14px",
                  background: isStudent ? "rgba(231,25,75,0.08)" : "#fff",
                  border: isStudent ? "1px solid var(--pink)" : "1px solid #d5d0c8",
                  borderRadius: 4,
                  marginBottom: 14,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 12,
                    color: isStudent ? "var(--pink)" : "#333",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isStudent}
                    onChange={(e) => setIsStudent(e.target.checked)}
                    style={{ width: 17, height: 17, accentColor: "var(--pink)", cursor: "pointer" }}
                  />
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <GraduationCap size={16} /> Are you a university student?
                  </span>
                </label>
                <p style={{ margin: "4px 0 0 27px", fontSize: 10, color: "#777", textTransform: "none" }}>
                  Tick this if you're delivering to a university campus, hostel, or faculty block.
                </p>
              </div>

              {/* DYNAMIC FORM FIELDS BASED ON STUDENT STATUS */}
              {isStudent ? (
                <>
                  {/* School Name with searchable datalist containing all Nigerian Universities */}
                  <label>
                    School name *
                    <div style={{ position: "relative" }}>
                      <input
                        required
                        list="universities-list"
                        value={form.schoolName}
                        onChange={(e) => update("schoolName", e.target.value)}
                        placeholder="Search or type university name (e.g. UNILAG, UI, OAU, Covenant)"
                        autoComplete="off"
                      />
                      <datalist id="universities-list">
                        {NIGERIAN_UNIVERSITIES.map((uni) => (
                          <option key={uni} value={uni} />
                        ))}
                      </datalist>
                    </div>
                  </label>

                  {/* Campus State with searchable datalist containing all 36 States + FCT */}
                  <label>
                    Campus State / City *
                    <div style={{ position: "relative" }}>
                      <input
                        required
                        list="student-states-list"
                        value={form.studentCityState}
                        onChange={(e) => update("studentCityState", e.target.value)}
                        placeholder="Select or type campus state (e.g. Lagos State, Oyo State)"
                        autoComplete="off"
                      />
                      <datalist id="student-states-list">
                        {NIGERIAN_STATES.map((stateName) => (
                          <option key={stateName} value={stateName} />
                        ))}
                      </datalist>
                    </div>
                  </label>

                  <label>
                    Hostel name and room details *
                    <input
                      required
                      value={form.hostelAndRoom}
                      onChange={(e) => update("hostelAndRoom", e.target.value)}
                      placeholder="e.g. Moremi Hall, Block B, Room 204"
                    />
                  </label>

                  <label>
                    Order instructions (optional)
                    <input
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="e.g. Call upon arrival at security gate, deliver after 4 PM"
                    />
                  </label>
                </>
              ) : (
                <>
                  {/* State with searchable datalist */}
                  <label>
                    State *
                    <div style={{ position: "relative" }}>
                      <input
                        required
                        list="states-list"
                        value={form.state}
                        onChange={(e) => update("state", e.target.value)}
                        placeholder="Select or type state (e.g. Lagos State, Rivers State)"
                        autoComplete="off"
                      />
                      <datalist id="states-list">
                        {NIGERIAN_STATES.map((stateName) => (
                          <option key={stateName} value={stateName} />
                        ))}
                      </datalist>
                    </div>
                  </label>

                  {/* City with searchable datalist populated for that selected state */}
                  <label>
                    City / Area in {form.state || "State"} *
                    <div style={{ position: "relative" }}>
                      <input
                        required
                        list="cities-list"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        placeholder={
                          availableCities.length > 0
                            ? `Select or type city (e.g. ${availableCities.slice(0, 2).join(", ")})`
                            : "Select or type city / LGA"
                        }
                        autoComplete="off"
                      />
                      <datalist id="cities-list">
                        {availableCities.map((cityName) => (
                          <option key={cityName} value={cityName} />
                        ))}
                      </datalist>
                    </div>
                  </label>

                  <label>
                    Street address *
                    <textarea
                      required
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      placeholder="e.g. 14 Adeola Odeku Street, Victoria Island"
                      rows={3}
                    />
                  </label>

                  <label>
                    Order instructions (optional)
                    <input
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="e.g. Leave package with front desk concierge"
                    />
                  </label>
                </>
              )}
            </div>

            {/* 03 / DELIVERY & PICKUP OPTIONS */}
            <div className="form-section">
              <p className="eyebrow">03 / SHIPPING & PICKUP METHOD</p>

              <div style={{ display: "grid", gap: 10 }}>
                {deliveryMethods.map((method) => {
                  const isSelected = deliveryOption === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setDeliveryOption(method.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        background: isSelected ? "rgba(231,25,75,0.08)" : "#fff",
                        border: isSelected ? "1.5px solid var(--pink)" : "1px solid #cbc5bd",
                        borderRadius: 4,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <input
                          type="radio"
                          name="deliveryOption"
                          checked={isSelected}
                          onChange={() => setDeliveryOption(method.id)}
                          style={{ marginTop: 2, accentColor: "var(--pink)", cursor: "pointer" }}
                        />
                        <div>
                          <strong style={{ fontSize: 12, color: "#111", display: "block" }}>{method.title}</strong>
                          <span style={{ fontSize: 11, color: "#666" }}>{method.subtitle}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: method.fee > 0 ? "var(--pink)" : "#29a36a" }}>
                          {method.fee > 0 ? formatNaira(method.fee) : "FREE"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* "Not Mentioned" WhatsApp Contact Prompt */}
              {deliveryOption === "not_mentioned" && (
                <div
                  style={{
                    marginTop: 14,
                    padding: "16px",
                    background: "#fff",
                    border: "1px solid #e7194b",
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <PhoneCall size={18} color="var(--pink)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ margin: 0, fontSize: 12, color: "#333", lineHeight: 1.5 }}>
                      Is your city or state not listed? Reach out to our logistics desk to arrange custom delivery to your location.
                    </p>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "#25D366",
                      color: "#fff",
                      padding: "10px 16px",
                      borderRadius: 4,
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      textDecoration: "none",
                    }}
                  >
                    <MessageSquare size={16} /> Contact Us via WhatsApp (+234 9020711737)
                  </a>
                </div>
              )}
            </div>

            {/* Payment info note */}
            <div
              style={{
                padding: "16px 18px",
                background: "#f9f7f4",
                border: "1px solid #e2ddd7",
                borderRadius: 4,
                marginBottom: 20,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: "#6c665f", lineHeight: 1.6 }}>
                <strong style={{ color: "#333" }}>Payment on delivery & Bank Transfer</strong>
                <br />
                Our team will contact you to confirm payment details and dispatch timing upon receiving your order.
              </p>
            </div>

            <button
              className="pink-button checkout-submit"
              type="submit"
              disabled={bag.length === 0}
              style={{ opacity: bag.length === 0 ? 0.5 : 1 }}
            >
              {bag.length === 0 ? "No items in bag" : <>Confirm Order ({formatNaira(grandTotal)}) <Check size={16} /></>}
            </button>
          </form>

          {/* Order Summary */}
          <aside className="checkout-summary">
            <div className="summary-head">
              <p className="eyebrow">YOUR SELECTION</p>
              <strong>{count.toString().padStart(2, "0")} PIECES</strong>
            </div>

            {bag.length ? (
              bag.map((item, idx) => (
                <div className="summary-item" key={`${item.slug}-${item.size}-${idx}`}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      Size {item.size} · Qty {item.quantity}
                    </small>
                    {item.customization && (
                      <small style={{ color: "var(--pink)", fontWeight: 600 }}>
                        Custom: {item.customization}
                      </small>
                    )}
                    <span>{item.price}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromBag(item.slug, item.size, item.customization)}
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

            {/* Price Calculations */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #d5d0c8" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 8 }}>
                <span>Items Subtotal</span>
                <strong>{formatNaira(total)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 8 }}>
                <span>Delivery Fee ({selectedMethod.title.split("/")[0].trim()})</span>
                <strong style={{ color: deliveryFee > 0 ? "var(--pink)" : "#29a36a" }}>
                  {deliveryFee > 0 ? formatNaira(deliveryFee) : "FREE"}
                </strong>
              </div>
              <div className="summary-total" style={{ borderTop: "1px solid #d5d0c8", paddingTop: 12, marginTop: 12 }}>
                <span>Total Amount</span>
                <strong style={{ fontSize: 20, color: "var(--pink)" }}>{formatNaira(grandTotal)}</strong>
              </div>
            </div>

            <p className="summary-delivery">
              Delivery / 2 weeks
              <br />
              Shipping confirmation follows your order.
            </p>

            {/* Delivery guarantee badge */}
            <div
              style={{
                marginTop: 16,
                padding: "10px 14px",
                background: "rgba(41,163,106,0.08)",
                border: "1px solid rgba(41,163,106,0.25)",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Check size={14} style={{ color: "#29a36a", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 10, color: "#1a8a52", lineHeight: 1.5 }}>
                <strong>2-week delivery guarantee</strong>
                <br />
                All orders delivered within 14 days.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
