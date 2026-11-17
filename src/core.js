export const STORAGE_KEY = "scopeledger";
export const STORAGE_VERSION = 1;
export const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
export const FIELD_KEYS = ["project", "client", "prepared", "currency", "discount", "tax", "included", "excluded", "terms"];

const limits = { project: 160, client: 120, prepared: 120, included: 3000, excluded: 3000, terms: 5000 };
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp = (value, min, max) => Math.min(max, Math.max(min, finite(value, min)));
const money = value => Math.round((value + Number.EPSILON) * 100) / 100;

export function defaultEstimate() {
  return {
    version: STORAGE_VERSION,
    items: [],
    payments: [{ title: "Project start", percent: 50 }, { title: "Final delivery", percent: 50 }],
    fields: { project: "", client: "", prepared: "", currency: "INR", discount: "0", tax: "0", included: "", excluded: "", terms: "" }
  };
}

export function normalizeEstimate(input) {
  const fallback = defaultEstimate();
  const warnings = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { data: fallback, warnings: ["Saved draft was not a valid estimate. A fresh draft was opened."] };
  }
  if (input.version !== STORAGE_VERSION) {
    return { data: fallback, warnings: ["This draft version is not supported. Exported files from the current version are supported."] };
  }
  const fields = input.fields && typeof input.fields === "object" && !Array.isArray(input.fields) ? input.fields : {};
  for (const key of FIELD_KEYS) {
    if (key === "currency") {
      fallback.fields.currency = CURRENCIES.includes(fields.currency) ? fields.currency : "INR";
    } else if (key === "discount" || key === "tax") {
      fallback.fields[key] = String(clamp(fields[key], 0, 100));
    } else {
      fallback.fields[key] = typeof fields[key] === "string" ? fields[key].slice(0, limits[key] ?? 1000) : "";
    }
  }
  if (!Array.isArray(input.items) || input.items.length > 100) {
    warnings.push("Deliverables were reset because the saved list was invalid or too large.");
  } else {
    fallback.items = input.items.slice(0, 100).map(item => ({
      title: typeof item?.title === "string" ? item.title.slice(0, 160) : "",
      qty: clamp(item?.qty, 0, 1000000),
      rate: clamp(item?.rate, 0, 1000000000)
    }));
  }
  if (!Array.isArray(input.payments) || input.payments.length > 24) {
    warnings.push("Payment milestones were reset because the saved list was invalid or too large.");
  } else if (input.payments.length) {
    fallback.payments = input.payments.map(payment => ({
      title: typeof payment?.title === "string" ? payment.title.slice(0, 120) : "",
      percent: clamp(payment?.percent ?? payment?.[1], 0, 100)
    }));
  }
  return { data: fallback, warnings };
}

export function calculateEstimate(items, discountPercent = 0, taxPercent = 0) {
  const subtotal = money((Array.isArray(items) ? items : []).reduce((sum, item) => {
    const qty = clamp(item?.qty, 0, 1000000);
    const rate = clamp(item?.rate, 0, 1000000000);
    return sum + qty * rate;
  }, 0));
  const discountRate = clamp(discountPercent, 0, 100);
  const taxRate = clamp(taxPercent, 0, 100);
  const discount = money(subtotal * discountRate / 100);
  const taxable = money(subtotal - discount);
  const tax = money(taxable * taxRate / 100);
  return { subtotal, discount, taxable, tax, total: money(taxable + tax) };
}

export function calculatePayments(total, payments) {
  const list = Array.isArray(payments) ? payments : [];
  const sum = money(list.reduce((acc, p) => acc + clamp(p?.percent ?? p?.[1], 0, 100), 0));
  const valid = list.length > 0 && Math.abs(sum - 100) < 0.01;
  if (!valid) return { valid: false, percentageTotal: sum, allocations: [] };
  let allocated = 0;
  const allocations = list.map((payment, index) => {
    const percent = clamp(payment?.percent ?? payment?.[1], 0, 100);
    const amount = index === list.length - 1
      ? money(total - allocated)
      : money(money(total) * percent / 100);
    allocated = money(allocated + amount);
    return { title: String(payment?.title ?? payment?.[0] ?? "").slice(0, 120), percent, amount };
  });
  return { valid: true, percentageTotal: sum, allocations };
}

export function formatCurrency(value, currency = "INR") {
  const safeCurrency = CURRENCIES.includes(currency) ? currency : "INR";
  return new Intl.NumberFormat("en", { style: "currency", currency: safeCurrency }).format(finite(value));
}
