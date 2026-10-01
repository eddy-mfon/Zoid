/* ZOID Order Review: the final ticket view — full summary before the real handoff */
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  LockKeyhole,
  Ticket,
  Truck,
  Zap,
  GraduationCap,
  Home,
  MapPin,
  Building2,
  ShoppingBag,
  User,
  X,
  AlertOctagon,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { formatNaira, useShop, type BagItem } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { nanoid } from "nanoid";
import type { CheckoutDraft } from "./Checkout";

const MARK = "/zoid-logo.svg";
const JERSEY_CUSTOMIZATION_COST = 2000;

function generateOrderNumber() {
  return `ZD-${nanoid(6).toUpperCase()}`;
}

/** Resolve a human-readable delivery address from the draft */
function resolveAddress(draft: CheckoutDraft): string {
  if (draft.deliveryOption === "standard") {
    if (draft.standardSubType === "university") {
      return `${draft.schoolName}, ${draft.hostelAndRoom}, ${draft.studentCityState}`;
    }
    if (draft.standardSubType === "given_address") {
      return `${draft.address}, ${draft.city}, ${draft.state}`;
    }
    return "—";
  }
  if (draft.deliveryOption === "express") {
    return `${draft.expressAddress}, ${draft.expressCity}, ${draft.expressState}`;
  }
  if (draft.deliveryOption === "pickup") {
    return `GUO Terminal — ${draft.pickupTerminal || "Lagos Hub"} (${draft.pickupState || "Lagos"})`;
  }
  return "Custom / Not listed — via WhatsApp";
}

/** Resolve a human-friendly delivery label */
function resolveDeliveryLabel(draft: CheckoutDraft): { label: string; icon: React.ReactNode } {
  if (draft.deliveryOption === "standard") {
    const sub =
      draft.standardSubType === "university"
        ? "University Campus"
        : draft.standardSubType === "given_address"
        ? "Given Address"
        : "";
    return { label: `Straight to your doorstep${sub ? ` · ${sub}` : ""}`, icon: <Home size={14} /> };
  }
  if (draft.deliveryOption === "express") {
    return { label: "Express — Get it faster", icon: <Zap size={14} /> };
  }
  if (draft.deliveryOption === "pickup") {
    return { label: `GUO Self-Pickup · ${draft.pickupState || "Lagos"}`, icon: <Building2 size={14} /> };
  }
  return { label: "Custom Location", icon: <MapPin size={14} /> };
}

/** Compute per-item price including any customization cost */
function computeItemTotal(item: BagItem): { basePrice: number; customizationCost: number; lineTotal: number } {
  const basePrice = Number(item.price.replace(/[^0-9]/g, "")) || 0;
  const customizationCost = (item.customization && item.style === "Jersey")
    ? JERSEY_CUSTOMIZATION_COST * item.quantity
    : 0;
  const lineTotal = basePrice * item.quantity + customizationCost;
  return { basePrice, customizationCost, lineTotal };
}

