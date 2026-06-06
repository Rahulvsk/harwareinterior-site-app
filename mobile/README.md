# Mobile Apps — Hardware & Interior Studio

Two React Native (Expo) apps that talk to your existing backend API (`/v1/...`):

| App | Folder | Who it's for |
|-----|--------|--------------|
| Customer shopping app | `customer-app/` | Shoppers: browse, search, cart, checkout, orders, login |
| Admin app | `admin-app/` | Staff: dashboard counts, manage orders, toggle product visibility |

Both reuse the **same backend** — no server changes needed. They are independent Expo projects.

---

## 1. Prerequisites (one time)

- Install **Node.js 18+**.
- Install the **Expo Go** app on your phone (App Store / Play Store) for quick testing.
- No Xcode/Android Studio needed to *run* in Expo Go. You only need them (or Expo's cloud build) to publish to the stores.

---

## 2. Point the app at your backend

Each app reads its API URL from `src/config.js` (falls back to `app.json` → `expo.extra.apiBaseUrl`).

Set it to one of:

- **Phone + Expo Go, backend on your computer:** `http://<your-computer-LAN-IP>:5055/v1` (e.g. `http://192.168.1.20:5055/v1`). `localhost` will NOT work from a physical phone.
- **Android emulator:** `http://10.0.2.2:5055/v1`
- **iOS simulator:** `http://localhost:5055/v1`
- **Production:** `https://your-backend.up.railway.app/v1`

Edit either `mobile/customer-app/app.json` and `mobile/admin-app/app.json`:

```json
"extra": { "apiBaseUrl": "https://your-backend.up.railway.app/v1" }
```

> Make sure your backend allows the app's origin. It currently uses open CORS, so no change is needed.

---

## 3. Run it

```bash
cd mobile/customer-app      # or mobile/admin-app
npm install
npx expo start
```

Then scan the QR code with **Expo Go** (Android) or the Camera app (iOS). Press `a` for an Android emulator or `i` for an iOS simulator if you have them.

**Admin app login:** use an existing admin/staff account (created via the web admin's Sign Up page or seed script).
**Customer app login:** use an account created on your store website.

---

## 4. What's included

**Customer app**
- Home: product grid (from `/products/store`), search, pull-to-refresh
- Product detail: image, price, discount, description, add to cart
- Cart: quantity +/-, remove, running total, checkout (posts to `/order/add`)
- Account: customer login (`/customer/login`), persisted session
- My Orders: list from `/order`

**Admin app**
- Login gate (`/admin/login`) — tabs only show after sign-in
- Dashboard: order counts from `/orders/dashboard-count`
- Orders: list from `/orders`, tap an order to change its status (`PUT /orders/:id`)
- Products: list from `/products`, toggle show/hide (`PUT /products/status/:id`)

These are core screens meant as a foundation — payments (Stripe/Razorpay), push notifications, product variants, and address management are natural next additions.

---

## 5. Publishing to the App Store & Play Store

Expo's **EAS Build** compiles the native binaries in the cloud (no Mac required for Android; iOS builds also run in the cloud).

```bash
npm install -g eas-cli
eas login
cd mobile/customer-app      # repeat for admin-app
eas build:configure
eas build --platform android   # produces an .aab for Play Store
eas build --platform ios       # produces an .ipa for App Store
```

Then submit:

```bash
eas submit --platform android
eas submit --platform ios
```

**Accounts you'll need (paid, and only you can create them):**
- **Apple Developer Program** — $99/year — required for the App Store.
- **Google Play Developer** — $25 one-time — required for the Play Store.
- An **Expo account** (free) for EAS Build.

**Before submitting:** add a real app icon (1024×1024) and splash image, set the app name, and bump `version` in `app.json`. The store review process typically takes a few days.

---

## Notes / gotchas

- I removed the custom `icon` from `app.json` so the app boots with Expo's default — add your own before publishing.
- Tab icons use simple emoji to avoid an extra dependency; swap in `@expo/vector-icons` later if you want.
- If the product list is empty, the API URL in `config.js`/`app.json` is almost always the cause — verify the backend is reachable from the device.
- Dependency versions target **Expo SDK 52**. If you prefer a different SDK, run `npx expo install` after changing it so native modules stay compatible.
