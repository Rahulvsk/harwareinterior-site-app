# Hardware & Interior Studio — Complete Setup Guide

Follow this top to bottom. It covers hosting the website (GitHub + MongoDB Atlas + Railway + Vercel) and building/downloading the mobile apps (APK from GitHub Actions, Expo Go testing, and store publishing).

**What goes where**

| Piece | Folder | Host |
|-------|--------|------|
| Backend API | `backend/` | Railway |
| Admin panel | `dashtar/` | Vercel |
| Storefront | `store/` | Vercel |
| Customer mobile app | `mobile/customer-app/` | GitHub Actions → APK / App stores |
| Admin mobile app | `mobile/admin-app/` | GitHub Actions → APK / App stores |
| Database | — | MongoDB Atlas |

> Exact env-var **values** for your project were shared separately (and live in your local `.env` files). This guide uses placeholders so it's safe to commit.

---

# PART 1 — Host the website

### Step 1. Create accounts (free unless noted)
- GitHub, MongoDB Atlas, Railway, Vercel.

### Step 2. Push the code to GitHub (PRIVATE repo)
Your `.env` files contain real secrets, so keep the repo private.

```bash
cd "Main_Folder"
git init
git add .
git status        # IMPORTANT: confirm no .env files appear (only .env.example)
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
If any `.env` shows in `git status`, stop and tell me — the `.gitignore` files are already set to exclude them, but double-check.

### Step 3. MongoDB Atlas
1. Create (or open) a cluster.
2. **Database Access** → create a user → **set a NEW password** (the old one was exposed, rotate it).
3. **Network Access** → add IP `0.0.0.0/0` (allow from anywhere) so Railway can connect.
4. **Connect → Drivers** → copy the connection string. This is your `MONGO_URI`.

### Step 4. Deploy the backend on Railway (DO THIS FIRST)
Everything else needs the backend URL.
1. railway.app → **New Project → Deploy from GitHub repo** → pick your repo.
2. Open the service → **Settings → Root Directory** = `backend`.
3. Railway auto-runs `npm install` then `npm start` (`node api/index.js`). No change needed.
4. **Variables** tab → add the backend env vars (don't set `PORT`, Railway injects it):
   `MONGO_URI, JWT_SECRET, JWT_ACCESS_LIFETIME, JWT_REFRESH_SECRET, JWT_REFRESH_LIFETIME, JWT_SECRET_FOR_VERIFY, ENCRYPT_PASSWORD, STRIPE_KEY, MAX_AMOUNT, MIN_AMOUNT, AMOUNT_STEP, CURRENCY, STRIPE_PAYMENT_DESCRIPTION, SERVICE, EMAIL_USER, EMAIL_PASS, HOST, EMAIL_PORT, STORE_URL, ADMIN_URL`
5. **Settings → Networking → Generate Domain.** Copy it, e.g. `https://your-backend.up.railway.app`.
6. **Your API base URL = that domain + `/v1`.** You'll reuse this everywhere.

### Step 5. Deploy the admin on Vercel
1. vercel.com → **Add New → Project** → import the repo.
2. **Root Directory** = `dashtar`. Framework = **Vite** (build `npm run build`, output `dist`). A `vercel.json` for SPA routing is already included.
3. **Environment Variables** — the `VITE_*` set, with:
   - `VITE_APP_API_BASE_URL = https://your-backend.up.railway.app/v1`
   - `VITE_APP_API_SOCKET_URL = https://your-backend.up.railway.app`
4. Deploy → note the admin URL. Set `VITE_APP_ADMIN_DOMAIN = https://<admin-url>/login` and redeploy.

### Step 6. Deploy the store on Vercel
1. **Add New → Project** → same repo → **Root Directory** = `store` → Framework **Next.js** (auto).
2. **Environment Variables** — the `NEXT_PUBLIC_*` + `NEXTAUTH_*` set, with API base pointed at Railway.
3. Deploy → note the store URL → set `NEXT_PUBLIC_STORE_DOMAIN` and `NEXTAUTH_URL` to it → redeploy.

