/* ZOID Concrete Ritual: checkout is the quiet handoff—focused, legible, and authenticated. */
import { useState, useEffect, useMemo } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  Check,
  ChevronDown,
  LockKeyhole,
  ShoppingBag,
  Trash2,
  GraduationCap,
  Truck,
  Zap,
  MapPin,
  PhoneCall,
  MessageSquare,
  Home,
  Building2,
  User,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { formatNaira, useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  NIGERIAN_UNIVERSITIES,
  NIGERIAN_STATES,
  NIGERIAN_CITIES_BY_STATE,
  getUniversityState,
} from "@/lib/nigeriaLocations";

const MARK = "/zoid-logo.svg";

// Jersey customization cost (name + number)
const JERSEY_CUSTOMIZATION_COST = 2000;

// GUO Transport locations
const GUO_LOCATIONS: Record<string, string[]> = {
  "Lagos": [
    "Ojota Terminal (7 Ikorodu Road, Ojota)",
    "Maryland Terminal (Lagos-Ibadan Expressway)",
    "Mile 2 Terminal",
    "Tin Can Island",
  ],
  "Port Harcourt": [
    "Mile 1 Terminal (Old GUO Park, Mile 1)",
    "Rumuola Terminal",
    "Eleme Junction Terminal",
    "Trans-Amadi Terminal",
  ],
};

type DeliveryOptionType = "standard" | "express" | "pickup" | "not_mentioned";
type StandardSubType = "university" | "given_address" | null;

// States we currently deliver to directly
const SUPPORTED_STATES = ["Lagos State", "Rivers State"];

// Universities in Lagos and Port Harcourt (Rivers State) only
const LAGOS_PH_UNIVERSITIES = [
  // Lagos
  "University of Lagos, Akoka (UNILAG)",
  "Lagos State University, Ojo (LASU)",
  "Lagos State University of Science and Technology, Ikorodu (LASUSTECH)",
  "Lagos State University of Education, Ijanikin (LASUED)",
  "Yaba College of Technology, Lagos (YABATECH)",
  "Lagos City Polytechnic",
  "Anchor University, Ayobo, Lagos",
  "Augustine University, Ilara, Epe",
  "Caleb University, Imota, Lagos",
  "Eko University of Medicine and Health Sciences, Ijanikin",
  "Pan-Atlantic University, Ibeju-Lekki, Lagos (PAU)",
  "Trinity University, Yaba, Lagos",
  // Port Harcourt / Rivers State
  "University of Port Harcourt (UNIPORT)",
  "Rivers State University, Port Harcourt (RSU)",
  "Ignatius Ajuru University of Education, Port Harcourt (IAUE)",
  "Madonna University, Elele",
  "PAMO University of Medical Sciences, Port Harcourt",
  "Wigwe University, Isiokpo",
];

/** Returns true when the user's entered state matches Lagos or Port Harcourt */
function isSupportedState(state: string): boolean {
  const s = state.trim().toLowerCase();
  return (
    s === "lagos state" ||
    s === "lagos" ||
    s === "rivers state" ||
    s === "rivers" ||
    s === "port harcourt" ||
    s === "ph"
  );
}

interface DeliveryMethod {
  id: DeliveryOptionType;
  title: string;
  subtitle: string;
  fee: number;
  icon: React.ReactNode;
}

const deliveryMethods: DeliveryMethod[] = [
  {
    id: "standard",
    title: "Straight to your doorstep",
    subtitle: "We deliver directly to your door or university campus in Lagos or Port Harcourt",
    fee: 2500,
    icon: <Home size={18} />,
  },
  {
    id: "express",
    title: "Express — Get it faster",
    subtitle: "Your order goes out first so you receive it earlier",
    fee: 4500,
    icon: <Zap size={18} />,
  },
  {
    id: "pickup",
    title: "Come pick it up yourself",
    subtitle: "Collect it at a GUO Transport station in Lagos or Port Harcourt",
    fee: 0,
    icon: <MapPin size={18} />,
  },
  {
    id: "not_mentioned",
    title: "My location isn't listed",
    subtitle: "Talk to us on WhatsApp and we will organize your delivery",
    fee: 0,
    icon: <PhoneCall size={18} />,
  },
];

