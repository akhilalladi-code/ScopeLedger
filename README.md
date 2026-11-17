# ScopeLedger

**Creative project estimates, made clear.** ScopeLedger is a local-first estimate builder for freelance designers, creative studios and small marketing teams. It turns creative deliverables into a transparent quote with item pricing, discount and tax calculations, payment milestones, scope notes and a printable client preview.

## Features

- Editable deliverables with quantity, rate and calculated line totals.
- Starter scopes for brand identity and social campaigns.
- Subtotal, percentage discount, tax and estimate total.
- Payment milestones with strict 100% allocation validation.
- Live client-facing estimate preview.
- Browser print / Save as PDF with editor controls excluded from print.
- JSON export for portable backups, including when a payment split needs correction.
- Local browser autosave, bounded draft validation and an explicit Clear draft action.
- Responsive, keyboard-accessible interface with no runtime dependencies.
- Automated calculation tests and Chromium browser regression tests in GitHub Actions.

## Quick start

The app is static and has no build step. Clone the repository and serve the folder with any static HTTP server:

```bash
git clone https://github.com/akhilalladi-code/ScopeLedger.git
cd ScopeLedger
python -m http.server 8000
```

Visit [http://localhost:8000](http://localhost:8000).

## How to use

1. Enter the project, client, preparer and currency.
2. Add deliverables manually or load a starter scope.
3. Enter quantities and rates; the estimate recalculates as you edit.
4. Set a percentage discount and tax rate where applicable.
5. Adjust payment milestones. Their percentages must total exactly 100% before the client estimate can be printed.
6. Add inclusions, exclusions and terms so the scope is explicit.
7. Review the client preview and use **Print / Save PDF**.
8. Export JSON to keep a portable copy. Use **Clear draft** to remove the saved browser draft.

Starter items and example rates are illustrative only. Replace them with the actual agreed scope and pricing.

## Development and tests

Node.js 22 or later is recommended for development checks:

```bash
npm install
npm run check
npm test
npx playwright install chromium
npm run test:e2e
```

The unit tests cover pricing, rounding, payment validation and draft normalization. Playwright exercises the main browser flows in Chromium. GitHub Actions runs both suites for pull requests and non-main branch pushes. The app itself still runs without Node.js or npm.

## Data and privacy

The current draft is saved in this browser's local storage. Export JSON before clearing site data or moving to another browser. Draft loading validates the supported schema, bounds field lengths and collection sizes, and clamps numeric inputs. The app does not transmit estimate details to a server. Browser local storage is not encrypted by ScopeLedger; use a trusted device and manage browser access accordingly.

## Calculation rules

- Each line total is quantity multiplied by rate.
- The discount is percentage-based and capped at the subtotal.
- Tax is applied to the subtotal after discount using the rate entered by the user.
- Payment allocations are based on the final estimate total. The percentages must total 100%; only the final milestone absorbs cent-rounding differences after validation.

The currency selector changes formatting only; it does not convert currencies.

## Limitations

ScopeLedger is an estimating aid, not accounting, legal or tax advice. Confirm tax treatment and contract terms with a qualified professional. A printed estimate is not automatically a signed contract, invoice or proof of payment. The app does not send quotes, collect signatures, accept payments, manage clients or sync data across devices.

## License

MIT. See [LICENSE](LICENSE).
