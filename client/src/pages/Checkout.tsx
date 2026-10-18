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
import {
  HAND_DELIVERY_STATES,
  PORT_HARCOURT_AREAS,
  VERIFIED_GUO_TERMINALS,
  normalizeStateName,
  checkDeliveryEligibility,
  isUniversityEligibleForHandDelivery,
} from "@/lib/deliveryEligibility";

const MARK = "/zoid-logo.svg";

// Jersey customization cost (name + number)
const JERSEY_CUSTOMIZATION_COST = 2000;

// GUO Transport verified terminals
const GUO_LOCATIONS: Record<string, string[]> = {
  "Lagos State": VERIFIED_GUO_TERMINALS["Lagos State"],
  "Rivers State": VERIFIED_GUO_TERMINALS["Rivers State"],
};

type DeliveryOptionType = "standard" | "express" | "pickup" | "not_mentioned";
type StandardSubType = "university" | "given_address" | null;

// Universities in eligible hand-delivery zones (Lagos, Ogun, Port Harcourt)
const HAND_DELIVERY_UNIVERSITIES = [
  // Lagos State
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
  // Ogun State
  "Federal University of Agriculture, Abeokuta (FUNAAB)",
  "Covenant University, Ota",
  "Babcock University, Ilishan-Remo",
  "Bells University of Technology, Ota",
  "Olabisi Onabanjo University, Ago-Iwoye (OOU)",
  "Tai Solarin University of Education, Ijagun (TASUED)",
  "Crawford University, Igbesa",
  "Crescent University, Abeokuta",
  "Chrisland University, Owode, Abeokuta",
  "Christopher University, Mowe",
  "Hallmark University, Ijebu-Itele",
  "McPherson University, Seriki-Sotayo",
  "Mountain Top University, Makogi Oba",
  "Southwestern University, Okun Owa",
  // Port Harcourt (Rivers State)
  "University of Port Harcourt (UNIPORT)",
  "Rivers State University, Port Harcourt (RSU)",
  "Ignatius Ajuru University of Education, Port Harcourt (IAUE)",
  "PAMO University of Medical Sciences, Port Harcourt",
];

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
    subtitle: "Direct hand delivery to your door or university campus in Lagos, Ogun, or Port Harcourt",
    fee: 2500,
    icon: <Home size={18} />,
  },
  {
    id: "express",
    title: "Express — Get it faster",
    subtitle: "Prioritized hand dispatch in Lagos, Ogun, or Port Harcourt",
    fee: 4500,
    icon: <Zap size={18} />,
  },
  {
    id: "pickup",
    title: "GUO Terminal Pickup",
    subtitle: "Collect at a GUO Terminal in your selected state",
    fee: 0,
    icon: <MapPin size={18} />,
  },
  {
    id: "not_mentioned",
    title: "For Further Enquiry",
    subtitle: "Not sure about delivery to your area? Chat with us on WhatsApp and we'll sort it out",
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
  pickupCity: string;
  pickupTerminal: string;
  pickupNote: string;
  isTerminalPending?: boolean;
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
    pickupState: "Lagos State",
    pickupCity: "Ikeja",
    pickupTerminal: GUO_LOCATIONS["Lagos State"][0],
    pickupNote: "",
    isTerminalPending: false,
    notes: "",
  });

  // Derived delivery eligibility for entered state & city
  const eligibility = useMemo(
    () => checkDeliveryEligibility(form.contactState, form.city),
    [form.contactState, form.city]
  );
  const deliveryAvailable = eligibility.isHandDeliveryEligible;
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

  // Universities filtered / prioritised for selected state (Lagos, Ogun, Rivers - Port Harcourt)
  const filteredUniversities = useMemo(() => {
    const normState = normalizeStateName(form.contactState);
    if (normState === "Lagos State" || normState === "Ogun State" || normState === "Rivers State") {
      return HAND_DELIVERY_UNIVERSITIES.filter((u) => {
        const st = getUniversityState(u);
        return st === normState;
      });
    }
    return HAND_DELIVERY_UNIVERSITIES;
  }, [form.contactState]);

  // Delivery methods available based on location eligibility
  const availableDeliveryMethods = useMemo(() => {
    if (stateEntered && !deliveryAvailable) {
      // Outside hand delivery area: customer can request GUO Terminal pickup or custom WhatsApp support
      return deliveryMethods.filter((m) => m.id === "pickup" || m.id === "not_mentioned");
    }
    return deliveryMethods.filter((m) => m.id !== "not_mentioned");
  }, [stateEntered, deliveryAvailable]);

  const selectedMethod = availableDeliveryMethods.find((m) => m.id === deliveryOption) || availableDeliveryMethods[0] || deliveryMethods[0];
  const deliveryFee = (deliveryAvailable && deliveryOption !== "pickup") ? selectedMethod.fee : 0;

  // Compute customization costs
  const customizationTotal = bag.reduce((sum, item) => {
    if (item.customization && item.style === "Jersey") {
      return sum + JERSEY_CUSTOMIZATION_COST * item.quantity;
    }
    return sum;
  }, 0);

  const grandTotal = total + deliveryFee + customizationTotal;

  const whatsappMessage = encodeURIComponent(
    `Hello ZOID! I am ordering from ${form.contactState.trim() ? form.contactState : "outside Lagos/Ogun/PH"} and would like to arrange interstate delivery for my order.`
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

    const isPickup = deliveryOption === "pickup";
    const terminalPending = isPickup && (!VERIFIED_GUO_TERMINALS[form.pickupState] || form.pickupTerminal.toLowerCase().includes("pending"));

    // Build updated draft with current delivery state
    const draft: CheckoutDraft = {
      ...form,
      deliveryOption,
      standardSubType,
      isTerminalPending: terminalPending,
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
                      const val = e.target.value;
                      const norm = normalizeStateName(val);
                      const defaultCity = norm === "Rivers State" ? "Port Harcourt (City)" : norm === "Ogun State" ? "Abeokuta" : "Ikeja";
                      const verifiedTerms = VERIFIED_GUO_TERMINALS[norm];
                      const check = checkDeliveryEligibility(val, defaultCity);

                      setForm((prev) => ({
                        ...prev,
                        contactState: val,
                        state: norm,
                        expressState: norm,
                        studentCityState: norm,
                        city: (!prev.city || prev.city === "Ikeja" || prev.city === "Port Harcourt (City)" || prev.city === "Abeokuta") ? defaultCity : prev.city,
                        expressCity: (!prev.expressCity || prev.expressCity === "Ikeja" || prev.expressCity === "Port Harcourt (City)" || prev.expressCity === "Abeokuta") ? defaultCity : prev.expressCity,
                        pickupState: norm,
                        pickupCity: defaultCity,
                        pickupTerminal: verifiedTerms ? verifiedTerms[0] : `GUO Terminal (${norm}) — Pending Confirmation`,
                      }));

                      // If outside direct hand delivery, automatically choose pickup
                      if (!check.isHandDeliveryEligible) {
                        setDeliveryOption("pickup");
                      } else {
                        setDeliveryOption("standard");
                      }
                      setStandardSubType(null);
                    }}
                    placeholder="e.g. Lagos State, Ogun State, Rivers State"
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
                    <MapPin size={13} /> Direct hand delivery is unavailable in {eligibility.normalizedState}. You can select GUO Terminal pickup below.
                  </span>
                )}
                {stateEntered && deliveryAvailable && (
                  <span style={{ fontSize: 11, color: "#29a36a", display: "flex", alignItems: "center", gap: 5, marginTop: 5, fontWeight: 600 }}>
                    <Check size={13} /> Direct hand delivery is available in {eligibility.normalizedState}!
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

              {/* Unsupported state banner offering GUO terminal pickup */}
              {stateEntered && !deliveryAvailable && (
                <div style={{ marginTop: 8, marginBottom: 18 }}>
                  <div
                    style={{
                      padding: "14px 16px",
                      background: "rgba(224, 90, 0, 0.08)",
                      border: "1px solid rgba(224, 90, 0, 0.28)",
                      borderRadius: 6,
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <MapPin size={18} color="#e05a00" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong style={{ fontSize: 13, color: "#d95300", display: "block", marginBottom: 3 }}>
                          We don't deliver directly to {eligibility.normalizedState}
                        </strong>
                        <p style={{ margin: 0, fontSize: 12, color: "#555", lineHeight: 1.5 }}>
                          No worries — you can still get your order by picking it up from a <strong>GUO Transport terminal</strong> near you. Choose your nearest terminal below.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: "#666", marginBottom: 12, lineHeight: 1.5 }}>
                    Available fulfillment options for {eligibility.normalizedState}:
                  </p>
                </div>
              )}

              {/* Delivery options list (shown when state is entered) */}
              {stateEntered && (
                <>
                  {deliveryAvailable && (
                    <p style={{ fontSize: 13, color: "#666", marginTop: -4, marginBottom: 16, lineHeight: 1.5 }}>
                      Tap on an option below to fill in your delivery or pickup details.
                    </p>
                  )}

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
                              background: isSelected ? "rgba(179, 13, 13,0.08)" : "#fff",
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
                                    ? "rgba(179, 13, 13,0.06)"
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
                                    ? "rgba(179, 13, 13,0.06)"
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
                                    {filteredUniversities.map((uni) => (
                                      <option key={uni} value={uni} />
                                    ))}
                                  </datalist>
                                </div>
                              </label>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "10px 14px",
                                  background: "#f6f4f0",
                                  border: "1px solid #e2ddd5",
                                  borderRadius: 4,
                                  fontSize: 12,
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#333" }}>
                                  <MapPin size={14} color="var(--pink)" />
                                  <span>Campus State: <strong style={{ color: "#111" }}>{form.studentCityState || form.contactState}</strong></span>
                                </div>
                                <span style={{ fontSize: 11, color: "#29a36a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                  <Check size={12} /> Auto-filled from contact
                                </span>
                              </div>
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
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "10px 14px",
                                  background: "#f6f4f0",
                                  border: "1px solid #e2ddd5",
                                  borderRadius: 4,
                                  fontSize: 12,
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#333" }}>
                                  <MapPin size={14} color="var(--pink)" />
                                  <span>Delivery State: <strong style={{ color: "#111" }}>{form.state || form.contactState}</strong></span>
                                </div>
                                <span style={{ fontSize: 11, color: "#29a36a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                  <Check size={12} /> Auto-filled from contact
                                </span>
                              </div>
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
                              background: "rgba(179, 13, 13,0.06)",
                              border: "1px solid rgba(179, 13, 13,0.25)",
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
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 14px",
                                background: "#f6f4f0",
                                border: "1px solid #e2ddd5",
                                borderRadius: 4,
                                fontSize: 12,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#333" }}>
                                <MapPin size={14} color="var(--pink)" />
                                <span>Express State: <strong style={{ color: "#111" }}>{form.expressState || form.contactState}</strong></span>
                              </div>
                              <span style={{ fontSize: 11, color: "#29a36a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                <Check size={12} /> Auto-filled from contact
                              </span>
                            </div>
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
                              <strong style={{ color: "#1a8a52" }}>Pick up from a GUO terminal near you.</strong>{" "}
                              Once your order is ready, we'll send it to your chosen GUO station in <strong>{form.pickupState || "your state"}</strong>. You collect it from there.
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
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 14px",
                                background: "#f6f4f0",
                                border: "1px solid #e2ddd5",
                                borderRadius: 4,
                                fontSize: 12,
                                marginBottom: 14,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#333" }}>
                                <MapPin size={14} color="var(--pink)" />
                                <span>Pickup State: <strong style={{ color: "#111" }}>{form.pickupState}</strong></span>
                              </div>
                              <span style={{ fontSize: 11, color: "#29a36a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                <Check size={12} /> Auto-matched ({form.pickupState})
                              </span>
                            </div>

                            {/* State Selector */}
                            <label style={{ display: "block", marginBottom: 14 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#333", display: "block", marginBottom: 6 }}>
                                1. Pickup State:
                              </span>
                              <select
                                value={form.pickupState}
                                onChange={(e) => {
                                  const newState = e.target.value;
                                  const terms = VERIFIED_GUO_TERMINALS[newState];
                                  setForm((prev) => ({
                                    ...prev,
                                    pickupState: newState,
                                    pickupTerminal: terms ? terms[0] : `GUO Terminal (${newState}) — Pending Confirmation`,
                                  }));
                                }}
                                style={{
                                  width: "100%",
                                  padding: "9px 12px",
                                  border: "1px solid #d5d0c8",
                                  borderRadius: 4,
                                  fontSize: 13,
                                  background: "#fff",
                                  color: "#222",
                                }}
                              >
                                {NIGERIAN_STATES.map((st) => (
                                  <option key={st} value={st}>
                                    {st} {VERIFIED_GUO_TERMINALS[st] ? "(Verified Terminals Available)" : ""}
                                  </option>
                                ))}
                              </select>
                            </label>


                            {/* 2. Terminal Selection */}
                            <label style={{ display: 'block', marginBottom: 14 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#333', display: 'block', marginBottom: 6 }}>
                                2. Choose your nearest GUO terminal in {form.pickupState}:
                              </span>
                              {VERIFIED_GUO_TERMINALS[form.pickupState] ? (
                                <select
                                  value={form.pickupTerminal}
                                  onChange={(e) => update('pickupTerminal', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1.5px solid var(--pink)',
                                    borderRadius: 4,
                                    fontSize: 13,
                                    background: '#fff',
                                    color: '#111',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {VERIFIED_GUO_TERMINALS[form.pickupState].map((terminal) => (
                                    <option key={terminal} value={terminal}>
                                      {terminal}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <>
                                  <input
                                    value={form.pickupCity}
                                    onChange={(e) => {
                                      const cityVal = e.target.value;
                                      update('pickupCity', cityVal);
                                      update('pickupTerminal', `GUO Terminal (${form.pickupState}${cityVal ? ' - ' + cityVal : ''}) — Pending Confirmation`);
                                    }}
                                    placeholder={`Enter your city or nearest town in ${form.pickupState}`}
                                    style={{
                                      width: '100%',
                                      padding: '10px 12px',
                                      border: '1px solid #d5d0c8',
                                      borderRadius: 4,
                                      fontSize: 13,
                                      color: '#111',
                                      marginBottom: 10,
                                    }}
                                  />
                                  <div
                                    style={{
                                      padding: '10px 13px',
                                      background: 'rgba(59, 130, 246, 0.07)',
                                      border: '1px solid rgba(59, 130, 246, 0.2)',
                                      borderRadius: 4,
                                      fontSize: 12,
                                      color: '#1e3a8a',
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    We'll confirm the closest GUO terminal in your area and reach out before your order is dispatched.
                                  </div>
                                </>
                              )}
                            </label>

                            <label style={{ display: "block", marginTop: 14 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>
                                Anything we should know about your pickup? (optional)
                              </span>
                              <input
                                value={form.pickupNote}
                                onChange={(e) => update("pickupNote", e.target.value)}
                                placeholder="e.g. I will pick up on Friday afternoon, preferred branch landmark..."
                                style={{
                                  width: "100%",
                                  padding: "10px 12px",
                                  border: "1px solid #d5d0c8",
                                  borderRadius: 4,
                                  fontSize: 13,
                                  color: "#111",
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      {/* ─── FOR FURTHER ENQUIRY ACCORDION PANEL ─── */}
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
                            <p style={{ margin: 0, fontSize: 12, color: "#444", lineHeight: 1.6 }}>
                              <strong style={{ color: "var(--pink)", display: "block", marginBottom: 4 }}>
                                We deliver to every state in Nigeria.
                              </strong>
                              If your town or state is not listed above, don't worry — just send us a message on WhatsApp.
                              Tell us where you are, and we will work out the best way to get your order to you.
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
                            <MessageSquare size={16} /> Message us on WhatsApp (+234 9020711737)
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

            {/* Hotline below review order button */}
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "9px 14px",
                background: "rgba(179, 13, 13,0.06)",
                border: "1px solid rgba(179, 13, 13,0.2)",
                borderRadius: 4,
                fontSize: 12,
                color: "#444",
              }}
            >
              <PhoneCall size={14} color="var(--pink)" />
              <span>
                Need help? Hotline for emergencies & questions:{" "}
                <a
                  href="tel:09020711737"
                  style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "none" }}
                >
                  09020711737
                </a>
              </span>
            </div>
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
