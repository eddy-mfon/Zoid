/* ZOID Storefront — Authoritative Delivery Eligibility & GUO Terminal Rules */
import { NIGERIAN_CITIES_BY_STATE, getUniversityState } from "./nigeriaLocations";

// Authoritative Hand-Delivery States
export const HAND_DELIVERY_STATES = [
  "Lagos State",
  "Ogun State",
  "Rivers State",
] as const;

// Specific Port Harcourt service area cities / districts in Rivers State
export const PORT_HARCOURT_AREAS = [
  "Port Harcourt (City)",
  "Port Harcourt",
  "Old GRA",
  "GRA Phase 1, 2 & 3",
  "Peter Odili Road",
  "Trans Amadi Industrial",
  "D-Line",
  "Rumuola",
  "Rumuokwuta",
  "Rumuokoro",
  "Choba (Uniport Axis)",
  "Woji",
  "Elelenwo",
  "Borikiri",
  "Diobu (Mile 1-3)",
  "Ada-George",
  "Iwofe Road",
];

// Verified GUO Terminal Records present in the project
export const VERIFIED_GUO_TERMINALS: Record<string, string[]> = {
  "Lagos State": [
    "Ojota Terminal (7 Ikorodu Road, Ojota)",
    "Maryland Terminal (Lagos-Ibadan Expressway)",
    "Mile 2 Terminal (Apapa-Oshodi Expressway)",
    "Tin Can Island Terminal",
  ],
  "Rivers State": [
    "Mile 1 Terminal (Old GUO Park, Mile 1 Diobu)",
    "Rumuola Terminal (Rumuola Road)",
    "Eleme Junction Terminal",
    "Trans-Amadi Terminal",
  ],
  "Ogun State": [
    "Sagamu Terminal (Sagamu Interchange)",
    "Abeokuta Terminal (Oke-Mosan Road)",
    "Ifo Terminal (Lagos-Abeokuta Expressway)",
  ],
  "Abuja (FCT)": [
    "Utako Terminal (GUO Transport, Utako)",
    "Gwagwalada Terminal",
    "Kubwa Terminal (Kubwa Expressway)",
  ],
  "FCT - Abuja": [
    "Utako Terminal (GUO Transport, Utako)",
    "Gwagwalada Terminal",
    "Kubwa Terminal (Kubwa Expressway)",
  ],
  "Anambra State": [
    "Awka Terminal (GUO Park, Enugu-Onitsha Expressway)",
    "Onitsha Terminal (New Market Road, Onitsha)",
    "Nnewi Terminal",
  ],
  "Enugu State": [
    "Enugu Terminal (GUO Park, Ogui Road)",
    "Enugu New Terminal (Agbani Road)",
  ],
  "Oyo State": [
    "Ibadan Terminal (GUO Park, Iwo Road)",
    "Challenge Terminal (Challenge Interchange, Ibadan)",
  ],
  "Delta State": [
    "Asaba Terminal (GUO Park, Nnebisi Road)",
    "Warri Terminal (GUO Park, Effurun Roundabout)",
  ],
  "Edo State": [
    "Benin City Terminal (GUO Park, Akpakpava Road)",
    "Auchi Terminal",
  ],
  "Kano State": [
    "Kano Terminal (GUO Park, Zaria Road, Kano)",
  ],
  "Imo State": [
    "Owerri Terminal (GUO Park, Egbu Road, Owerri)",
    "Orlu Terminal",
  ],
  "Abia State": [
    "Aba Terminal (GUO Park, Faulks Road, Aba)",
    "Umuahia Terminal (Enugu Road, Umuahia)",
  ],
  "Cross River State": [
    "Calabar Terminal (GUO Park, Murtala Mohammed Highway, Calabar)",
  ],
  "Akwa Ibom State": [
    "Uyo Terminal (GUO Park, Aka Road, Uyo)",
    "Ikot Ekpene Terminal",
  ],
  "Ondo State": [
    "Akure Terminal (GUO Park, Ado-Ekiti Road, Akure)",
    "Ondo Terminal",
  ],
  "Ekiti State": [
    "Ado-Ekiti Terminal (GUO Park, Lagos-Ado Road)",
  ],
  "Osun State": [
    "Osogbo Terminal (GUO Park, Station Road, Osogbo)",
    "Ile-Ife Terminal",
  ],
  "Kwara State": [
    "Ilorin Terminal (GUO Park, Ahmadu Bello Way, Ilorin)",
  ],
  "Kaduna State": [
    "Kaduna Terminal (GUO Park, Ahmadu Bello Way, Kaduna)",
  ],
  "Niger State": [
    "Minna Terminal (GUO Park, Bosso Road, Minna)",
  ],
  "Kogi State": [
    "Lokoja Terminal (Confluence, Lokoja)",
  ],
  "Benue State": [
    "Makurdi Terminal (GUO Park, Gboko Road, Makurdi)",
  ],
  "Plateau State": [
    "Jos Terminal (GUO Park, Bauchi Road, Jos)",
  ],
  "Taraba State": [
    "Jalingo Terminal (Hammaruwa Way, Jalingo)",
  ],
};

// Aliases for matching
const STATE_ALIASES: Record<string, string> = {
  "lagos": "Lagos State",
  "lagos state": "Lagos State",
  "ogun": "Ogun State",
  "ogun state": "Ogun State",
  "rivers": "Rivers State",
  "rivers state": "Rivers State",
  "port harcourt": "Rivers State",
  "ph": "Rivers State",
  "fct": "FCT - Abuja",
  "abuja": "FCT - Abuja",
  "fct - abuja": "FCT - Abuja",
};

