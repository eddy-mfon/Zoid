/* ZOID Storefront — Authoritative Orders Data Store */
import {
  type SalesOrder,
  type DashboardMetrics,
  calculateDashboardMetrics,
} from "./salesMetrics";

const ORDERS_STORAGE_KEY = "zoid_admin_orders_v2";

// Helper to format ISO dates relative to today
const now = new Date();
const toDateStr = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

// Initial store seed orders with realistic calendar-week distribution and GUO pickups
const SEED_ORDERS: SalesOrder[] = [
  {
    orderId: "ZD-A7K2M1",
    date: toDateStr(0), // Today
    customerName: "Tunde Okonkwo",
    customerEmail: "tunde.o@gmail.com",
    customerPhone: "+234 803 234 5678",
    status: "Processing",
    paymentStatus: "Paid",
    fulfillmentType: "hand_delivery",
    fulfillmentLocation: "Lagos State",
    items: [
      {
        productSlug: "ac-milan-2526",
        productName: "AC Milan / 25—26",
        category: "CURATED JERSEY",
        size: "L",
        quantity: 1,
        unitPrice: 58500,
        lineTotal: 58500,
        image: "/manus-storage/ac-milan-2526_b917ea29.jpg",
      },
    ],
    subtotal: 58500,
    deliveryFee: 3500,
    total: 62000,
    formattedTotal: "₦62,000",
    deliveryAddress: "12 Adeola Odeku St, Victoria Island, Lagos State",
  },
  {
    orderId: "ZD-B3P9N4",
    date: toDateStr(1), // Yesterday
    customerName: "Amina Bello",
    customerEmail: "amina.b@yahoo.com",
    customerPhone: "+234 812 345 6789",
    status: "In Transit",
    paymentStatus: "Paid",
    fulfillmentType: "guo_pickup",
    fulfillmentLocation: "FCT - Abuja",
    terminalDetails: {
      state: "FCT - Abuja",
      city: "Abuja",
      terminalName: "Pending Confirmation",
      isPendingConfirmation: true,
      notes: "Customer requested pickup in Abuja central terminal.",
    },
    items: [
      {
        productSlug: "barcelona-away",
        productName: "Barcelona / Away",
        category: "ARCHIVE EDITION",
        size: "M",
        quantity: 1,
        unitPrice: 62000,
        lineTotal: 62000,
        image: "/manus-storage/barcelona_9a244f02.jpg",
      },
      {
        productSlug: "manchester-united-2526",
        productName: "Manchester United / 25—26",
        category: "CURATED JERSEY",
        size: "XL",
        quantity: 1,
        unitPrice: 60500,
        lineTotal: 60500,
        image: "/manus-storage/manchester-united-2526_2aca202f.jpg",
      },
    ],
    subtotal: 122500,
    deliveryFee: 0,
    total: 122500,
    formattedTotal: "₦122,500",
    deliveryAddress: "GUO Terminal Pickup · FCT - Abuja (Pending Confirmation)",
  },
  {
    orderId: "ZD-C6R1Q8",
    date: toDateStr(2),
    customerName: "Chidi Eze",
    customerEmail: "chidi.eze@live.com",
    customerPhone: "+234 809 876 5432",
    status: "Delivered",
    paymentStatus: "Paid",
    fulfillmentType: "hand_delivery",
    fulfillmentLocation: "Rivers State",
    items: [
      {
        productSlug: "liverpool-2526",
        productName: "Liverpool / 25—26",
        category: "HERITAGE DROP",
        size: "L",
        quantity: 2,
        unitPrice: 61500,
        lineTotal: 123000,
        image: "/manus-storage/liverpool-2526_78e5ffc7.jpg",
      },
    ],
    subtotal: 123000,
    deliveryFee: 3500,
    total: 126500,
    formattedTotal: "₦126,500",
    deliveryAddress: "Peter Odili Road, Trans-Amadi, Port Harcourt, Rivers State",
  },
  {
    orderId: "ZD-D4T7W5",
    date: toDateStr(3),
    customerName: "Fatima Suleiman",
    customerEmail: "fatima.s@gmail.com",
    customerPhone: "+234 802 111 2233",
    status: "Delivered",
    paymentStatus: "Paid",
    fulfillmentType: "hand_delivery",
    fulfillmentLocation: "Ogun State",
    items: [
      {
        productSlug: "inter-milan-2526",
        productName: "Inter Milan / 25—26",
        category: "CURATED JERSEY",
        size: "M",
        quantity: 1,
        unitPrice: 59500,
        lineTotal: 59500,
        image: "/manus-storage/inter-milan-2526_65e7cadc.jpg",
      },
      {
        productSlug: "newcastle-2526",
        productName: "Newcastle / 25—26",
        category: "HERITAGE DROP",
        size: "L",
        quantity: 1,
        unitPrice: 57500,
        lineTotal: 57500,
        image: "/manus-storage/newcastle-2526_802db4b3.jpg",
      },
    ],
    subtotal: 117000,
    deliveryFee: 3500,
    total: 120500,
    formattedTotal: "₦120,500",
    deliveryAddress: "Covenant University Campus, Canaanland, Ota, Ogun State",
  },
  {
    orderId: "ZD-E9S3L2",
    date: toDateStr(8), // Previous week
    customerName: "Emeka Okafor",
    customerEmail: "emeka.ok@gmail.com",
    customerPhone: "+234 818 999 0000",
    status: "Delivered",
    paymentStatus: "Paid",
    fulfillmentType: "guo_pickup",
    fulfillmentLocation: "Rivers State",
    terminalDetails: {
      state: "Rivers State",
      city: "Port Harcourt",
      terminalName: "Mile 1 Terminal (Old GUO Park, Mile 1)",
      isPendingConfirmation: false,
    },
    items: [
      {
        productSlug: "manchester-city-2324",
        productName: "Manchester City / 23—24",
        category: "ARCHIVE EDITION",
        size: "XL",
        quantity: 1,
        unitPrice: 55000,
        lineTotal: 55000,
        image: "/manus-storage/manchester-city-2324_a2693d41.jpg",
      },
    ],
    subtotal: 55000,
    deliveryFee: 0,
    total: 55000,
    formattedTotal: "₦55,000",
    deliveryAddress: "GUO Terminal — Mile 1 Terminal (Old GUO Park, Mile 1), Port Harcourt",
  },
  {
    orderId: "ZD-F2H8K9",
    date: toDateStr(9), // Previous week
    customerName: "Folake Adebayo",
    customerEmail: "folake.a@gmail.com",
    customerPhone: "+234 805 777 8888",
    status: "Delivered",
    paymentStatus: "Paid",
    fulfillmentType: "hand_delivery",
    fulfillmentLocation: "Lagos State",
    items: [
      {
        productSlug: "brazil-1998",
        productName: "Brazil / 1998 Vintage",
        category: "ARCHIVE EDITION",
        size: "L",
        quantity: 1,
        unitPrice: 68000,
        lineTotal: 68000,
        image: "/jerseys/National/Brazil 1998 home vintage jersey.jpg",
      },
    ],
    subtotal: 68000,
    deliveryFee: 2500,
    total: 70500,
    formattedTotal: "₦70,500",
    deliveryAddress: "14 Admiralty Way, Lekki Phase 1, Lagos State",
  },
];

