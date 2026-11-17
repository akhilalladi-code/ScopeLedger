import test from "node:test";
import assert from "node:assert/strict";
import { calculateEstimate, calculatePayments, normalizeEstimate, defaultEstimate } from "../src/core.js";

test("calculates subtotal, discount, tax and total", () => {
  assert.deepEqual(calculateEstimate([{ qty: 2, rate: 100 }, { qty: 1, rate: 50 }], 10, 18), { subtotal: 250, discount: 25, taxable: 225, tax: 40.5, total: 265.5 });
});
test("payment schedule allocates exact total for a valid 50/50 split", () => {
  const result = calculatePayments(101.01, [{ title: "Start", percent: 50 }, { title: "Finish", percent: 50 }]);
  assert.equal(result.valid, true);
  assert.deepEqual(result.allocations.map(x => x.amount), [50.51, 50.5]);
  assert.equal(result.allocations.reduce((n, x) => n + x.amount, 0), 101.01);
});
test("rejects under- and over-allocated payment schedules", () => {
  assert.equal(calculatePayments(100, [{ title: "Only", percent: 20 }]).valid, false);
  assert.equal(calculatePayments(100, [{ title: "A", percent: 60 }, { title: "B", percent: 60 }]).valid, false);
});
test("normalizes malformed and oversized draft data safely", () => {
  const { data, warnings } = normalizeEstimate({ version: 1, fields: { project: "x".repeat(500), currency: "FAKE", discount: 900, tax: -5 }, items: [{ title: "<script>", qty: -2, rate: "NaN" }], payments: [{ title: "Deposit", percent: 120 }] });
  assert.equal(data.fields.project.length, 160); assert.equal(data.fields.currency, "INR");
  assert.equal(data.fields.discount, "100"); assert.equal(data.fields.tax, "0");
  assert.deepEqual(data.items[0], { title: "<script>", qty: 0, rate: 0 });
  assert.equal(data.payments[0].percent, 100); assert.ok(Array.isArray(warnings));
});
test("returns a fresh estimate for unsupported draft versions", () => {
  const result = normalizeEstimate({ version: 99 });
  assert.deepEqual(result.data, defaultEstimate()); assert.ok(result.warnings.length);
});
test("caps calculation inputs and avoids negative amounts", () => {
  const result = calculateEstimate([{ qty: -5, rate: 20 }, { qty: 2, rate: 10 }], 150, -10);
  assert.equal(result.subtotal, 20); assert.equal(result.discount, 20); assert.equal(result.tax, 0); assert.equal(result.total, 0);
});