### Step 7. Wire all three together (final pass)
Now every URL exists. Fill the blanks and redeploy each:
- **Railway backend:** `ADMIN_URL` = admin URL, `STORE_URL` = store URL.
- **Vercel admin:** `VITE_APP_STORE_DOMAIN` = store URL, `VITE_APP_ADMIN_DOMAIN` = admin URL + `/login`.
- **Vercel store:** `NEXT_PUBLIC_STORE_DOMAIN` + `NEXTAUTH_URL` = store URL.

### Step 8. First login
- Open the admin site → **Sign Up** to create your first admin account → log in.
- (Or seed locally: in `backend/` with production `MONGO_URI` in `.env`, run `npm run data:import`.)

✅ The website is live.

---

# PART 2 — The mobile apps

### Step 9. Point the apps at your live backend
Edit **both** `mobile/customer-app/app.json` and `mobile/admin-app/app.json`:
```json
"extra": { "apiBaseUrl": "https://your-backend.up.railway.app/v1" }
```
Commit and push. (For local testing on a phone instead, use your computer's LAN IP, e.g. `http://192.168.1.20:5055/v1` — `localhost` won't work from a real phone.)

### Step 10. Get the APK from GitHub Actions (no paid account needed)
Two workflows are already in `.github/workflows/`. They build an installable Android APK in the cloud and attach it to the run.

1. Push the repo to GitHub (Part 1, Step 2) — this includes the `.github/workflows` files.
2. On GitHub, open the **Actions** tab.
3. Pick **"Build Customer APK"** (or **"Build Admin APK"**) → click **Run workflow** → choose `main` → **Run**.
4. Wait ~10–20 min for it to finish (green check).
5. Open the finished run → scroll to **Artifacts** → download **`customer-app-apk`** (or `admin-app-apk`). Inside is the `.apk`.
6. Copy the `.apk` to an Android phone and open it to install. (You may need to allow "Install unknown apps" for your file manager/browser.)

> These APKs are signed with a debug key — perfect for testing and sharing directly, but **not** accepted by the Google Play Store. For Play Store you need a release build (Step 12).

### Step 11. Test instantly on your own phone (optional, fastest)
```bash
cd mobile/customer-app   # or mobile/admin-app
npm install
npx expo start
```
Install **Expo Go** on your phone, scan the QR code, and the app runs live with hot reload.

### Step 12. Publish to the App Store & Play Store
For public downloads you build proper store binaries with Expo EAS:
```bash
npm install -g eas-cli
eas login
cd mobile/customer-app          # repeat for admin-app
eas build:configure
eas build --platform android    # .aab for Play Store
eas build --platform ios        # .ipa for App Store
eas submit --platform android
eas submit --platform ios
```
**Paid accounts (only you can create them):**
- Apple Developer Program — **$99/year** (App Store).
- Google Play Developer — **$25 one-time** (Play Store).
- Expo account — free (for EAS Build).

Before submitting: add a real 1024×1024 app icon + splash, set the app name, bump `version` in `app.json`. Store review usually takes a few days.

---

# Troubleshooting

- **App shows no products / "Could not load":** the `apiBaseUrl` in `app.json` is wrong or the backend is unreachable. Confirm the Railway URL ends in `/v1` and opens in a browser.
- **Admin login fails on mobile:** make sure an admin account exists (created via the web admin) and the API URL is the live backend.
- **GitHub Action fails at "Build APK":** open the failed step's logs. Most common causes are a syntax error in `app.json` or a dependency version mismatch — re-run after `npx expo install` locally to sync versions.
- **Env var change didn't take effect:** Vercel and Railway require a **redeploy** after editing variables.
- **Secrets:** never commit `.env`. Rotate the MongoDB password, Gmail app password, and Google OAuth secret since they were exposed earlier.

---

# Quick reference — deploy order

1. GitHub (private) → 2. Atlas (rotate password) → 3. Railway backend → 4. Vercel admin → 5. Vercel store → 6. wire URLs → 7. set app `apiBaseUrl` → 8. run GitHub Action → download APK.

Host the **backend first** — the website frontends and both mobile apps all depend on its URL.