type StoreSubscriber = (orders: SalesOrder[], metrics: DashboardMetrics) => void;
const subscribers = new Set<StoreSubscriber>();

export function getStoredOrders(): SalesOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_ORDERS;
  } catch {
    return SEED_ORDERS;
  }
}

export function saveOrders(orders: SalesOrder[]) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Ignore quota errors
  }
  const metrics = calculateDashboardMetrics(orders);
  subscribers.forEach((cb) => cb(orders, metrics));
}

export function addOrderToStore(order: SalesOrder) {
  const current = getStoredOrders();
  const updated = [order, ...current.filter((o) => o.orderId !== order.orderId)];
  saveOrders(updated);
  return order;
}

export function updateOrderStatusInStore(orderId: string, status: SalesOrder["status"]) {
  const current = getStoredOrders();
  const updated = current.map((o) => (o.orderId === orderId ? { ...o, status } : o));
  saveOrders(updated);
}

export function confirmOrderTerminal(orderId: string, terminalName: string) {
  const current = getStoredOrders();
  const updated = current.map((o) => {
    if (o.orderId === orderId) {
      return {
        ...o,
        terminalDetails: {
          ...o.terminalDetails,
          state: o.terminalDetails?.state || "Nigeria",
          terminalName,
          isPendingConfirmation: false,
        },
      };
    }
    return o;
  });
  saveOrders(updated);
}

export function subscribeToOrders(callback: StoreSubscriber) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}
