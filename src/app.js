import { STORAGE_KEY, defaultEstimate, normalizeEstimate, calculateEstimate, calculatePayments, formatCurrency, FIELD_KEYS } from "./core.js";

const $ = id => document.getElementById(id);
const state = defaultEstimate();
let items = state.items;
let payments = state.payments;
let saveTimer;
const fields = FIELD_KEYS;

function announce(message) {
  const node = $("notice");
  node.textContent = message;
  node.hidden = !message;
}
function currentFields() {
  return Object.fromEntries(fields.map(key => [key, $(key).value]));
}
function snapshot() {
  return { version: 1, items, payments, fields: currentFields() };
}
function saveDraft() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()));
      announce("");
    } catch {
      announce("This browser could not save the draft. Export a JSON backup to keep your work.");
    }
  }, 120);
}
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function fieldInput(label, value, type, min, step) {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  input.setAttribute("aria-label", label);
  if (min !== undefined) input.min = String(min);
  if (step) input.step = step;
  return input;
}
function drawItems() {
  const host = $("items");
  host.replaceChildren();
  items.forEach((item, index) => {
    const row = element("div", "line");
    const title = fieldInput("Deliverable name", item.title, "text");
    title.maxLength = 160;
    const qty = fieldInput("Quantity", item.qty, "number", 0, "0.1");
    const rate = fieldInput("Rate", item.rate, "number", 0, "0.01");
    const total = element("b", "line-total", formatCurrency(item.qty * item.rate, $("currency").value));
    const remove = element("button", "", "×");
    remove.type = "button";
    remove.setAttribute("aria-label", "Remove deliverable");
    title.addEventListener("input", () => { item.title = title.value; calc(); });
    qty.addEventListener("input", () => { item.qty = Math.max(0, Math.min(1000000, Number(qty.value) || 0)); calc(); });
    rate.addEventListener("input", () => { item.rate = Math.max(0, Math.min(1000000000, Number(rate.value) || 0)); calc(); });
    remove.addEventListener("click", () => { items.splice(index, 1); drawItems(); });
    row.append(title, qty, rate, total, remove);
    host.append(row);
  });
  calc();
}
function drawPayments() {
  const host = $("payments");
  host.replaceChildren();
  payments.forEach((payment, index) => {
    const row = element("div", "line");
    row.style.gridTemplateColumns = "minmax(100px,1fr) minmax(60px,82px) 25px";
    const title = fieldInput("Milestone name", payment.title, "text");
    title.maxLength = 120;
    const percent = fieldInput("Milestone percentage", payment.percent, "number", 0, "0.01");
    percent.max = "100";
    const remove = element("button", "", "×");
    remove.type = "button";
    remove.setAttribute("aria-label", "Remove milestone");
    title.addEventListener("input", () => { payment.title = title.value; calc(); });
    percent.addEventListener("input", () => { payment.percent = Math.max(0, Math.min(100, Number(percent.value) || 0)); calc(); });
    remove.addEventListener("click", () => { payments.splice(index, 1); drawPayments(); });
    row.append(title, percent, remove);
    host.append(row);
  });
  calc();
}
function renderRows() {
  const body = $("pvitems");
  body.replaceChildren();
  for (const item of items) {
    const tr = document.createElement("tr");
    const name = element("td", "", item.title || "—");
    const qty = element("td", "numeric", String(item.qty));
    const amount = element("td", "numeric", formatCurrency(item.qty * item.rate, $("currency").value));
    tr.append(name, qty, amount);
    body.append(tr);
  }
}
function calc() {
  const currency = $("currency").value;
  const totals = calculateEstimate(items, $("discount").value, $("tax").value);
  const schedule = calculatePayments(totals.total, payments);
  $("subtotal").textContent = $("psub").textContent = formatCurrency(totals.subtotal, currency);
  $("off").textContent = $("poff").textContent = "−" + formatCurrency(totals.discount, currency);
  $("taxout").textContent = $("ptax").textContent = formatCurrency(totals.tax, currency);
  $("total").textContent = $("ptotal").textContent = formatCurrency(totals.total, currency);
  $("valid").textContent = schedule.valid ? "Payment split totals 100%." : "Payment split is " + schedule.percentageTotal + "%; it must equal 100%.";
  $("paymentWarning").hidden = schedule.valid;
  $("print").disabled = !schedule.valid;
  $("export").disabled = !schedule.valid;
  $("pvproject").textContent = $("project").value.trim() || "Your project estimate";
  $("pvclient").textContent = $("client").value.trim() || "Client";
  $("pvprepared").textContent = "Prepared by " + ($("prepared").value.trim() || "—");
  $("pi").textContent = $("included").value;
  $("pe").textContent = $("excluded").value;
  $("pt").textContent = $("terms").value;
  renderRows();
  const preview = $("pvpay");
  preview.replaceChildren();
  if (!schedule.valid) {
    preview.append(element("p", "warning", "Payment schedule unavailable until percentages total 100%."));
  } else {
    schedule.allocations.forEach(allocation => preview.append(element("p", "", allocation.title + " · " + allocation.percent + "% — " + formatCurrency(allocation.amount, currency))));
  }
  saveDraft();
}
function loadDraft(raw) {
  const parsed = JSON.parse(raw);
  const normalized = normalizeEstimate(parsed);
  items = normalized.data.items;
  payments = normalized.data.payments;
  for (const key of fields) $(key).value = normalized.data.fields[key];
  announce(normalized.warnings.join(" "));
}
function restoreDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) loadDraft(raw);
  } catch {
    announce("The saved draft could not be read. A fresh estimate is ready; your browser data was not changed.");
  }
}
function addItem(title = "", qty = 1, rate = 0) {
  if (items.length >= 100) return announce("A maximum of 100 deliverables is supported.");
  items.push({ title, qty, rate });
  drawItems();
}
function addPayment() {
  if (payments.length >= 24) return announce("A maximum of 24 payment milestones is supported.");
  payments.push({ title: "Milestone", percent: 0 });
  drawPayments();
}
function exportBackup() {
  const blob = new Blob([JSON.stringify(snapshot(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "scopeledger-estimate.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function clearDraft() {
  if (!confirm("Clear this estimate and delete its saved browser draft? Export a backup first if you need one.")) return;
  clearTimeout(saveTimer);
  try { localStorage.removeItem(STORAGE_KEY); } catch { announce("Browser storage could not be cleared."); }
  const fresh = defaultEstimate();
  items = fresh.items;
  payments = fresh.payments;
  for (const key of fields) $(key).value = fresh.fields[key];
  drawItems();
  drawPayments();
  announce("Draft cleared. A new estimate is ready.");
}

$("add").addEventListener("click", () => addItem());
$("addpay").addEventListener("click", addPayment);
$("brand").addEventListener("click", () => {
  items = [{ title: "Creative direction", qty: 1, rate: 5000 }, { title: "Logo design", qty: 1, rate: 12000 }, { title: "Brand guidelines", qty: 1, rate: 8000 }];
  drawItems();
});
$("social").addEventListener("click", () => {
  items = [{ title: "Campaign concept", qty: 1, rate: 4000 }, { title: "Social creatives", qty: 8, rate: 750 }];
  drawItems();
});
$("export").addEventListener("click", exportBackup);
$("print").addEventListener("click", () => { if (calculatePayments(calculateEstimate(items, $("discount").value, $("tax").value).total, payments).valid) window.print(); });
$("clear").addEventListener("click", clearDraft);
document.querySelectorAll("input,select,textarea").forEach(control => control.addEventListener("input", calc));
restoreDraft();
drawItems();
drawPayments();
