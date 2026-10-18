/* ZOID Storefront — Authoritative Sales & Accounting Metrics Engine */

export interface SalesOrderItem {
  productSlug: string;
  productName: string;
  category: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image?: string;
}

export type OrderStatus = "Processing" | "In Transit" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Refunded";
export type FulfillmentType = "hand_delivery" | "guo_pickup" | "custom_support";

export interface SalesOrder {
  orderId: string;
  date: string; // ISO date string e.g. "2026-10-18" or timestamp
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentType: FulfillmentType;
  fulfillmentLocation?: string;
  terminalDetails?: {
    state: string;
    city?: string;
    terminalName?: string;
    isPendingConfirmation: boolean;
    notes?: string;
  };
  items: SalesOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountTotal?: number;
  refundTotal?: number;
  total: number;
  formattedTotal: string;
  deliveryAddress: string;
}

export interface DailySalesPoint {
  dayName: string; // "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
  dateStr: string; // "YYYY-MM-DD"
  revenue: number;
  ordersCount: number;
  unitsCount: number;
  isToday: boolean;
}

export interface WeeklySalesMetrics {
  currentWeekStart: string;
  currentWeekEnd: string;
  weeklyRevenue: number;
  formattedWeeklyRevenue: string;
  weeklyOrdersCount: number;
  weeklyPaidCount: number;
  weeklyUnitsSold: number;
  weeklyAOV: number;
  formattedWeeklyAOV: string;
  previousWeekRevenue: number;
  formattedPreviousWeekRevenue: string;
  weekOverWeekChangePercent: number | null; // null if previous week had 0
  dailyBreakdown: DailySalesPoint[];
}

export interface AccountingMetrics {
  grossSales: number;
  formattedGrossSales: string;
  deliveryChargesCollected: number;
  formattedDeliveryCharges: string;
  discountsRecorded: number;
  formattedDiscounts: string;
  refundsRecorded: number;
  formattedRefunds: string;
  netSales: number;
  formattedNetSales: string;
  totalCollectedPayments: number;
  formattedCollectedPayments: string;
  outstandingBalances: number;
  formattedOutstandingBalances: string;
  allTimeAOV: number;
  formattedAllTimeAOV: string;
  paidOrdersCount: number;
  pendingPaymentOrdersCount: number;
  refundedOrdersCount: number;
}

export interface OperationalMetrics {
  totalOrders: number;
  processingCount: number;
  inTransitCount: number;
  deliveredCount: number;
  cancelledCount: number;
  handDeliveryCount: number;
  guoPickupCount: number;
  pendingTerminalConfirmationCount: number;
  topSellingProducts: Array<{
    productSlug: string;
    productName: string;
    category: string;
    image?: string;
    unitsSold: number;
    revenue: number;
  }>;
}

export interface DashboardMetrics {
  weekly: WeeklySalesMetrics;
  accounting: AccountingMetrics;
  operational: OperationalMetrics;
}

