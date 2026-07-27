# Resurf

A personal knowledge retrieval platform built with the MERN stack. Save files, links, and notes in one place — then find them by what they're *about*, not just what they're named.

---

## About

Resurf tackles the problem of scattered digital resources. Instead of hunting through bookmarks, downloads, and cloud drives, you store everything in one workspace organized by Collections and Topics, then search across titles, tags, and even the content inside PDFs and documents.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary
- **Auth:** JWT + bcrypt
- **Content Extraction:** pdf-parse, Tesseract.js (OCR), mammoth (DOCX), adm-zip (PPTX)
- **Deployment:** Docker, Vercel, Render

---

## Project Structure

```
Resurf/
├── backend/
│   ├── src/
│   │   ├── config/         # DB, Cloudinary, constants
│   │   ├── models/         # User, Collection, Topic, Resource
│   │   ├── routes/         # API route definitions
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/      # Auth (JWT), file upload (Multer)
│   │   ├── helpers/        # PDF/DOCX/PPTX parsing, link metadata, topic tree ops
│   │   └── utils/          # JWT tokens, email (Gmail API), Cloudinary helpers
│   └── Dockerfile
│
├── frontend/
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/     # Reusable UI components
│       └── pages/          # Landing, auth pages, main dashboard
│
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google Cloud project with Gmail API enabled (for password reset emails)
- GraphicsMagick + Ghostscript (for OCR support)

### Setup

```bash
git clone https://github.com/rashmishah06/Resurf.git
cd Resurf
```

**Backend:**

```bash
cd backend
npm install
npm run dev
```

Server runs at `http://localhost:4000`.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` with API proxied to the backend.

---

## Environment Variables

Create a `backend/.env` file:

```env
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/resurf
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

All variables are required. Cloudinary keys come from the [Cloudinary Console](https://cloudinary.com/console), Google credentials from the [Google Cloud Console](https://console.cloud.google.com).

---

## API Routes

All routes are under `/api/v1`. Authenticated routes require a `Bearer` token in the `Authorization` header.

**Users** (`/users`) — register, login, logout, get profile, forgot/reset password

**Collections** (`/collections`) — CRUD, favorite, pin, restore, permanent delete, create/get topics

**Topics** (`/topics`) — CRUD, favorite, pin, restore, permanent delete, move, duplicate

**Resources** (`/resources`) — CRUD, upload (file support), favorite, restore, permanent delete, move, duplicate

**Trash** (`/trash`) — get all trashed items

**Search** (`/search?q=...&type=...`) — search across resources by title, description, extracted text, and tags

---

## Supported Resource Types

Files: PDFs, presentations, spreadsheets, code files, archives, text files

Links: YouTube, GitHub, ChatGPT, Google Drive, LinkedIn, LeetCode, GeeksforGeeks, and general websites

---

## Deployment

| Service | URL |
|---------|-----|
| Frontend | [resurf-pi.vercel.app](https://resurf-pi.vercel.app) |
| Backend | [resurf.onrender.com](https://resurf.onrender.com) |

In development, Vite proxies `/api` requests to `localhost:4000`. In production, the frontend points directly to the Render backend.
