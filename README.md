# ScopeLedger

**Creative project estimates, made clear.** ScopeLedger is a local-first quote builder for freelance designers, creative studios and small marketing teams. Turn a list of deliverables into a transparent estimate with line-item pricing, configurable adjustments, payment milestones and a client-ready document.

ScopeLedger fills the step between a creative brief and production: **what is included, how much it costs, when it is due, and what is outside the scope.** It is intentionally separate from a brief-writing tool or a full project-management system.

## Why ScopeLedger?

A project can have a clear brief and still begin with an unclear quote. Vague package prices make revisions, exclusions and payment expectations harder to discuss. ScopeLedger makes the commercial side of a creative handoff explicit without requiring an account, a paid service or a cloud database.

## Features

- **Line-item estimates:** describe each deliverable, quantity, unit and rate.
- **Starter scopes:** brand identity, social campaign, brochure / print and creator launch packs. These are editable starting points, not fixed market prices.
- **Transparent totals:** subtotal, percentage or fixed discount, taxable amount, configurable tax rate and estimated total.
- **Payment milestones:** set named milestones and percentages; the tool checks that they add up to 100% and reconciles the final rounded amount.
- **Client-ready preview:** project details, validity, turnaround, scope, pricing, payment schedule, inclusions, exclusions and terms.
- **Print / PDF:** use the browser's print dialog to save a clean A4 estimate as PDF.
- **Portable JSON:** export a draft for backup or import it in another browser.
- **Autosave:** the current draft is stored in this browser's `localStorage`.
- **Privacy by default:** calculations and imports run locally; there is no account, backend, API key, analytics SDK or upload endpoint.
- **No runtime dependencies:** built with browser APIs and the Node.js standard library.

## Quick start

Requirements: Node.js 20 or newer.

```bash
git clone https://github.com/akhilalladi-code/ScopeLedger.git
cd ScopeLedger
npm run dev
```

Open [http://127.0.0.1:4175](http://127.0.0.1:4175).

You can also serve the static files with any local HTTP server. A local server is recommended because the app uses JavaScript modules.

## How to use

1. Choose **Example** to inspect a complete illustrative estimate, or start with the blank workspace.
2. Add the project name, client, estimate dates, turnaround and currency.
3. Add deliverables manually or choose an editable starter scope.
4. Enter a quantity, unit and rate for each line item.
5. Add a discount or tax rate only when applicable. ScopeLedger does not choose a tax rate for you.
6. Adjust the payment milestones so their percentages total exactly 100%.
7. Write down what is included, what is excluded and any assumptions or payment terms.
8. Review the live client preview, then choose **Print quote** and save as PDF.
9. Export JSON to keep an editable backup or move the estimate to another browser.

The initial workspace is intentionally blank. Starter-scope buttons add editable line items; they do not claim to be market rates. Replace every name, quantity and rate with the details of the actual project.

## Quality checks

```bash
npm test
npm run check
```

Tests use Node's built-in test runner. No test framework or dependency installation is required.

## Data and privacy

- Drafts are stored under the `scopeledger.estimate.v1` key in this browser's local storage.
- Export JSON before clearing site data or changing browsers; browser storage is not a backup service.
- Imported JSON is limited to 1 MB and normalized to the supported version-1 fields.
- The application does not upload project or client details. The development server binds to `127.0.0.1` only.
- Do not put sensitive personal, financial or confidential information into an estimate unless your own device and browser storage are appropriate for it.

## Calculation rules

- Each line amount is `quantity × rate`, rounded to two decimal places.
- Percentage discounts are calculated against the subtotal. Fixed discounts cannot reduce the taxable amount below zero.
- Tax is calculated on the subtotal after discount using the rate entered by the user.
- Payment amounts are calculated from the estimate total. The last milestone absorbs any rounding remainder so the displayed allocations reconcile to the total.
- The currency selector changes display formatting; it does not perform currency conversion.

## Important limitations

- ScopeLedger is an estimating and document-preparation aid, not accounting, legal or tax advice.
- Tax treatment, invoicing requirements, withholding, statutory disclosures and contract terms vary by jurisdiction and transaction. Confirm the correct treatment with a qualified professional before issuing a formal quote.
- Starter scopes and sample rates are illustrative. They are not market benchmarks or recommendations.
- A printed estimate is not automatically a signed contract, invoice, purchase order or proof of payment.
- The app does not send quotes, collect signatures, accept payments, manage clients, track time, or sync data between devices.
- A browser's print-to-PDF output may vary slightly by browser and printer settings. Review the PDF before sending it.

## Project structure

```text
scopeledger/
├── .github/workflows/
│   ├── ci.yml
│   └── pages.yml
├── docs/
│   ├── RELEASE-CHECKLIST.md
│   └── REPOSITORY-SETUP.md
├── src/
│   ├── app.js
│   ├── core.js
│   └── styles.css
├── tests/
│   └── core.test.js
├── index.html
├── server.mjs
├── package.json
├── SECURITY.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Deploy to GitHub Pages

The included `pages.yml` workflow publishes the repository root as a static GitHub Pages site after a push to `main` or a manual workflow dispatch.

1. Open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source.
2. Push to `main` or run the **Deploy ScopeLedger to GitHub Pages** workflow.
3. Wait for the Pages deployment workflow to complete. GitHub will show the live URL in **Settings → Pages**.

No build step is needed; the site is static. The deployment workflow has Pages-scoped permissions and does not need repository secrets.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please add tests for calculation and validation changes, keep the local-first default, and document any new data collection or external service.

## Security

See [SECURITY.md](SECURITY.md) for responsible vulnerability reporting and the application's data-handling boundaries.

## License

MIT. See [LICENSE](LICENSE).
