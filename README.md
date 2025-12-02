# Contract Management System

## Development scripts

- `npm run dev` – start the Vite dev server (frontend).
- `npm run server` – start the Express bulk-upload API on `http://localhost:4000`.

Run both commands (in separate terminals) to exercise the bulk upload workflow locally. The Vite dev server proxies `/api/*` requests to the Express server.

## Bulk upload CSV format

The uploader expects a `.csv` file with the following headers (lowercase, comma-separated):

```
name,supplier,type,endDate,status,contractValue,durationMonths,area,reminder,internalContact,referenceNumber,notes,lastReviewed
```

At minimum, each row must include `name` and `supplier`. Other fields are optional; any blank values stay hidden on the contract view screen until you edit the record.

You can download a pre-formatted template from the Bulk Upload dialog inside the Contracts page, or generate your own file that follows the header order above. The backend also exposes a JSON endpoint at `POST /api/contracts/bulk-upload/json` for support teams who prefer to script uploads.

## Document expiry tracking

- Each document upload now includes an optional expiry date so teams can track when new versions (e.g. insurance certificates) are required.
- The contract detail page surfaces a compliance panel that highlights expiring or expired documents, providing a clear call to refresh files before they lapse.
- Editing or creating a contract lets you adjust both the file and its expiry date so alerts stay accurate.