# ScopeLedger

**Creative project estimates, made clear.** ScopeLedger is a local-first estimate builder for freelance designers, creative studios and small marketing teams. It turns creative deliverables into a transparent quote with item pricing, discount and tax calculations, payment milestones, scope notes and a printable client preview.

## Features

- Editable deliverables with quantity, rate and calculated line totals.
- Starter scopes for brand identity and social campaigns.
- Subtotal, percentage discount, tax and estimate total.
- Editable payment milestones with a 100% allocation check.
- Live client-facing estimate preview.
- Browser print / Save as PDF.
- JSON export for portable backups.
- Local browser autosave; no account, backend, API key, analytics or file upload.
- Responsive layout and no runtime dependencies.

## Quick start

No build step or package installation is required. Clone the repository and open `index.html` in a modern browser, or serve the folder with any static HTTP server:

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
5. Adjust payment milestones. Their percentages should total 100%.
6. Add inclusions, exclusions and terms so the scope is explicit.
7. Review the client preview and use **Print / Save PDF**.
8. Export JSON to keep a portable copy of the estimate.

Starter items and example rates are illustrative only. Replace them with the actual agreed scope and pricing.

## Data and privacy

The current draft is saved in this browser's local storage. Export JSON before clearing site data or moving to another browser. Imported data is validated for the supported version and bounded collection sizes. The app does not transmit estimate details to a server.

## Calculation rules

- Each line total is quantity multiplied by rate.
- The discount is percentage-based and capped at the subtotal.
- Tax is applied to the subtotal after discount using the rate entered by the user.
- Payment allocations are calculated from the final total; the final milestone absorbs rounding differences.

The currency selector changes formatting only; it does not convert currencies.

## Limitations

ScopeLedger is an estimating aid, not accounting, legal or tax advice. Confirm tax treatment and contract terms with a qualified professional. A printed estimate is not automatically a signed contract, invoice or proof of payment. The app does not send quotes, collect signatures, accept payments, manage clients or sync data across devices.

## License

MIT. See [LICENSE](LICENSE).