/** Get calendar week boundaries (Monday 00:00:00 to Sunday 23:59:59) */
export function getCalendarWeekRange(refDate = new Date()): { start: Date; end: Date; prevStart: Date; prevEnd: Date } {
  const d = new Date(refDate);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(d);
  start.setDate(d.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const prevStart = new Date(start);
  prevStart.setDate(start.getDate() - 7);
  prevStart.setHours(0, 0, 0, 0);

  const prevEnd = new Date(prevStart);
  prevEnd.setDate(prevStart.getDate() + 6);
  prevEnd.setHours(23, 59, 59, 999);

  return { start, end, prevStart, prevEnd };
}

export function formatNairaAmount(num: number): string {
  return `₦${Math.round(num).toLocaleString("en-NG")}`;
}

/** Compute comprehensive metrics from authoritative order dataset */
export function calculateDashboardMetrics(orders: SalesOrder[], referenceDate = new Date()): DashboardMetrics {
  const { start: weekStart, end: weekEnd, prevStart, prevEnd } = getCalendarWeekRange(referenceDate);

  // Filter valid non-cancelled orders
  const validOrders = orders.filter((o) => o.status !== "Cancelled");

  // ── 1. ACCOUNTING METRICS ───────────────────────────────────────────
  let grossSales = 0;
  let deliveryCharges = 0;
  let discounts = 0;
  let refunds = 0;
  let totalCollected = 0;
  let outstanding = 0;
  let paidCount = 0;
  let pendingPaymentCount = 0;
  let refundedCount = 0;

  orders.forEach((o) => {
    if (o.status === "Cancelled") return;

    grossSales += o.subtotal || (o.total - (o.deliveryFee || 0));
    deliveryCharges += o.deliveryFee || 0;
    discounts += o.discountTotal || 0;
    refunds += o.refundTotal || 0;

    if (o.paymentStatus === "Paid" || o.status === "Delivered") {
      totalCollected += o.total;
      paidCount++;
    } else if (o.paymentStatus === "Pending") {
      outstanding += o.total;
      pendingPaymentCount++;
    } else if (o.paymentStatus === "Refunded") {
      refundedCount++;
    }
  });

  const netSales = Math.max(0, grossSales - discounts - refunds);
  const allTimeAOV = validOrders.length > 0 ? Math.round(totalCollected / (paidCount || 1)) : 0;

  const accounting: AccountingMetrics = {
    grossSales,
    formattedGrossSales: formatNairaAmount(grossSales),
    deliveryChargesCollected: deliveryCharges,
    formattedDeliveryCharges: formatNairaAmount(deliveryCharges),
    discountsRecorded: discounts,
    formattedDiscounts: formatNairaAmount(discounts),
    refundsRecorded: refunds,
    formattedRefunds: formatNairaAmount(refunds),
    netSales,
    formattedNetSales: formatNairaAmount(netSales),
    totalCollectedPayments: totalCollected,
    formattedCollectedPayments: formatNairaAmount(totalCollected),
    outstandingBalances: outstanding,
    formattedOutstandingBalances: formatNairaAmount(outstanding),
    allTimeAOV,
    formattedAllTimeAOV: formatNairaAmount(allTimeAOV),
    paidOrdersCount: paidCount,
    pendingPaymentOrdersCount: pendingPaymentCount,
    refundedOrdersCount: refundedCount,
  };

  // ── 2. WEEKLY SALES OVERVIEW ────────────────────────────────────────
  let weeklyRevenue = 0;
  let weeklyOrdersCount = 0;
  let weeklyPaidCount = 0;
  let weeklyUnitsSold = 0;
  let previousWeekRevenue = 0;

  // Prepare 7-day daily breakdown (Mon to Sun)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayDateStr = referenceDate.toISOString().split("T")[0];

  const dailyBreakdown: DailySalesPoint[] = daysOfWeek.map((dayName, idx) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + idx);
    const dateStr = dayDate.toISOString().split("T")[0];

    return {
      dayName,
      dateStr,
      revenue: 0,
      ordersCount: 0,
      unitsCount: 0,
      isToday: dateStr === todayDateStr,
    };
  });

  orders.forEach((o) => {
    if (o.status === "Cancelled") return;
    const orderDate = new Date(o.date);

    // Current Week check
    if (orderDate >= weekStart && orderDate <= weekEnd) {
      weeklyOrdersCount++;
      if (o.paymentStatus === "Paid" || o.status === "Delivered" || o.status === "In Transit" || o.status === "Processing") {
        weeklyRevenue += o.total;
        weeklyPaidCount++;
      }

      const units = o.items.reduce((s, it) => s + it.quantity, 0);
      weeklyUnitsSold += units;

      // Assign to daily breakdown
      const orderDateStr = o.date.split("T")[0];
      const matchDay = dailyBreakdown.find((d) => d.dateStr === orderDateStr);
      if (matchDay) {
        matchDay.revenue += o.total;
        matchDay.ordersCount++;
        matchDay.unitsCount += units;
      }
    }

    // Previous Week check
    if (orderDate >= prevStart && orderDate <= prevEnd) {
      previousWeekRevenue += o.total;
    }
  });

  const weeklyAOV = weeklyPaidCount > 0 ? Math.round(weeklyRevenue / weeklyPaidCount) : 0;

  let weekOverWeekChangePercent: number | null = null;
  if (previousWeekRevenue > 0) {
    weekOverWeekChangePercent = Math.round(((weeklyRevenue - previousWeekRevenue) / previousWeekRevenue) * 100);
  }

  const weekly: WeeklySalesMetrics = {
    currentWeekStart: weekStart.toISOString().split("T")[0],
    currentWeekEnd: weekEnd.toISOString().split("T")[0],
    weeklyRevenue,
    formattedWeeklyRevenue: formatNairaAmount(weeklyRevenue),
    weeklyOrdersCount,
    weeklyPaidCount,
    weeklyUnitsSold,
    weeklyAOV,
    formattedWeeklyAOV: formatNairaAmount(weeklyAOV),
    previousWeekRevenue,
    formattedPreviousWeekRevenue: formatNairaAmount(previousWeekRevenue),
    weekOverWeekChangePercent,
    dailyBreakdown,
  };

  // ── 3. OPERATIONAL METRICS ──────────────────────────────────────────
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const inTransitCount = orders.filter((o) => o.status === "In Transit").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  const handDeliveryCount = orders.filter((o) => o.fulfillmentType === "hand_delivery").length;
  const guoPickupOrders = orders.filter((o) => o.fulfillmentType === "guo_pickup");
  const guoPickupCount = guoPickupOrders.length;
  const pendingTerminalConfirmationCount = guoPickupOrders.filter(
    (o) => o.terminalDetails?.isPendingConfirmation
  ).length;

  // Best-selling products aggregation
  const productSalesMap = new Map<string, { productSlug: string; productName: string; category: string; image?: string; unitsSold: number; revenue: number }>();

  validOrders.forEach((o) => {
    o.items.forEach((item) => {
      const existing = productSalesMap.get(item.productSlug) || {
        productSlug: item.productSlug,
        productName: item.productName,
        category: item.category,
        image: item.image,
        unitsSold: 0,
        revenue: 0,
      };
      existing.unitsSold += item.quantity;
      existing.revenue += item.lineTotal;
      productSalesMap.set(item.productSlug, existing);
    });
  });

  const topSellingProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  const operational: OperationalMetrics = {
    totalOrders: orders.length,
    processingCount,
    inTransitCount,
    deliveredCount,
    cancelledCount,
    handDeliveryCount,
    guoPickupCount,
    pendingTerminalConfirmationCount,
    topSellingProducts,
  };

  return { weekly, accounting, operational };
}