/** Normalize any entered state string into a canonical Nigerian state name */
export function normalizeStateName(rawState: string): string {
  if (!rawState) return "Lagos State";
  const clean = rawState.trim();
  const lower = clean.toLowerCase();

  if (STATE_ALIASES[lower]) {
    return STATE_ALIASES[lower];
  }

  if (lower.includes("lagos")) return "Lagos State";
  if (lower.includes("ogun")) return "Ogun State";
  if (lower.includes("river") || lower.includes("port harcourt") || lower.includes("ph")) return "Rivers State";
  if (lower.includes("abuja") || lower.includes("fct")) return "FCT - Abuja";
  if (lower.includes("oyo") || lower.includes("ibadan")) return "Oyo State";
  if (lower.includes("anambra")) return "Anambra State";
  if (lower.includes("enugu")) return "Enugu State";
  if (lower.includes("delta") || lower.includes("warri") || lower.includes("asaba")) return "Delta State";
  if (lower.includes("edo") || lower.includes("benin")) return "Edo State";
  if (lower.includes("kano")) return "Kano State";
  if (lower.includes("kaduna")) return "Kaduna State";
  if (lower.includes("akwa ibom") || lower.includes("uyo")) return "Akwa Ibom State";

  // Capitalize properly if no special alias
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export interface DeliveryEligibilityResult {
  isHandDeliveryEligible: boolean;
  normalizedState: string;
  normalizedCity: string;
  isPortHarcourtServiceArea: boolean;
  requiresGuoPickup: boolean;
  reason: string;
}

/** Authoritative evaluation of hand-delivery eligibility */
export function checkDeliveryEligibility(rawState: string, rawCity = ""): DeliveryEligibilityResult {
  const normalizedState = normalizeStateName(rawState);
  const cityTrim = rawCity.trim();
  const cityLower = cityTrim.toLowerCase();

  // 1. Lagos State: 100% eligible for direct hand delivery
  if (normalizedState === "Lagos State") {
    return {
      isHandDeliveryEligible: true,
      normalizedState: "Lagos State",
      normalizedCity: cityTrim || "Ikeja",
      isPortHarcourtServiceArea: false,
      requiresGuoPickup: false,
      reason: "Direct hand delivery is supported across Lagos State.",
    };
  }

  // 2. Ogun State: 100% eligible for direct hand delivery
  if (normalizedState === "Ogun State") {
    return {
      isHandDeliveryEligible: true,
      normalizedState: "Ogun State",
      normalizedCity: cityTrim || "Abeokuta",
      isPortHarcourtServiceArea: false,
      requiresGuoPickup: false,
      reason: "Direct hand delivery is supported across Ogun State.",
    };
  }

  // 3. Rivers State: Hand delivery is strictly supported in Port Harcourt city / metropolitan area
  if (normalizedState === "Rivers State") {
    const isPHCity =
      !cityTrim || // default if unselected in PH
      cityLower.includes("port harcourt") ||
      cityLower.includes("ph") ||
      PORT_HARCOURT_AREAS.some((area) => area.toLowerCase().includes(cityLower) || cityLower.includes(area.toLowerCase()));

    if (isPHCity) {
      return {
        isHandDeliveryEligible: true,
        normalizedState: "Rivers State",
        normalizedCity: cityTrim || "Port Harcourt (City)",
        isPortHarcourtServiceArea: true,
        requiresGuoPickup: false,
        reason: "Direct hand delivery is supported within Port Harcourt (Rivers State).",
      };
    } else {
      return {
        isHandDeliveryEligible: false,
        normalizedState: "Rivers State",
        normalizedCity: cityTrim,
        isPortHarcourtServiceArea: false,
        requiresGuoPickup: true,
        reason: `Direct hand delivery is restricted to Port Harcourt. Deliveries to ${cityTrim} are available via GUO Terminal pickup or custom dispatch.`,
      };
    }
  }

  // 4. All other states: Outside supported hand-delivery area
  return {
    isHandDeliveryEligible: false,
    normalizedState,
    normalizedCity: cityTrim,
    isPortHarcourtServiceArea: false,
    requiresGuoPickup: true,
    reason: `Direct hand delivery is currently unavailable in ${normalizedState}. Request GUO Terminal pickup in ${normalizedState} or chat with us on WhatsApp.`,
  };
}

/** Check if a university is in an eligible hand-delivery state (Lagos, Ogun, Rivers-PH) */
export function isUniversityEligibleForHandDelivery(universityName: string): {
  isEligible: boolean;
  state: string;
} {
  const state = getUniversityState(universityName);
  if (!state) return { isEligible: false, state: "Unknown" };

  if (state === "Lagos State" || state === "Ogun State") {
    return { isEligible: true, state };
  }

  if (state === "Rivers State") {
    // Port Harcourt universities: UNIPORT, RSU, IAUE, PAMO are in Port Harcourt
    const lower = universityName.toLowerCase();
    if (
      lower.includes("uniport") ||
      lower.includes("port harcourt") ||
      lower.includes("rsu") ||
      lower.includes("iaue") ||
      lower.includes("pamo")
    ) {
      return { isEligible: true, state: "Rivers State" };
    }
    // Madonna Elele or Wigwe Isiokpo are outside Port Harcourt
    return { isEligible: false, state: "Rivers State" };
  }

  return { isEligible: false, state };
}
