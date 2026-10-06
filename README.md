# Overdriveauto

Online car, truck and performance parts store for Tanzania, with a private operations site for running orders from Canada.

- **Store:** https://adnanabri.github.io/overdriveauto/. Find parts by vehicle or part number across five supply sources (Dar stock, Kariakoo partner shops, Japan, Canada, China). The cart handles deposits and delivery options, and the store takes part requests, seller sign-ups and trade prices.
- **Operations site:** https://adnanabri.github.io/overdriveauto/ops/, owner sign-in only. It has:
  - an orders board with every step from New to Closed
  - payments and WhatsApp message templates
  - Dar stock, part requests and seller sign-ups
  - costs and margins
  - a sales and profit dashboard, and CSV export

Status: prototype. Parts, prices, part numbers and fitment in the catalogue are examples.

## Files

| File | What it is |
|---|---|
| `index.html` | The store |
| `ops/index.html` | The operations site (sign-in required) |
| `assets/shared.js` | Settings, catalogue (parts, prices, vehicles), supply sources, delivery and payment options, icons |
| `assets/backend.js` | Database connector (Supabase) used by both sites |
| `assets/site.css` | Styles shared by both sites |
| `config.js` | Your Supabase project URL and publishable key |
| `supabase/setup.sql` | Creates the tables and security rules. Run once in Supabase |
| `supabase/example-data.sql` | Optional example orders, requests and sign-ups to try the operations site |
| `404.html`, `favicon.svg` | "Page not found" page and site icon |

## How access is protected

The store and the operations site share one Supabase database. The rules in `supabase/setup.sql` are enforced by the database itself, so they hold even though the website code is public:

- Customers can only **add** new orders, part requests and seller sign-ups. They can't read any of them, mark anything paid, or change existing records.
- Customers can read one thing: Dar stock counts, so the store can show "Only 2 left".
- Only accounts listed in the `admins` table can read or change orders, requests, sign-ups, costs and settings. Anyone else who signs in sees nothing.
- With public sign-ups turned off in Supabase, the only account is the one you create.

## Setting up the database

1. Create a project at supabase.com.
2. **Authentication → Users → Add user:** create your login (email and password).
3. In the Authentication settings, turn off sign-ups for new users.
4. **SQL Editor:** paste `supabase/setup.sql` and run it. If your login email isn't `orgkiza@gmail.com`, change it near the bottom first. The last line should show your email.
5. Optional: run `supabase/example-data.sql` to load example records. Remove them later from the operations site under Settings → Example data.
6. **Project Settings → API:** copy the Project URL and the publishable (anon) key into `config.js`. Never put the secret or service_role key in this repository.

Without `config.js` filled in, the store sends orders to WhatsApp and the operations site asks you to connect the database.

## Editing the catalogue

Parts, prices, vehicles and the WhatsApp number are in `assets/shared.js` (`PRODUCTS`, `VEHICLES`, `WA_NUMBER`). Push to `main` and GitHub Pages updates the site within a couple of minutes.

## Data model

| Table | Contents (`data` column) |
|---|---|
| `orders` | `no`, `createdAt`, `status`, `customer {name, phone, area}`, `vehicle`, `chassis`, `items [{pid, name, brand, oem, src, qty, price, cost?}]`, `trade`, `delivery {method, label, fee}`, `payMethod`, `sub`, `total`, `dueNow`, `later`, `paid`, `payments [{amount, method, at, note?}]`, `history [{status, at, note?}]`, `supplier {ref, tracking}`, `note`, `stockDeducted` |
| `requests` | `part`, `qty`, `vehicle`, `chassis`, `cond`, `speed`, `photo`, `customer`, `status` (new, quoted, won, lost), `quote {price, src, eta, at}`, `note` |
| `sellers` | `shop`, `area`, `sells`, `phone`, `status` (new, contacted, approved, declined), `note` |
| `kv` | `stock` → `{items: {productId: {qty, min}}}` (public), `costs` → `{costs: {productId: cost}}`, `settings` → `{payInfo}` (owner only) |
| `admins` | `user_id` of accounts allowed into the operations site |

Order steps: New → Confirmed → Paid → (imported parts: Ordered → In transit → Clearing) → Ready → Out for delivery → Delivered → Closed, or Cancelled.

## Contact

WhatsApp +1 778 325 0746 · orgkiza@gmail.com
