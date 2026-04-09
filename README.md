# ProfConnect — College Portal Frontend

ProfConnect is a researcher/professor-focused portal that helps you **connect Google Scholar** and manage your academic output in one place — **research papers, patents, projects**, and related insights.

This repository contains the **frontend (UI)** for ProfConnect, built with **Vite + React** and styled with **Tailwind CSS**.

---

## What you can do with ProfConnect

- **Google Scholar integration** (sign-in + sync flow)
- Manage your academic portfolio:
  - **Papers / publications**
  - **Patents**
  - **Projects**
- Dashboard experience with key views & actions
- Collections / library workflows
- Admin area (user overview & admin dashboard)

> Note: Exact capabilities depend on the backend features enabled and your account permissions.

---

## Tech stack

- **React 19** (SPA)
- **Vite** (dev server + build)
- **react-router-dom** (routing)
- **Tailwind CSS** (styling)
- **Axios** (API calls)
- **@react-oauth/google** (Google OAuth provider)
- **recharts** (charts)
- **react-hot-toast** (toasts)
- **lucide-react** (icons)

---

## Getting started (local development)

### Prerequisites

- Node.js (recommended: latest LTS)
- npm (ships with Node)

### 1) Install dependencies

From the `COLLEGE_PORTAL_FRONTEND` folder:

```bash
npm install
```

### 2) Configure environment variables

The Axios client reads the backend base URL from `import.meta.env.VITE_BASE_URL`.

Create a `.env` file in `COLLEGE_PORTAL_FRONTEND/`:

```bash
VITE_BASE_URL=http://localhost:3000
```

Update the value to match where your backend/API is running.

> The app will throw an error on startup if `VITE_BASE_URL` is missing.

### 3) Start the dev server

```bash
npm run dev
```

Vite will print the local dev URL in the terminal.

---

## Available scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

---

## Project structure (high level)

```text
COLLEGE_PORTAL_FRONTEND/
  public/
  src/
	api/                 # API wrappers (axios instance + feature modules)
	components/          # Reusable UI components
	  common/            # Shared components (e.g., route guards)
	  dashboard/         # Dashboard-specific components/modals
	  layout/            # Layout components (e.g., Sidebar)
	  library/           # Library / collections components
	context/             # React context (e.g., AuthContext)
	hooks/               # Custom hooks (e.g., debounce)
	pages/               # Route-level pages
	  admin/             # Admin pages
	App.jsx              # App shell + routes
	main.jsx             # App entrypoint (Google OAuth provider)
```

---

## API & authentication notes

- The shared Axios instance is defined in `src/api/axios.js` and uses:
  - `baseURL: VITE_BASE_URL`
  - `withCredentials: true` (cookie-based auth / cross-site cookies supported by backend)

If your backend uses cookies for auth, ensure:

- Backend sends the proper `Set-Cookie` attributes
- CORS is configured to allow credentials
- Your `VITE_BASE_URL` matches the backend origin you intend to call

---

## Google OAuth

The app wires Google OAuth via `@react-oauth/google` in `src/main.jsx`.

If you need to change the Google Client ID, update it there (or consider moving it into an env var such as `VITE_GOOGLE_CLIENT_ID` for different environments).

---

## Deployment

Build the app:

```bash
npm run build
```

Deploy the generated `dist/` folder to any static host (Vercel, Netlify, S3, Firebase Hosting, etc.).

Make sure your deployment environment provides `VITE_BASE_URL` at build time.

---

## Contributing

Contributions are welcome.

Suggested workflow:

1. Create a feature branch
2. Make changes
3. Run `npm run lint`
4. Open a PR with a clear description and screenshots (if UI changes)

---

## Repository context

This frontend is part of the broader **ProfConnect** project.

- Backend lives in the sibling directory `college_project/` (Node/Express).

