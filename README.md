# SizeMe — E-commerce Store

Premium brand T-shirts for plus sizes (2XL–7XL), Iraq-wide delivery.

## Structure

- `index.html` — the entire storefront (single-file site, Tailwind via CDN)
- `images/` — drop product photos here as `01-lacoste-e33.jpg`, `02-polo.jpg`, ... `15-lv.jpg` (see filenames in `index.html` PRODUCTS array)
- `video/brand-mission.mp4` — optional hero video (falls back to a "play" poster if missing)

## Business logic (implemented)

- Sizes: **2XL → 7XL**, each with a weight guide beneath the label
- 
- Languages: **Arabic (default, RTL)**, English, Kurdish — toggle in header
- Checkout: Country fixed to **Iraq**, Province dropdown + Area, Full Name, Address, Notes, Phone (WhatsApp note)
- Confirmation message includes customer name + replacement-guarantee note

## Contact (footer)

- Instagram / TikTok: **@sizem.e**
- WhatsApp: **07739334545**

## Running

Just open `index.html` in any browser. No build required.

## Adding products

Edit the `PRODUCTS` array in `index.html`. Colors accept any hex; the site auto-renders the color dots and size grid.

## Notes

- Orders currently show a confirmation locally. To forward orders to WhatsApp / email / a backend, wire the `#coForm` submit handler in `index.html`.
- All images load with an elegant brand-watermark fallback if the file is missing — the site remains presentable before you add photography.
