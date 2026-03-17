# Kodak Workspace Overview

Single-file overview of the Kodak monorepo (all projects merged into this repo).

---

## 1. design — Design & assets (from kodak)

**Path in repo:** `design/`

- **Purpose:** Design and brand assets (no application code).
- **Contents:** `design-assets/`, `Logo/`, `Logo.zip`.
- **Note:** Shared brand/design assets for Kodak-related projects.

---

## 2. kodak_logistics — Web stack (backend + frontend)

**Path in repo:** `kodak_logistics/`

### Backend: kodak_transport

- **Stack:** Django 5.1, Django REST Framework, JWT (djangorestframework-simplejwt).
- **Database:** PostgreSQL (psycopg2-binary).
- **Other:** CORS (django-cors-headers), Whitenoise, Gunicorn, django-environ.
- **Entry:** `manage.py` (Django).
- **Dependencies:** `kodak_transport/requirements.txt`.

### Frontend: kodak-frontend

- **Stack:** Create React App, React 18, TypeScript.
- **UI:** Tailwind CSS, Radix UI, shadcn/ui, Lucide icons, Recharts.
- **Other:** React Router, react-hook-form, axios.
- **Scripts:** `npm start` (dev at http://localhost:3000), `npm run build`, `npm test`.
- **Config:** `kodak-frontend/package.json`.

### Repo layout

- `.venv` / `venv` / `env` (Python).
- `.vscode`, `Dockerfile`, `.dockerignore`.

---

## 3. KodakMobile — Mobile app (root of this repo)

**Path in repo:** root (`app/`, `components/`, `services/`, etc.)

- **Stack:** Expo (React Native), Expo SDK ~51, file-based routing (expo-router).
- **Styling:** NativeWind / Tailwind-style (tailwind.config.js).
- **Key deps:** axios, react-native-chart-kit, react-native-elements, react-native-gesture-handler, react-native-reanimated, expo-dev-client.
- **Targets:** iOS, Android, web.
- **Bundle IDs:** `com.kokai1.KodakMobile`.
- **EAS:** Project ID in `app.json` (extra.eas.projectId).
- **Layout:** `app/`, `components/`, `constants/`, `hooks/`, `services/`, `assets/`, `scripts/`, `app-example/`.
- **Scripts:** `npm start` (expo start), `npm run android`, `npm run ios`, `npm run web`, `npm run lint`.

---

## Summary (monorepo layout)

| Folder          | Type            | Tech                          |
|-----------------|-----------------|-------------------------------|
| design/         | Assets          | Design files, logos           |
| kodak_logistics/| Backend + Web   | Django REST, React (CRA)      |
| (root)          | Mobile app      | Expo / React Native           |