export default function OrderReview() {
  const [location, navigate] = useLocation();
  const { bag, total, clearBag } = useShop();
  const { user, isLoggedIn, addOrder } = useAuth();

  // Read stored checkout data
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [storedBag, setStoredBag] = useState<BagItem[]>([]);
  const [storedTotal, setStoredTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [storedMethodTitle, setStoredMethodTitle] = useState("");
  const [customizationTotal, setCustomizationTotal] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(
    () => location === "/order-failed" || location === "/payment-failed"
  );
  const [orderNumber] = useState(generateOrderNumber);
  const [orderDate] = useState(() =>
    new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })
  );

  // Sync failed page with URL
  useEffect(() => {
    if (location === "/order-failed" || location === "/payment-failed") {
      setPaymentFailed(true);
    }
  }, [location]);

  // Animate in
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout");
      return;
    }

    try {
      const rawDraft = sessionStorage.getItem("zoid_checkout_draft");
      const rawBag = sessionStorage.getItem("zoid_checkout_bag");
      const rawTotal = sessionStorage.getItem("zoid_checkout_total");
      const rawFee = sessionStorage.getItem("zoid_checkout_fee");
      const rawMethod = sessionStorage.getItem("zoid_checkout_method");
      const rawCustomization = sessionStorage.getItem("zoid_checkout_customization_total");

      if (!rawDraft || !rawBag) {
        navigate("/checkout");
        return;
      }

      const parsedDraft: CheckoutDraft = JSON.parse(rawDraft);
      const parsedBag: BagItem[] = JSON.parse(rawBag);
      const parsedTotal = Number(rawTotal) || 0;
      const parsedFee = Number(rawFee) || 0;
      const parsedMethod = rawMethod ? JSON.parse(rawMethod) : null;
      const parsedCustomization = Number(rawCustomization) || 0;

      setDraft(parsedDraft);
      setStoredBag(parsedBag);
      setStoredTotal(parsedTotal);
      setDeliveryFee(parsedFee);
      setStoredMethodTitle(parsedMethod?.title || "");
      setCustomizationTotal(parsedCustomization);
    } catch {
      navigate("/checkout");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !draft) return null;

  const grandTotal = storedTotal + deliveryFee + customizationTotal;
  const deliveryAddress = resolveAddress(draft);
  const { label: deliveryLabel, icon: deliveryIcon } = resolveDeliveryLabel(draft);
  const isExpress = draft.deliveryOption === "express";
  const isPickup = draft.deliveryOption === "pickup";

  const fadeIn = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.5s ease, transform 0.5s ease",
  };

  function confirmOrder() {
    if (!draft) return;
    const savedOrder = addOrder({
      items: storedBag.map((item) => ({
        slug: item.slug,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        customization: item.customization,
      })),
      total: grandTotal,
      deliveryAddress,
      deliveryMethod: storedMethodTitle || deliveryLabel,
      deliveryFee,
      isStudent: draft.standardSubType === "university",
    });

    // Clear session data
    sessionStorage.removeItem("zoid_checkout_draft");
    sessionStorage.removeItem("zoid_checkout_bag");
    sessionStorage.removeItem("zoid_checkout_total");
    sessionStorage.removeItem("zoid_checkout_fee");
    sessionStorage.removeItem("zoid_checkout_method");
    sessionStorage.removeItem("zoid_checkout_customization_total");

    clearBag();
    setSubmitted(true);
    void savedOrder;
  }

  // ── ORDER SUCCESS — SIMPLIFIED CONFIRMED SCREEN ──────────────────────
  if (submitted) {
    return (
      <main
        style={{
          background: "#0d0d0d",
          color: "#f4f0ea",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        {/* Animated check circle */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(231,25,75,0.12)",
            border: "2.5px solid var(--pink)",
            color: "var(--pink)",
            display: "grid",
            placeItems: "center",
            marginBottom: 24,
            animation: "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          <Check size={40} strokeWidth={2.5} />
        </div>

        <h1
          style={{
            fontFamily: "Anton",
            fontSize: "clamp(32px, 7vw, 60px)",
            margin: "0 0 12px",
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            animation: "fadeUp 0.5s ease 0.2s both",
          }}
        >
          Thank You!
        </h1>
        <p
          style={{
            color: "#888",
            fontSize: 14,
            maxWidth: 380,
            lineHeight: 1.6,
            margin: "0 0 36px",
            animation: "fadeUp 0.5s ease 0.3s both",
          }}
        >
          Your order has been placed. Our team will reach out shortly to confirm payment and dispatch.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 0.5s ease 0.4s both",
          }}
        >
          <Link
            href="/collection"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              background: "var(--pink)",
              color: "#fff",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
          >
            <ShoppingBag size={15} /> Keep Shopping
          </Link>
          <Link
            href="/profile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              background: "transparent",
              color: "#ccc",
              border: "1.5px solid #333",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
          >
            <User size={15} /> View My Orders
          </Link>
        </div>

        <style>{`
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.4); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>
    );
  }

  // ── PAYMENT FAILED SCREEN ──────────────────────────────────────────
  if (paymentFailed) {
    return (
      <main
        style={{
          background: "#0d0d0d",
          color: "#f4f0ea",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        {/* Large X circle */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(231,25,75,0.1)",
            border: "2.5px solid var(--pink)",
            color: "var(--pink)",
            display: "grid",
            placeItems: "center",
            marginBottom: 24,
            animation: "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          <X size={38} strokeWidth={2.5} />
        </div>

        <h1
          style={{
            fontFamily: "Anton",
            fontSize: "clamp(32px, 7vw, 60px)",
            margin: "0 0 12px",
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            animation: "fadeUp 0.5s ease 0.2s both",
          }}
        >
          Payment Failed
        </h1>

        <p
          style={{
            color: "#888",
            fontSize: 14,
            maxWidth: 400,
            lineHeight: 1.6,
            margin: "0 0 36px",
            animation: "fadeUp 0.5s ease 0.3s both",
          }}
        >
          Something went wrong and your payment could not be confirmed. Your order has{" "}
          <strong style={{ color: "#fff" }}>not been placed</strong>. Please try again or contact us.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 0.5s ease 0.4s both",
          }}
        >
          <button
            onClick={() => {
              setPaymentFailed(false);
              navigate("/order-review");
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              background: "var(--pink)",
              color: "#fff",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={15} /> Try Again
          </button>

          <a
            href="https://wa.me/2349020711737"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              background: "#25D366",
              color: "#fff",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <MessageSquare size={15} /> Contact Us on WhatsApp
          </a>

          <Link
            href="/checkout"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              background: "transparent",
              color: "#ccc",
              border: "1.5px solid #333",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={15} /> Back to Checkout
          </Link>
        </div>

        <style>{`
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.4); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>
    );
  }

  // ── ORDER REVIEW PAGE (pre-confirmation ticket) ──────────────────
  return (
    <main
      style={{
        background: "#0d0d0d",
        color: "#f4f0ea",
        minHeight: "100vh",
        padding: "60px 20px 100px",
      }}
    >
      {/* ── DEV: Simulate payment failure — remove before launch ── */}
      <button
        onClick={() => {
          setPaymentFailed(true);
          navigate("/order-failed");
        }}
        title="Simulate payment failure (dev only)"
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 999,
          background: "rgba(231,25,75,0.88)",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "7px 14px",
          fontSize: 10,
          letterSpacing: "0.12em",
          fontWeight: 700,
          cursor: "pointer",
          textTransform: "uppercase",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <X size={10} strokeWidth={3} /> Simulate Fail
      </button>

      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 48,
          maxWidth: 760,
          margin: "0 auto 48px",
          ...fadeIn,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <img src={MARK} alt="" style={{ height: 16 }} />
          <span style={{ fontWeight: 700, letterSpacing: "0.2em", fontSize: 16, color: "#fff" }}>
            ZOID
          </span>
        </Link>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "#aaa",
            letterSpacing: "0.1em",
          }}
        >
          <LockKeyhole size={12} /> ORDER REVIEW
        </span>
      </header>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Page heading */}
        <div style={{ marginBottom: 32, ...fadeIn, transitionDelay: "0.05s" }}>
          <button
            onClick={() => navigate("/checkout")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              color: "#aaa",
              fontSize: 12,
              cursor: "pointer",
              marginBottom: 16,
              padding: 0,
            }}
          >
            <ArrowLeft size={14} /> Back to checkout
          </button>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "var(--pink)",
              textTransform: "uppercase",
              margin: "0 0 6px",
            }}
          >
            STEP 2 OF 2 — REVIEW YOUR ORDER
          </p>
          <h1
            style={{
              fontFamily: "Anton",
              fontSize: "clamp(30px, 5vw, 48px)",
              margin: "0 0 10px",
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            CHECK EVERYTHING LOOKS RIGHT.
          </h1>
          <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>
            Here's a full summary of your order — prices, delivery costs, and your details. Once you're happy, tap <strong style={{ color: "#fff" }}>"Yes, Place My Order"</strong> to confirm.
          </p>
        </div>

        {/* Ticket card */}
        <div
          style={{
            background: "#141414",
            border: "1px solid #2a2a2a",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
            marginBottom: 28,
            ...fadeIn,
            transitionDelay: "0.1s",
          }}
        >
          {/* Ticket header */}
          <div
            style={{
              background: "var(--pink)",
              color: "#fff",
              padding: "20px 28px",
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
                <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.18em", opacity: 0.85 }}>
                  ORDER DRAFT / REVIEW
                </p>
                <p style={{ margin: 0, fontFamily: "Anton", fontSize: 20, letterSpacing: "0.08em" }}>
                  {orderNumber}
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.14em", opacity: 0.85 }}>DATE</p>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>{orderDate}</p>
            </div>
          </div>

          {/* Perforated divider */}
          <div
            style={{
              height: 0,
              borderTop: "2px dashed #2a2a2a",
              margin: "0 28px",
            }}
          />

          {/* Items list — distinct prices per line */}
          <div style={{ padding: "24px 28px", borderBottom: "1px solid #222" }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                color: "var(--pink)",
                textTransform: "uppercase",
                fontWeight: 700,
                margin: "0 0 18px",
              }}
            >
              WHAT YOU'RE ORDERING
            </p>
            <div style={{ display: "grid", gap: 14 }}>
              {storedBag.map((item, idx) => {
                const { basePrice, customizationCost, lineTotal } = computeItemTotal(item);
                return (
                  <div
                    key={`${item.slug}-${item.size}-${idx}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                      padding: "14px",
                      background: "#1c1c1c",
                      border: "1px solid #282828",
                      borderRadius: 6,
                      transition: "border-color 0.2s ease",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 56,
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 4,
                        background: "#0a0a0a",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong
                        style={{
                          fontSize: 13,
                          color: "#fff",
                          display: "block",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        {item.name}
                      </strong>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          fontSize: 11,
                          color: "#888",
                          marginBottom: 6,
                        }}
                      >
                        <span>
                          Size: <strong style={{ color: "#ddd" }}>{item.size}</strong>
                        </span>
                        <span>
                          Qty: <strong style={{ color: "#ddd" }}>{item.quantity}</strong>
                        </span>
                        <span>
                          Unit price: <strong style={{ color: "#ddd" }}>{item.price}</strong>
                        </span>
                      </div>

                      {/* Customization display */}
                      {item.customization && (
                        <div style={{ marginBottom: 4 }}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 10,
                              color: "var(--pink)",
                              background: "rgba(231,25,75,0.1)",
                              padding: "3px 10px",
                              borderRadius: 3,
                              marginBottom: 2,
                            }}
                          >
                            ✦ Jersey Customization: <strong>{item.customization}</strong>
                          </div>
                          {item.style === "Jersey" && (
                            <div style={{ fontSize: 10, color: "#666", marginLeft: 2 }}>
                              + {formatNaira(customizationCost)} (name & number · {item.quantity} × ₦{JERSEY_CUSTOMIZATION_COST.toLocaleString()})
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Per-line total (distinct for every item) */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ fontSize: 9, color: "#555", display: "block", marginBottom: 3 }}>LINE TOTAL</span>
                      <strong style={{ fontSize: 15, color: "#fff", fontFamily: "Anton", letterSpacing: "0.03em" }}>
                        {formatNaira(lineTotal)}
                      </strong>
                      {customizationCost > 0 && (
                        <span style={{ fontSize: 10, color: "#555", display: "block", marginTop: 2 }}>
                          incl. custom
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost breakdown */}
          <div
            style={{ padding: "20px 28px", borderBottom: "1px solid #222", background: "#111" }}
          >
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                color: "#777",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              PRICE BREAKDOWN
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#999",
                marginBottom: 10,
              }}
            >
              <span>Items subtotal ({storedBag.reduce((a, i) => a + i.quantity, 0)} items)</span>
              <span style={{ color: "#fff", fontWeight: 600 }}>{formatNaira(storedTotal)}</span>
            </div>

            {customizationTotal > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#999",
                  marginBottom: 10,
                  alignItems: "center",
                }}
              >
                <span>Jersey customization (name & number)</span>
                <span style={{ color: "var(--pink)", fontWeight: 600 }}>+{formatNaira(customizationTotal)}</span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#999",
                marginBottom: isExpress ? 6 : 14,
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {deliveryIcon}
                <span>
                  Delivery fee{" "}
                  <span style={{ color: "#666", fontSize: 11 }}>({deliveryLabel})</span>
                </span>
              </span>
              <span style={{ color: deliveryFee > 0 ? "#fff" : "#29a36a", fontWeight: 600, flexShrink: 0 }}>
                {deliveryFee > 0 ? formatNaira(deliveryFee) : (isPickup ? "Self-Pickup / ₦0" : "FREE / ₦0")}
              </span>
            </div>

            {isExpress && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "var(--pink)",
                  marginBottom: 14,
                  padding: "6px 10px",
                  background: "rgba(231,25,75,0.08)",
                  borderRadius: 3,
                }}
              >
                <Zap size={13} />
                <span>
                  <strong>Express:</strong> Your package will reach you sooner than our standard 2-week window. Priority handling fee included above.
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 14,
                borderTop: "2px dashed #2a2a2a",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                TOTAL YOU'LL PAY
              </span>
              <strong
                style={{
                  fontSize: 24,
                  color: "var(--pink)",
                  fontFamily: "Anton",
                  letterSpacing: "0.04em",
                }}
              >
                {formatNaira(grandTotal)}
              </strong>
            </div>
          </div>

          {/* Delivery & customer details */}
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #222" }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                color: "#777",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              YOUR DETAILS & DELIVERY DESTINATION
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              {/* Customer info */}
              <div>
                <span style={{ fontSize: 10, color: "#555", display: "block", marginBottom: 6 }}>
                  CUSTOMER
                </span>
                <strong style={{ fontSize: 14, color: "#fff", display: "block" }}>{draft.name}</strong>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#aaa" }}>{draft.email}</p>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#aaa" }}>{draft.phone}</p>
              </div>

              {/* Delivery destination */}
              <div>
                <span style={{ fontSize: 10, color: "#555", display: "block", marginBottom: 6 }}>
                  {draft.standardSubType === "university"
                    ? "CAMPUS / HOSTEL"
                    : draft.deliveryOption === "pickup"
                    ? "GUO PICKUP TERMINAL"
                    : "DELIVERY ADDRESS"}
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#fff",
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  {deliveryAddress}
                </p>
                {draft.standardSubType === "university" && (
                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#aaa",
                    }}
                  >
                    <GraduationCap size={12} color="var(--pink)" /> University campus delivery
                  </div>
                )}
                {draft.notes && (
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--pink)" }}>
                    Note: "{draft.notes}"
                  </p>
                )}
                {draft.pickupNote && draft.deliveryOption === "pickup" && (
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "#888" }}>
                    Note: "{draft.pickupNote}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery guarantee strip */}
          <div
            style={{
              padding: "14px 28px",
              background: "rgba(41,163,106,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Truck size={18} color="#29a36a" />
            <p style={{ margin: 0, fontSize: 11, color: "#ccc", lineHeight: 1.5 }}>
              <strong style={{ color: "#29a36a" }}>2-Week Delivery Guarantee.</strong>{" "}
              {isExpress
                ? "Express orders arrive faster than our standard window — we'll update you on dispatch."
                : isPickup
                ? "Your order will be ready for pickup at your chosen GUO terminal. We'll WhatsApp you when it's ready."
                : "Your order leaves Lagos within days and reaches you within 14 days. We'll email you the tracking info."}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            ...fadeIn,
            transitionDelay: "0.15s",
          }}
        >
          <button
            onClick={() => navigate("/checkout")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 20px",
              background: "none",
              border: "1.5px solid #444",
              borderRadius: 4,
              color: "#aaa",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.08em",
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
          >
            <ArrowLeft size={14} /> Go back & edit
          </button>

          <button
            onClick={confirmOrder}
            disabled={storedBag.length === 0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              background: "var(--pink)",
              border: "none",
              borderRadius: 4,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: storedBag.length === 0 ? "not-allowed" : "pointer",
              opacity: storedBag.length === 0 ? 0.5 : 1,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              flex: 1,
              justifyContent: "center",
              minWidth: 220,
              transition: "opacity 0.2s ease, transform 0.15s ease",
            }}
            onMouseEnter={(e) => { if (storedBag.length > 0) (e.target as HTMLButtonElement).style.transform = "scale(1.02)"; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.transform = "scale(1)"; }}
          >
            <Check size={16} />
            Yes, Place My Order — {formatNaira(grandTotal)}
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 16,
            fontSize: 11,
            color: "#666",
          }}
        >
          By placing your order you agree to our terms. Payment is collected on delivery or via bank transfer.
        </p>
      </div>
    </main>
  );
}
