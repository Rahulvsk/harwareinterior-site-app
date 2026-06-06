# Deployment Guide — Hardware & Interior Studio

Three apps + one database:

| Part | Folder | Host | Notes |
|------|--------|------|-------|
| Backend API | `backend/` | **Railway** | Node/Express, port from `PORT` |
| Admin panel | `dashtar/` | **Vercel** | Vite SPA |
| Storefront | `store/` | **Vercel** | Next.js |
| Database | — | **MongoDB Atlas** | already created |

You can keep all three in **one GitHub repo** (a monorepo). Vercel and Railway both let you point a project at a sub-folder ("Root Directory"), so no need to split into three repos.

---

## 0. Before you push (important)

1. **Rotate the MongoDB password.** The old one (`HARD2456`) was committed in plaintext earlier, so treat it as compromised. In Atlas → Database Access → edit user → set a new password, then update `MONGO_URI` everywhere.
2. **Make the GitHub repo PRIVATE** (the `.env` files hold real secrets). The `.gitignore` files are now fixed to exclude `.env`, but private is still safest.
3. Confirm your `.env` files are NOT staged: after `git add`, run `git status` and make sure no `.env` (only `.env.example`) appears.
4. Generate fresh secrets if you want (optional but recommended):
   - `openssl rand -hex 32` for `ENCRYPT_PASSWORD` / `JWT_*` secrets.
   - `ENCRYPT_PASSWORD` (backend) **must equal** `VITE_APP_ENCRYPT_PASSWORD` (admin), or role-based access breaks.

---

## 1. Push to GitHub

```bash
cd "Main_Folder"
git init
git add .
git status                 # verify no .env files are listed
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

---

## 2. MongoDB Atlas

1. Cluster → **Network Access** → add `0.0.0.0/0` (allow from anywhere) so Railway can connect.
2. **Database Access** → ensure a user exists with a new password.
3. Copy the connection string (`mongodb+srv://...`) — this is your `MONGO_URI`.

---

## 3. Backend → Railway (do this FIRST)

1. railway.app → **New Project → Deploy from GitHub repo** → pick your repo.
2. Open the service → **Settings → Root Directory** = `backend`.
3. Railway auto-detects Node and runs `npm install` then `npm start` (`node api/index.js`). No change needed.
4. **Variables** tab → add everything below (don't set `PORT` — Railway injects it):

```
MONGO_URI=<your atlas uri>
JWT_SECRET=<secret>
JWT_ACCESS_LIFETIME=15m
JWT_REFRESH_SECRET=<secret>
JWT_REFRESH_LIFETIME=7d
JWT_SECRET_FOR_VERIFY=<secret>
ENCRYPT_PASSWORD=<32-hex, MUST match admin>
STRIPE_KEY=<stripe secret key>
MAX_AMOUNT=10000.0
MIN_AMOUNT=10.0
AMOUNT_STEP=5.0
CURRENCY=usd
STRIPE_PAYMENT_DESCRIPTION=Hardware & Interior Studio payment
SERVICE=gmail
EMAIL_USER=<email>
EMAIL_PASS=<gmail app password>
HOST=smtp.gmail.com
EMAIL_PORT=465
STORE_URL=<fill after step 5>
ADMIN_URL=<fill after step 4>
# optional: enable the secret-keys guard (set same value in the store too)
# STORE_API_SECRET=<random string>
```

5. **Settings → Networking → Generate Domain.** Copy the URL, e.g. `https://your-backend.up.railway.app`.
   - Your API base is that URL **+ `/v1`**.

---

## 4. Admin → Vercel

1. vercel.com → **Add New → Project** → import the repo.
2. **Root Directory** = `dashtar`. Framework preset = **Vite** (build `npm run build`, output `dist`). A `vercel.json` is already included for SPA routing.
3. **Environment Variables:**

```
VITE_APP_API_BASE_URL=https://your-backend.up.railway.app/v1
VITE_APP_API_SOCKET_URL=https://your-backend.up.railway.app
VITE_APP_STORE_DOMAIN=https://<store-url>           (fill after step 5)
VITE_APP_ADMIN_DOMAIN=https://<this-admin-url>/login (fill after deploy; keep the /login)
VITE_APP_CLOUD_NAME=<cloudinary cloud name>
VITE_APP_CLOUDINARY_API_KEY=<...>
VITE_APP_CLOUDINARY_API_SECRET=<...>
VITE_APP_CLOUDINARY_UPLOAD_PRESET=<...>
VITE_APP_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/<cloud name>/image/upload
VITE_APP_MYMEMORY_API_KEY=<optional>
VITE_APP_ENCRYPT_PASSWORD=<MUST match backend ENCRYPT_PASSWORD>
```

4. Deploy → note the URL, e.g. `https://your-admin.vercel.app`. Put `https://your-admin.vercel.app/login` back into `VITE_APP_ADMIN_DOMAIN` and redeploy.

---

## 5. Store → Vercel

1. **Add New → Project** → same repo, **Root Directory** = `store`. Framework = **Next.js** (auto).
2. **Environment Variables:**

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend.up.railway.app/v1
NEXT_PUBLIC_API_SOCKET_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_STRIPE_KEY=<stripe publishable key>
NEXT_PUBLIC_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/<cloud name>/image/upload
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<...>
NEXT_PUBLIC_STORE_DOMAIN=https://<this-store-url>/   (fill after deploy)
NEXTAUTH_URL=https://<this-store-url>                (fill after deploy)
NEXTAUTH_SECRET=<keep your value>
# optional, only if you enabled it on the backend:
# STORE_API_SECRET=<same value as backend>
```

3. Deploy → note the URL. Put it back into `NEXT_PUBLIC_STORE_DOMAIN` and `NEXTAUTH_URL`, then redeploy.

---

## 6. Wire the URLs together (final pass)

Now that all three URLs exist, go back and fill the blanks, then redeploy each:

- **Railway backend:** `ADMIN_URL` = admin URL, `STORE_URL` = store URL.
- **Vercel admin:** `VITE_APP_STORE_DOMAIN` = store URL, `VITE_APP_ADMIN_DOMAIN` = admin URL + `/login`.
- **Vercel store:** `NEXT_PUBLIC_STORE_DOMAIN` + `NEXTAUTH_URL` = store URL.

---

## 7. First login / seed data

- The admin **Sign Up** page (`/signup`) still works publicly and creates an admin account — use it once to make your first admin, then log in.
- Alternatively seed locally against Atlas: in `backend/` with the production `MONGO_URI` in `.env`, run `npm run data:import`.

---

## Gotchas specific to this project

- **`/v1` matters.** The admin/store API base URL must end in `/v1` (the backend mounts routes under `/v1/...`).
- **ENCRYPT_PASSWORD must match** between backend and admin or roles/permissions silently fail.
- **Secret-keys endpoint:** `GET /v1/setting/store-setting/keys` returns payment/OAuth secrets. It's open by default. To lock it, set `STORE_API_SECRET` to the same value on **both** the Railway backend and the Vercel store, then redeploy both.
- **CORS** is currently open (`app.use(cors())`), so cross-origin from Vercel works out of the box. Tighten later if desired.
- **Real-time notifications** (socket.io) are commented out in the backend, so the socket URL is unused for now — harmless.
- After changing any env var on Vercel/Railway, you must **redeploy** for it to take effect.