/** Lightweight form-data type passed to the review page */
export interface CheckoutDraft {
  name: string;
  email: string;
  phone: string;
  contactState: string; // state entered in contact details — drives which delivery options show
  deliveryOption: DeliveryOptionType;
  standardSubType: StandardSubType;
  // student fields
  schoolName: string;
  hostelAndRoom: string;
  studentCityState: string;
  // given address fields
  address: string;
  city: string;
  state: string;
  // express-specific
  expressState: string;
  expressCity: string;
  expressAddress: string;
  // pickup
  pickupState: string;
  pickupTerminal: string;
  pickupNote: string;
  // shared
  notes: string;
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { bag, count, total, removeFromBag } = useShop();
  const { user, isLoggedIn } = useAuth();

  // AUTH GUARD
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout");
    }
  }, [isLoggedIn, navigate]);

  // Delivery option selection
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOptionType>("standard");
  // For "Straight to your doorstep" — which option is selected
  const [standardSubType, setStandardSubType] = useState<StandardSubType>(null);

  // Animate sections in
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Form state
  const [form, setForm] = useState<CheckoutDraft>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    contactState: "",
    deliveryOption: "standard",
    standardSubType: null,
    schoolName: "",
    hostelAndRoom: "",
    studentCityState: "Lagos State",
    address: "",
    city: "Ikeja",
    state: "Lagos State",
    expressState: "Lagos State",
    expressCity: "Ikeja",
    expressAddress: "",
    pickupState: "Lagos",
    pickupTerminal: GUO_LOCATIONS["Lagos"][0],
    pickupNote: "",
    notes: "",
  });

  // Derived: has the user entered a state we can deliver to?
  const deliveryAvailable = isSupportedState(form.contactState);
  const stateEntered = form.contactState.trim().length > 0;

  // Sync user details on login
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

  function update(field: keyof CheckoutDraft, value: string) {
    setForm((state) => ({ ...state, [field]: value }));
  }

  // Automatically keep campus state synchronized with chosen university
  useEffect(() => {
    if (form.schoolName) {
      const matched = getUniversityState(form.schoolName);
      if (matched && matched !== form.studentCityState) {
        setForm((prev) => ({ ...prev, studentCityState: matched }));
      }
    }
  }, [form.schoolName]);

  // Dynamically compute cities for selected state
  const availableCities = useMemo(
    () => NIGERIAN_CITIES_BY_STATE[form.state] || NIGERIAN_CITIES_BY_STATE["Lagos State"] || [],
    [form.state]
  );
  const availableExpressCities = useMemo(
    () => NIGERIAN_CITIES_BY_STATE[form.expressState] || NIGERIAN_CITIES_BY_STATE["Lagos State"] || [],
    [form.expressState]
  );

  // When Lagos or Port Harcourt is picked, remove "not_mentioned" from delivery options
  const availableDeliveryMethods = useMemo(() => {
    if (stateEntered && deliveryAvailable) {
      return deliveryMethods.filter((m) => m.id !== "not_mentioned");
    }
    return deliveryMethods;
  }, [stateEntered, deliveryAvailable]);

  const selectedMethod = availableDeliveryMethods.find((m) => m.id === deliveryOption) || availableDeliveryMethods[0] || deliveryMethods[0];
  const deliveryFee = deliveryAvailable ? selectedMethod.fee : 0;

  // Compute customization costs
  const customizationTotal = bag.reduce((sum, item) => {
    if (item.customization && item.style === "Jersey") {
      return sum + JERSEY_CUSTOMIZATION_COST * item.quantity;
    }
    return sum;
  }, 0);

  const grandTotal = total + deliveryFee + customizationTotal;

  const whatsappMessage = encodeURIComponent(
    `Hello ZOID! I am ordering from ${form.contactState.trim() ? form.contactState : "outside Lagos/PH"} and would like to arrange interstate delivery for my order.`
  );
  const whatsappUrl = `https://wa.me/2349020711737?text=${whatsappMessage}`;

  function handleConfirm(event: React.FormEvent) {
    event.preventDefault();
    if (bag.length === 0) return;

    // Validate standard delivery destination selection
    if (deliveryOption === "standard" && standardSubType === null) {
      alert("Please choose where we are delivering to: University or Given Address.");
      return;
    }

    // Build updated draft with current delivery state
    const draft: CheckoutDraft = {
      ...form,
      deliveryOption,
      standardSubType,
    };

    // Store draft in sessionStorage to pass to review page
    sessionStorage.setItem("zoid_checkout_draft", JSON.stringify(draft));
    sessionStorage.setItem("zoid_checkout_bag", JSON.stringify(bag));
    sessionStorage.setItem("zoid_checkout_total", String(total));
    sessionStorage.setItem("zoid_checkout_fee", String(deliveryFee));
    sessionStorage.setItem("zoid_checkout_customization_total", String(customizationTotal));
    sessionStorage.setItem("zoid_checkout_method", JSON.stringify(selectedMethod));

    navigate("/order-review");
  }

  if (!isLoggedIn) return null;

  const fadeIn = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(18px)",
    transition: "opacity 0.5s ease, transform 0.5s ease",
  };

  return (
    <main className="checkout-page">
      <header className="checkout-header" style={{ ...fadeIn }}>
        <Link className="brand" href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={MARK} alt="" style={{ height: 16 }} />
          <span style={{ fontWeight: 700, letterSpacing: "0.2em", fontSize: 16 }}>ZOID</span>
        </Link>
        <span className="secure-label">
          <LockKeyhole size={13} /> SECURE CHECKOUT
        </span>
      </header>

      <div className="checkout-wrap">
        <div className="checkout-intro" style={{ ...fadeIn, transitionDelay: "0.05s" }}>
          <Link className="back-link" href="/collection">
            <ArrowLeft size={15} /> Back to collection
          </Link>
          <p className="eyebrow">CHECKOUT / {count.toString().padStart(2, "0")} PIECES</p>
          <h1>
            ALMOST
            <br />
            <span>THERE.</span>
          </h1>
          <p>
            Choose how you would like your package delivered, enter your address details, and review your order.
          </p>
        </div>

        <div className="checkout-grid">
          {/* ── FORM ─────────────────────────────────────────────── */}
          <form
            className="checkout-form"
            onSubmit={handleConfirm}
            style={{ ...fadeIn, transitionDelay: "0.1s" }}
          >

            {/* 01 / YOUR CONTACT DETAILS */}
            <div className="form-section">
              <p className="eyebrow">01 / YOUR CONTACT DETAILS</p>
              <p style={{ fontSize: 12, color: "#666", marginTop: -4, marginBottom: 14 }}>
                We will use these details to contact you and keep you updated on your package.
              </p>

              <label>
                Your full name *
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
                  placeholder="e.g. 0802 345 6789"
                />
              </label>
              <label>
                Your state *
                <div style={{ position: "relative" }}>
                  <input
                    required
                    list="contact-states-list"
                    value={form.contactState}
                    onChange={(e) => {
                      update("contactState", e.target.value);
                      // Reset delivery option when state changes
                      setDeliveryOption("standard");
                      setStandardSubType(null);
                    }}
                    placeholder="e.g. Lagos State, Rivers State"
                    autoComplete="off"
                  />
                  <datalist id="contact-states-list">
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                {stateEntered && !deliveryAvailable && (
                  <span style={{ fontSize: 12, color: "#e05a00", display: "flex", alignItems: "center", gap: 5, marginTop: 6, fontWeight: 500 }}>
                    We cannot deliver to {form.contactState}. Please contact us on WhatsApp.
                  </span>
                )}
                {stateEntered && deliveryAvailable && (
                  <span style={{ fontSize: 11, color: "#29a36a", display: "flex", alignItems: "center", gap: 5, marginTop: 5, fontWeight: 600 }}>
                    <Check size={13} /> Great — automated delivery is available in {form.contactState}!
                  </span>
                )}
              </label>
            </div>

            {/* 02 / SHIPPING & DELIVERY METHOD */}
            <div className="form-section">
              <p className="eyebrow">02 / HOW WOULD YOU LIKE TO RECEIVE YOUR ORDER?</p>

              {/* State not yet entered */}
              {!stateEntered && (
                <p style={{ fontSize: 13, color: "#888", fontStyle: "italic", marginTop: -4, marginBottom: 0, lineHeight: 1.6 }}>
                  Enter your state above to see your delivery options.
                </p>
              )}

              {/* Unsupported state — simple text + WhatsApp link only */}
              {stateEntered && !deliveryAvailable && (
                <div style={{ marginTop: 8 }}>
                  <p style={{ fontSize: 14, color: "#222", marginBottom: 14, lineHeight: 1.5 }}>
                    We cannot deliver to {form.contactState}. Please contact us on WhatsApp.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#25D366",
                      color: "#fff",
                      padding: "12px 20px",
                      borderRadius: 4,
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.04em",
                      textDecoration: "none",
                    }}
                  >
                    <MessageSquare size={16} /> Contact Us on WhatsApp
                  </a>
                </div>
              )}

              {/* Supported state — show all delivery options */}
              {stateEntered && deliveryAvailable && (
                <>
                  <p style={{ fontSize: 13, color: "#666", marginTop: -4, marginBottom: 16, lineHeight: 1.5 }}>
                    Tap on an option below to fill in your delivery or pickup details.
                  </p>

                  <div style={{ display: "grid", gap: 12 }}>
                    {availableDeliveryMethods.map((method) => {
                      const isSelected = deliveryOption === method.id;
                      return (
                        <div
                          key={method.id}
                          style={{
                            transition: "all 0.3s ease",
                            transform: isSelected ? "scale(1.002)" : "scale(1)",
                          }}
                        >
                          {/* Method Card */}
                          <div
                            onClick={() => {
                              setDeliveryOption(method.id);
                              if (method.id !== "standard") setStandardSubType(null);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "15px 16px",
                              background: isSelected ? "rgba(231,25,75,0.08)" : "#fff",
                              border: isSelected ? "1.5px solid var(--pink)" : "1px solid #cbc5bd",
                              borderRadius: isSelected ? "4px 4px 0 0" : 4,
                              cursor: "pointer",
                              transition: "all 0.25s ease",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                              <input
                                type="radio"
                                name="deliveryOption"
                                checked={isSelected}
                                onChange={() => {
                                  setDeliveryOption(method.id);
                                  if (method.id !== "standard") setStandardSubType(null);
                            }}
                            style={{ marginTop: 3, accentColor: "var(--pink)", cursor: "pointer" }}
                          />
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ color: isSelected ? "var(--pink)" : "#888", marginTop: 2 }}>
                              {method.icon}
                            </span>
                            <div>
                              <strong style={{ fontSize: 13, color: "#111", display: "block" }}>
                                {method.title}
                              </strong>
                              <span style={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>{method.subtitle}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: method.fee > 0 ? "var(--pink)" : "#29a36a",
                            }}
                          >
                            {method.fee > 0 ? formatNaira(method.fee) : (method.id === "pickup" ? "Self-Pickup" : "WhatsApp")}
                          </span>
                          <ChevronDown
                            size={15}
                            color="#999"
                            style={{
                              transform: isSelected ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.25s ease",
                            }}
                          />
                        </div>
                      </div>

                      {/* ─── STRAIGHT TO YOUR DOORSTEP ACCORDION PANEL ─── */}
                      {method.id === "standard" && isSelected && (
                        <div
                          className="accordion-smooth-enter"
                          style={{
                            background: "#fdfbf9",
                            border: "1.5px solid var(--pink)",
                            borderTop: "none",
                            borderRadius: "0 0 4px 4px",
                            padding: "20px 18px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#222",
                              marginBottom: 6,
                            }}
                          >
                            Where are you delivering to? *
                          </p>
                          <p style={{ fontSize: 11, color: "#777", margin: "0 0 14px" }}>
                            Please pick one of the options below so we know where to drop off your package.
                          </p>

                          <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
                            {/* Checkbox 1: University */}
                            <label
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 10,
                                cursor: "pointer",
                                padding: "12px 14px",
                                background:
                                  standardSubType === "university"
                                    ? "rgba(231,25,75,0.06)"
                                    : "#fff",
                                border:
                                  standardSubType === "university"
                                    ? "1.5px solid var(--pink)"
                                    : "1px solid #d5d0c8",
                                borderRadius: 4,
                                transition: "all 0.2s ease",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={standardSubType === "university"}
                                onChange={() =>
                                  setStandardSubType(
                                    standardSubType === "university" ? null : "university"
                                  )
                                }
                                style={{
                                  width: 17,
                                  height: 17,
                                  accentColor: "var(--pink)",
                                  cursor: "pointer",
                                  marginTop: 1,
                                  flexShrink: 0,
                                }}
                              />
                              <div>
                                <span
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color:
                                      standardSubType === "university" ? "var(--pink)" : "#333",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  <GraduationCap size={15} /> University
                                </span>
                                <span style={{ fontSize: 11, color: "#666", display: "block", marginTop: 2 }}>
                                  Deliver to your university campus, hall of residence, hostel, or faculty building.
                                </span>
                              </div>
                            </label>

                            {/* Checkbox 2: Given Address */}
                            <label
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 10,
                                cursor: "pointer",
                                padding: "12px 14px",
                                background:
                                  standardSubType === "given_address"
                                    ? "rgba(231,25,75,0.06)"
                                    : "#fff",
                                border:
                                  standardSubType === "given_address"
                                    ? "1.5px solid var(--pink)"
                                    : "1px solid #d5d0c8",
                                borderRadius: 4,
                                transition: "all 0.2s ease",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={standardSubType === "given_address"}
                                onChange={() =>
                                  setStandardSubType(
                                    standardSubType === "given_address" ? null : "given_address"
                                  )
                                }
                                style={{
                                  width: 17,
                                  height: 17,
                                  accentColor: "var(--pink)",
                                  cursor: "pointer",
                                  marginTop: 1,
                                  flexShrink: 0,
                                }}
                              />
                              <div>
                                <span
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color:
                                      standardSubType === "given_address"
                                        ? "var(--pink)"
                                        : "#333",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  <Home size={15} /> Given Address
                                </span>
                                <span style={{ fontSize: 11, color: "#666", display: "block", marginTop: 2 }}>
                                  Deliver straight to your home, office, estate, or any residential address.
                                </span>
                              </div>
                            </label>
                          </div>

                          {/* University Inputs */}
                          {standardSubType === "university" && (
                            <div
                              style={{
                                padding: "16px 14px",
                                background: "#fff",
                                border: "1px solid #e5dfd7",
                                borderRadius: 4,
                                display: "grid",
                                gap: 12,
                                animation: "slideDown 0.25s ease",
                              }}
                            >
                              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--pink)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                University Campus Details
                              </p>
                              <label>
                                School name *
                                <div style={{ position: "relative" }}>
                                  <input
                                    required
                                    list="universities-list"
                                    value={form.schoolName}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const matchedState = getUniversityState(val);
                                      setForm((prev) => ({
                                        ...prev,
                                        schoolName: val,
                                        ...(matchedState ? { studentCityState: matchedState } : {}),
                                      }));
                                    }}
                                    placeholder="e.g. UNILAG, UNIPORT, LASU, RSU"
                                    autoComplete="off"
                                  />
                                  <datalist id="universities-list">
                                    {LAGOS_PH_UNIVERSITIES.map((uni) => (
                                      <option key={uni} value={uni} />
                                    ))}
                                  </datalist>
                                </div>
                                {form.schoolName && form.studentCityState && (
                                  <span style={{ fontSize: 11, color: "var(--pink)", display: "flex", alignItems: "center", gap: 5, marginTop: 4, textTransform: "none", letterSpacing: "normal" }}>
                                    <Check size={12} /> Campus State auto-matched: <strong>{form.studentCityState}</strong>
                                  </span>
                                )}
                              </label>
                              <label>
                                Campus State *
                                <div style={{ position: "relative" }}>
                                  <input
                                    required
                                    list="student-states-list"
                                    value={form.studentCityState}
                                    onChange={(e) => update("studentCityState", e.target.value)}
                                    placeholder="Lagos State or Rivers State"
                                    autoComplete="off"
                                  />
                                  <datalist id="student-states-list">
                                    {SUPPORTED_STATES.map((s) => (
                                      <option key={s} value={s} />
                                    ))}
                                  </datalist>
                                </div>
                              </label>
                              <label>
                                Hostel name & room number *
                                <input
                                  required
                                  value={form.hostelAndRoom}
                                  onChange={(e) => update("hostelAndRoom", e.target.value)}
                                  placeholder="e.g. Moremi Hall, Block B, Room 204"
                                />
                              </label>
                              <label>
                                Any extra notes for delivery? (optional)
                                <input
                                  value={form.notes}
                                  onChange={(e) => update("notes", e.target.value)}
                                  placeholder="e.g. Call me once you arrive at the main security gate"
                                />
                              </label>
                            </div>
                          )}

                          {/* Given Address Inputs */}
                          {standardSubType === "given_address" && (
                            <div
                              style={{
                                padding: "16px 14px",
                                background: "#fff",
                                border: "1px solid #e5dfd7",
                                borderRadius: 4,
                                display: "grid",
                                gap: 12,
                                animation: "slideDown 0.25s ease",
                              }}
                            >
                              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--pink)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Delivery Address Details
                              </p>
                              <label>
                                State *
                                <div style={{ position: "relative" }}>
                                  <input
                                    required
                                    list="states-list"
                                    value={form.state}
                                    onChange={(e) => update("state", e.target.value)}
                                    placeholder="e.g. Lagos State, Rivers State"
                                    autoComplete="off"
                                  />
                                  <datalist id="states-list">
                                    {NIGERIAN_STATES.map((s) => (
                                      <option key={s} value={s} />
                                    ))}
                                  </datalist>
                                </div>
                              </label>
                              <label>
                                City or town in {form.state || "your state"} *
                                <div style={{ position: "relative" }}>
                                  <input
                                    required
                                    list="cities-list"
                                    value={form.city}
                                    onChange={(e) => update("city", e.target.value)}
                                    placeholder={
                                      availableCities.length > 0
                                        ? `e.g. ${availableCities.slice(0, 2).join(", ")}`
                                        : "Type your city or area"
                                    }
                                    autoComplete="off"
                                  />
                                  <datalist id="cities-list">
                                    {availableCities.map((c) => (
                                      <option key={c} value={c} />
                                    ))}
                                  </datalist>
                                </div>
                              </label>
                              <label>
                                Full street address *
                                <textarea
                                  required
                                  value={form.address}
                                  onChange={(e) => update("address", e.target.value)}
                                  placeholder="e.g. 14 Adeola Odeku Street, Victoria Island"
                                  rows={3}
                                />
                              </label>
                              <label>
                                Any extra notes for delivery? (optional)
                                <input
                                  value={form.notes}
                                  onChange={(e) => update("notes", e.target.value)}
                                  placeholder="e.g. Leave with security or reception desk"
                                />
                              </label>
                            </div>
                          )}

                          {!standardSubType && (
                            <p style={{ fontSize: 12, color: "#888", fontStyle: "italic", textAlign: "center", margin: "10px 0 0" }}>
                              Please tick University or Given Address above to enter your delivery address.
                            </p>
                          )}
                        </div>
                      )}

                      {/* ─── EXPRESS ACCORDION PANEL ─── */}
                      {method.id === "express" && isSelected && (
                        <div
                          className="accordion-smooth-enter"
                          style={{
                            background: "#fdfbf9",
                            border: "1.5px solid var(--pink)",
                            borderTop: "none",
                            borderRadius: "0 0 4px 4px",
                            padding: "18px 18px 20px",
                          }}
                        >
                          {/* Express highlight note in simple layman words */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              padding: "12px 14px",
                              background: "rgba(231,25,75,0.06)",
                              border: "1px solid rgba(231,25,75,0.25)",
                              borderRadius: 4,
                              marginBottom: 16,
                            }}
                          >
                            <Zap size={18} color="var(--pink)" style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={{ margin: 0, fontSize: 12, color: "#333", lineHeight: 1.6 }}>
                              <strong style={{ color: "var(--pink)" }}>With Express delivery, your package will be brought to you sooner than normal.</strong>{" "}
                              Your package is moved straight to the front of our dispatch line so you get it quickly without waiting through the standard queue.
                            </p>
                          </div>

                          <div
                            style={{
                              padding: "16px 14px",
                              background: "#fff",
                              border: "1px solid #e5dfd7",
                              borderRadius: 4,
                              display: "grid",
                              gap: 12,
                            }}
                          >
                            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--pink)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                              Express Destination Address
                            </p>
                            <label>
                              State *
                              <div style={{ position: "relative" }}>
                                <input
                                  required
                                  list="express-states-list"
                                  value={form.expressState}
                                  onChange={(e) => update("expressState", e.target.value)}
                                  placeholder="e.g. Lagos State, Abuja"
                                  autoComplete="off"
                                />
                                <datalist id="express-states-list">
                                  {NIGERIAN_STATES.map((s) => (
                                    <option key={s} value={s} />
                                  ))}
                                </datalist>
                              </div>
                            </label>
                            <label>
                              City or area *
                              <div style={{ position: "relative" }}>
                                <input
                                  required
                                  list="express-cities-list"
                                  value={form.expressCity}
                                  onChange={(e) => update("expressCity", e.target.value)}
                                  placeholder={
                                    availableExpressCities.length > 0
                                      ? `e.g. ${availableExpressCities.slice(0, 2).join(", ")}`
                                      : "Type your city or area"
                                  }
                                  autoComplete="off"
                                />
                                <datalist id="express-cities-list">
                                  {availableExpressCities.map((c) => (
                                    <option key={c} value={c} />
                                  ))}
                                </datalist>
                              </div>
                            </label>
                            <label>
                              Full street address *
                              <textarea
                                required
                                value={form.expressAddress}
                                onChange={(e) => update("expressAddress", e.target.value)}
                                placeholder="e.g. 7 Marina Road, Lagos Island"
                                rows={3}
                              />
                            </label>
                            <label>
                              Any extra notes for the rider? (optional)
                              <input
                                value={form.notes}
                                onChange={(e) => update("notes", e.target.value)}
                                placeholder="e.g. Call me 10 minutes before you arrive"
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      {/* ─── SELF-PICKUP ACCORDION PANEL ─── */}
                      {method.id === "pickup" && isSelected && (
                        <div
                          className="accordion-smooth-enter"
                          style={{
                            background: "#fdfbf9",
                            border: "1.5px solid var(--pink)",
                            borderTop: "none",
                            borderRadius: "0 0 4px 4px",
                            padding: "16px 18px 20px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              padding: "12px 14px",
                              background: "rgba(41,163,106,0.07)",
                              border: "1px solid rgba(41,163,106,0.25)",
                              borderRadius: 4,
                              marginBottom: 16,
                            }}
                          >
                            <Building2 size={16} color="#29a36a" style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={{ margin: 0, fontSize: 12, color: "#333", lineHeight: 1.6 }}>
                              <strong style={{ color: "#1a8a52" }}>Pick up your package yourself at GUO Transport.</strong>{" "}
                              We have GUO pickup stations in <strong>Lagos</strong> and <strong>Port Harcourt</strong>. Select your state and pick the station closest to you.
                            </p>
                          </div>

                          <div
                            style={{
                              padding: "16px 14px",
                              background: "#fff",
                              border: "1px solid #e5dfd7",
                              borderRadius: 4,
                            }}
                          >
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#333", marginBottom: 10 }}>
                              1. Select your state:
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                              {Object.keys(GUO_LOCATIONS).map((state) => {
                                const isSelectedState = form.pickupState === state;
                                return (
                                  <div
                                    key={state}
                                    onClick={() => {
                                      update("pickupState", state);
                                      update("pickupTerminal", GUO_LOCATIONS[state][0]);
                                    }}
                                    style={{
                                      padding: "14px 16px",
                                      border: isSelectedState ? "2px solid var(--pink)" : "1px solid #d5d0c8",
                                      borderRadius: 6,
                                      background: isSelectedState ? "rgba(231,25,75,0.08)" : "#fff",
                                      cursor: "pointer",
                                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                      textAlign: "center",
                                      transform: isSelectedState ? "scale(1.02)" : "scale(1)",
                                      boxShadow: isSelectedState ? "0 4px 12px rgba(231,25,75,0.12)" : "none",
                                    }}
                                  >
                                    <MapPin
                                      size={18}
                                      color={isSelectedState ? "var(--pink)" : "#888"}
                                      style={{ margin: "0 auto 4px", display: "block" }}
                                    />
                                    <strong style={{ fontSize: 12, color: isSelectedState ? "var(--pink)" : "#333" }}>
                                      {state}
                                    </strong>
                                  </div>
                                );
                              })}
                            </div>

                            {form.pickupState && (
                              <>
                                <p style={{ fontSize: 12, fontWeight: 700, color: "#333", marginBottom: 8 }}>
                                  2. Choose your nearest GUO station in {form.pickupState}:
                                </p>
                                <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                                  {GUO_LOCATIONS[form.pickupState]?.map((terminal) => {
                                    const isSelectedTerm = form.pickupTerminal === terminal;
                                    return (
                                      <label
                                        key={terminal}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 10,
                                          padding: "11px 13px",
                                          border: isSelectedTerm ? "1.5px solid var(--pink)" : "1px solid #d5d0c8",
                                          borderRadius: 4,
                                          background: isSelectedTerm ? "rgba(231,25,75,0.06)" : "#fff",
                                          cursor: "pointer",
                                          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                          transform: isSelectedTerm ? "translateX(3px)" : "none",
                                        }}
                                      >
                                        <input
                                          type="radio"
                                          name="pickupTerminal"
                                          checked={isSelectedTerm}
                                          onChange={() => update("pickupTerminal", terminal)}
                                          style={{ accentColor: "var(--pink)", cursor: "pointer", flexShrink: 0 }}
                                        />
                                        <span style={{ fontSize: 12, color: isSelectedTerm ? "var(--pink)" : "#333", fontWeight: isSelectedTerm ? 700 : 400 }}>
                                          {terminal}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </>
                            )}

                            <label>
                              Anything we should know about your pickup? (optional)
                              <input
                                value={form.pickupNote}
                                onChange={(e) => update("pickupNote", e.target.value)}
                                placeholder="e.g. I will pick up on Friday afternoon"
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      {/* ─── NOT MENTIONED ACCORDION PANEL ─── */}
                      {method.id === "not_mentioned" && isSelected && (
                        <div
                          className="accordion-smooth-enter"
                          style={{
                            background: "#fdfbf9",
                            border: "1.5px solid var(--pink)",
                            borderTop: "none",
                            borderRadius: "0 0 4px 4px",
                            padding: "16px 18px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <PhoneCall size={16} color="var(--pink)" style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={{ margin: 0, fontSize: 12, color: "#444", lineHeight: 1.5 }}>
                              Your town, city, or state isn't listed here? Send us a quick WhatsApp message and our support team will organize a custom delivery directly to you.
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
                            <MessageSquare size={16} /> Chat with us on WhatsApp (+234 9020711737)
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              </>
              )}
            </div>

            <button
              className="pink-button checkout-submit"
              type="submit"
              disabled={bag.length === 0}
              style={{
                opacity: bag.length === 0 ? 0.5 : 1,
                transition: "transform 0.2s ease, opacity 0.2s ease",
              }}
            >
              {bag.length === 0 ? (
                "Your bag is empty"
              ) : (
                <>
                  Review Order ({formatNaira(grandTotal)}) <ArrowDownRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* ── ORDER SUMMARY SIDEBAR (STICKY) ────────────────── */}
          <aside className="checkout-summary" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.45s ease 0.15s" }}>
            <div className="summary-head">
              <p className="eyebrow">WHAT'S IN YOUR BAG</p>
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
                    {/* Show customization cost if jersey */}
                    {item.customization && item.style === "Jersey" && (
                      <small style={{ color: "#888" }}>
                        + {formatNaira(JERSEY_CUSTOMIZATION_COST * item.quantity)} customization
                      </small>
                    )}
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

            {/* Price breakdown */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #d5d0c8" }}>
              <div
                style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 8 }}
              >
                <span>Items total</span>
                <strong>{formatNaira(total)}</strong>
              </div>
              {customizationTotal > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 8 }}
                >
                  <span>Jersey customization</span>
                  <strong style={{ color: "var(--pink)" }}>+{formatNaira(customizationTotal)}</strong>
                </div>
              )}
              <div
                style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 8 }}
              >
                <span>Delivery ({selectedMethod.title.split("—")[0].trim()})</span>
                <strong style={{ color: deliveryFee > 0 ? "var(--pink)" : "#29a36a" }}>
                  {deliveryFee > 0 ? formatNaira(deliveryFee) : (deliveryOption === "pickup" ? "Self-Pickup" : "Contact")}
                </strong>
              </div>
              <div
                className="summary-total"
                style={{ borderTop: "1px solid #d5d0c8", paddingTop: 12, marginTop: 12 }}
              >
                <span>Total</span>
                <strong style={{ fontSize: 20, color: "var(--pink)" }}>{formatNaira(grandTotal)}</strong>
              </div>
            </div>

            <p className="summary-delivery">
              We deliver within 2 weeks.
              <br />
              You'll get an update once your order is dispatched.
            </p>

            {/* Guarantee badge */}
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
              <Truck size={14} style={{ color: "#29a36a", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 10, color: "#1a8a52", lineHeight: 1.5 }}>
                <strong>2-week delivery guarantee</strong>
                <br />
                All orders delivered within 14 days.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Slide-down animation keyframes */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
