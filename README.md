# Watrmark Print Quote Calculator

A production-ready Next.js 14 web application for Watrmark Pvt Ltd. Users upload PNG/JPG artwork, enter print dimensions and quantity, and receive an estimated print quote based on server-side pixel analysis, CMYK-style ink density simulation, billing tiers, and Watrmark pricing rules.

## Tech Stack

- Next.js 14 App Router
- React
- TypeScript
- Tailwind CSS
- Node.js API route
- Sharp.js image processing
- Vercel-ready deployment

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Folder Structure

```text
app/
  api/analyze/route.ts   Server-side upload validation, image analysis, and quote response
  globals.css            Tailwind base styles and app background
  layout.tsx             App metadata and root layout
  page.tsx               Main calculator UI
components/
  LoadingSpinner.tsx     Button loading state
  LogoMark.tsx           Watrmark brand header mark
  ResultCards.tsx        Quote metrics and WhatsApp action
  UploadDropzone.tsx     Drag-and-drop image upload component
lib/
  constants.ts           Business details, upload limits, and pricing variables
  image-analysis.ts      Sharp.js pixel analysis and CMYK density simulation
  pricing.ts             Billing tier mapping and pricing formula
  types.ts               Shared TypeScript types
utils/
  format.ts              Currency and number formatting helpers
  validation.ts          Client-side input validation
  whatsapp.ts            URL-encoded WhatsApp quote generator
```

## Pricing Configuration

Update pricing values in `lib/constants.ts`.

```ts
export const PRICING = {
  INK_COST_PER_LITRE: 3500,
  INK_YIELD_ML: 900,
  COST_PER_ML: 3.8889,
  INK_CONSUMPTION_100: 0.005,
  OVERHEAD_PER_UNIT: 0.49,
  PROFIT_MARGIN: 0.2,
  MINIMUM_PRICE_PER_UNIT: 0.5,
  MINIMUM_AREA: 9
};
```

Business details and WhatsApp number are also in `lib/constants.ts`.

## Image Analysis Logic

The `/api/analyze` route keeps heavy work server-side. It validates JPG/PNG uploads up to 5MB, resizes large images to a maximum analysis dimension, removes transparent and near-white pixels, converts printable pixels to CMYK-style density, and maps the result to billing tiers:

- Up to 10% coverage: 10% billing
- Up to 25% coverage: 25% billing
- Up to 50% coverage: 50% billing
- Above 50% coverage: 100% billing

## Deploying to Vercel

1. Push this project to a Git repository.
2. Import the repository in Vercel.
3. Keep the framework preset as Next.js.
4. Deploy.

Sharp is included as a dependency and runs in the Node.js API route. No extra Vercel configuration is required for the current implementation.
