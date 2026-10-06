# Overdriveauto

Online car, truck and performance parts store for Tanzania, with a private operations site for running orders from Canada.

- **Store** (`index.html`): find parts by vehicle or part number, five supply sources (Dar stock, Kariakoo partner shops, Japan, Canada, China), cart with deposits and delivery options, part requests, seller sign-ups and trade prices.
- **Operations site** (`index.html#ops`): orders board with every step from New to Closed, payments, WhatsApp message templates, Dar stock, part requests, seller sign-ups, costs and margins, sales and profit dashboard, CSV export.

Status: prototype. Parts, prices, part numbers and fitment in the catalogue are examples.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site: store and operations site, with all styles and scripts inline |
| `404.html` | "Page not found" page |
| `favicon.svg` | Site icon |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Run it

Open `index.html` in a browser. No build step and no dependencies; fonts load from Google Fonts.

## Publish with GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. The site appears at `https://<your-username>.github.io/<repo-name>/` after a minute or two.

## Important: where the live database runs

Saving orders to a database and the operations site use the claude.ai artifact runtime (`window.claude.use("db")`), so they only work when the page is opened as a Claude artifact. On GitHub Pages or any other host:

- Orders, part requests and seller sign-ups fall back to WhatsApp messages sent to the business number.
- `#ops` shows "Operations needs the live database".

To run fully on your own domain, replace the `CLOUD` block in the first `<script>` (and `subscribe()` / `write()` in the operations script) with a real backend such as Supabase or Firebase, and add customer and owner logins. The data model below carries over unchanged.

## Data model

| Path | Contents |
|---|---|
| `orders/{OD-xxxxx}` | `no`, `createdAt`, `status`, `customer {name, phone, area}`, `vehicle`, `chassis`, `items [{pid, name, brand, oem, src, qty, price, cost?}]`, `trade`, `delivery {method, label, fee}`, `payMethod`, `sub`, `total`, `dueNow`, `later`, `paid`, `payments [{amount, method, at, note?}]`, `history [{status, at, note?}]`, `supplier {ref, tracking}`, `note`, `stockDeducted` |
| `requests/{RQ-xxxx}` | `part`, `qty`, `vehicle`, `chassis`, `cond`, `speed`, `photo`, `customer`, `status` (new, quoted, won, lost), `quote {price, src, eta, at}`, `note` |
| `sellers/{SL-xxxx}` | `shop`, `area`, `sells`, `phone`, `status` (new, contacted, approved, declined), `note` |
| `shared/stock` | `items {productId: {qty, min}}`: Dar shelf counts, read by the store |
| `private/costs` | `costs {productId: cost}`: owner only |
| `private/settings` | `payInfo`: payment details used in WhatsApp messages; owner only |

Order steps: New → Confirmed → Paid → (imported parts: Ordered → In transit → Clearing) → Ready → Out for delivery → Delivered → Closed, or Cancelled.

## Settings in the code

- `WA_NUMBER` and `WA_DISPLAY` (first script): the WhatsApp number orders go to.
- `PRODUCTS`, `VEHICLES`, `SRC`, `DELIVERY`, `PAY` (first script): catalogue, vehicles, supply sources, delivery options and payment methods.
- `COST_RATIO` (operations script): profit estimates used until real costs are entered.

## Contact

WhatsApp +1 778 325 0746 · orgkiza@gmail.com
