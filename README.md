# Store Locator Map Dashboard

React + Vite + Tailwind + Leaflet dashboard: filters, map markers by client color, radius circle + Haversine nearby list from a public Google Sheet (opensheet).

## Run locally

```bash
cd version2
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

Optional: override the sheet URL with an env var:

```bash
VITE_SHEET_URL="https://opensheet.elk.sh/YOUR_ID/Sheet1" npm run dev
```

## Google Sheet format

Publish the sheet so **opensheet** (or your JSON proxy) can read it. First row = headers.

### Preferred columns (new schema)

| city   | client   | store_name   | latitude | longitude |
|--------|----------|--------------|----------|-----------|
| Delhi  | Blinkit  | CP Hub       | 28.6139  | 77.2090   |

### Legacy columns (still supported)

The bundled URL matches the older sheet shape: `City`, `Client`, `lat`, `lng`. Store names are synthesized when `store_name` is missing.

**Clients** must resolve to one of: **Zepto, Blinkit, Zudio, Instamart, Flipkart** (case-insensitive). Rows with unknown clients are skipped.

## Mock fallback

If the network request fails or every row fails validation, the app loads `src/data/mockStores.json` and shows a yellow banner.

## Project structure

- `src/App.jsx` — layout, filter state, nearby computation
- `src/components/Filters.jsx` — sidebar filters + legend
- `src/components/MapView.jsx` — Leaflet map, markers, radius circle
- `src/components/NearbyList.jsx` — sorted nearby table
- `src/hooks/useStoreData.js` — fetch + normalize + fallback
- `src/utils/haversine.js` — distance + nearby search
- `src/utils/normalizeSheetRow.js` — sheet row → store object
- `src/constants/clients.js` — client colors + aliases





  // "scripts": {
  //   "dev": "vite",
  //   "build": "vite build",
  //   "preview": "vite preview"
  // },