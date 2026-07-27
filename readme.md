# Resurf — Personal Knowledge Retrieval Platform

> **"You don't need to remember where you saved something. You only need to remember something about it."**

---

## Project Description

Resurf is a full-stack MERN application designed to solve the problem of **re-finding digital resources**, not just storing them.

Every day, people discover useful information from different sources — websites, PDFs, PowerPoint presentations, Word documents, YouTube videos, GitHub repositories, and personal notes. Over time, these resources become scattered across multiple platforms, making them difficult to locate when actually needed.

Resurf provides a centralized workspace where users can capture, organize, search, and rediscover their resources from a single place — and search by what a resource is *about*, not just what it's named.

### Key Features

- **Unified Resource Storage** — Upload files (PDFs, DOCX, PPTX, images, code, archives) or save links (YouTube, GitHub, websites, ChatGPT, Drive, LinkedIn, LeetCode, GFG) as Resources, all stored on Cloudinary
- **Hierarchical Organization** — Collections contain Topics, which can contain sub-topics infinitely deep (recursive tree structure)
- **Content-Aware Search** — Searches inside PDFs (via pdf-parse + OCR fallback for scanned docs), DOCX, PPTX, YouTube metadata, and link OG tags
- **Favorites & Pinned Items** — Two separate, always-accessible lists for quick recall
- **Soft Delete & Trash** — Items go to trash first, can be restored, or permanently deleted with cascading safety
- **Cut / Copy / Paste** — Move or duplicate resources and entire topic branches between collections
- **Dark & Light Theme** — Toggle with persistence across sessions
- **Reliable File Handling** — Files routed to correct Cloudinary storage type by MIME type; PDFs open inline, archives download normally

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router DOM 7, Axios, react-icons |
| Backend | Node.js (ES Modules), Express 5, Mongoose 8, MongoDB Atlas |
| File Storage | Cloudinary (images, videos, raw files) |
| Authentication | JWT (7-day expiry), bcrypt password hashing (10 salt rounds) |
| Email | Google Gmail API via OAuth2 |
| Content Extraction | pdf-parse, tesseract.js + pdf2pic (OCR), mammoth (DOCX), adm-zip (PPTX) |
| Deployment | Docker (backend), Vercel (frontend), Render (backend hosting) |

---

## Dependencies

### Backend

| Package | Purpose |
|---------|---------|
| `express` v5 | Web framework |
| `mongoose` v8 | MongoDB ODM |
| `jsonwebtoken` | JWT creation & verification |
| `bcrypt` | Password hashing (10 salt rounds) |
| `cloudinary` | Cloud file upload/delete |
| `multer` v2 | Multipart file upload handling |
| `dotenv` | Environment variable loading |
| `cors` | Cross-origin resource sharing |
| `googleapis` | Gmail API for password reset emails |
| `pdf-parse` | PDF text extraction |
| `tesseract.js` | OCR for scanned PDFs |
| `pdf2pic` | PDF to image conversion (for OCR pipeline) |
| `mammoth` | DOCX text extraction |
| `adm-zip` | PPTX slide text extraction |
| `crypto` | Password reset token generation |
| `nodemon` | Dev server auto-restart |

### Frontend

| Package | Purpose |
|---------|---------|
| `react` v19 | UI framework |
| `react-dom` v19 | React DOM renderer |
| `react-router-dom` v7 | Client-side SPA routing |
| `vite` v8 | Build tool & dev server |
| `tailwindcss` v4 | Utility-first CSS |
| `axios` | HTTP client (auth pages) |
| `react-icons` | Feather icons |

---

## Project Structure

```
Resurf/
├── backend/
│   ├── Dockerfile
│   ├── .env
│   ├── package.json
│   └── src/
│       ├── index.js                    # Server entry — starts Express on PORT
│       ├── app.js                      # Express app — middleware, CORS, route mounting
│       │
│       ├── config/
│       │   ├── database.js             # MongoDB Atlas connection via Mongoose
│       │   ├── constants.js            # DB_NAME constant
│       │   └── cloudinary.js           # Cloudinary SDK configuration
│       │
│       ├── models/
│       │   ├── user.model.js           # User — username, email, hashed password, reset tokens
│       │   ├── collection.model.js     # Collection — name, color, icon, favorite, pinned, soft-delete
│       │   ├── topic.model.js          # Topic — self-referencing parentTopic for nested tree
│       │   └── resource.model.js       # Resource — file/link, 17 subtypes, extractedText, metadata
│       │
│       ├── routes/
│       │   ├── user.route.js           # Auth endpoints (register, login, logout, profile, reset)
│       │   ├── collection.route.js     # Collection CRUD + favorite/pin/restore/permanent
│       │   ├── topic.route.js          # Topic CRUD + move/duplicate/restore/permanent
│       │   ├── resource.route.js       # Resource CRUD + move/duplicate/restore/permanent
│       │   ├── trash.route.js          # Get all trashed items
│       │   └── search.routes.js        # Search across resources, collections, topics
│       │
│       ├── controllers/
│       │   ├── user.controller.js
│       │   ├── collection.controller.js
│       │   ├── topic.controller.js
│       │   ├── resource.controller.js
│       │   ├── trash.controller.js
│       │   └── search.controller.js
│       │
│       ├── middleware/
│       │   ├── auth.middleware.js       # JWT verification → attaches req.user
│       │   └── upload.middleware.js     # Multer disk storage → tmp/resurf-uploads/
│       │
│       ├── helpers/
│       │   ├── file.helper.js          # File extension → subtype mapping (17 subtypes)
│       │   ├── pdf.helper.js           # PDF text extraction with OCR fallback
│       │   ├── ocr.helper.js           # Tesseract OCR for scanned PDFs
│       │   ├── office.helper.js        # DOCX/PPTX text extraction
│       │   ├── link.helper.js          # Link metadata (OG tags, YouTube oEmbed, GitHub API)
│       │   └── topicTree.helper.js     # Recursive topic tree operations
│       │
│       └── utils/
│           ├── tokens.js               # JWT signing (access token, 7-day expiry)
│           ├── mail.js                 # Email via Gmail API / OAuth2
│           └── cloudinary.js           # Cloudinary upload/delete with resource-type routing
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js                  # Vite config with /api proxy to localhost:4000
│   ├── vercel.json                     # SPA rewrite rules for Vercel deployment
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── main.jsx                    # React DOM root + BrowserRouter
│       ├── App.jsx                     # Route definitions (6 routes)
│       ├── index.css                   # Tailwind import + float animations
│       │
│       ├── api/
│       │   └── axios.js               # Axios instance (baseURL: backend API)
│       │
│       ├── components/
│       │   └── Toast.jsx              # Auto-dismissing toast notifications
│       │
│       └── pages/
│           ├── landing.jsx            # Public marketing landing page
│           ├── signup.jsx             # Registration (two-panel layout)
│           ├── login.jsx              # Login (two-panel layout)
│           ├── forgotpassword.jsx     # Password reset request form
│           ├── resetpassword.jsx      # New password form (token from URL)
│           └── resurf.jsx             # Main app dashboard (1200+ lines — all app logic)
│
├── .gitignore
└── readme.md
```

---

## API Routes

All routes are prefixed with `/api/v1`.

### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Server health check |

### Users (`/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Login, returns JWT + user |
| POST | `/logout` | No | Invalidate session |
| GET | `/getProfile` | JWT | Get current user profile |
| POST | `/forgot-password` | No | Send password reset email |
| POST | `/reset-password/:token` | No | Set new password via token |

### Collections (`/collections`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | JWT | Create collection |
| GET | `/` | JWT | List all collections |
| PUT | `/:collectionId` | JWT | Update collection |
| DELETE | `/:collectionId` | JWT | Soft-delete to trash |
| PATCH | `/:collectionId/restore` | JWT | Restore from trash |
| PATCH | `/:collectionId/favorite` | JWT | Toggle favorite |
| PATCH | `/:collectionId/pin` | JWT | Toggle pinned |
| DELETE | `/:collectionId/permanent` | JWT | Permanently delete |
| POST | `/:collectionId/topics` | JWT | Create topic in collection |
| GET | `/:collectionId/topics` | JWT | Get root topics |

### Topics (`/topics`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/:parentTopicId/children` | JWT | Create child topic |
| GET | `/:parentTopicId/children` | JWT | Get child topics |
| PUT | `/:topicId` | JWT | Update topic |
| DELETE | `/:topicId` | JWT | Soft-delete to trash |
| PATCH | `/:topicId/restore` | JWT | Restore from trash |
| PATCH | `/:topicId/favorite` | JWT | Toggle favorite |
| PATCH | `/:topicId/pin` | JWT | Toggle pinned |
| DELETE | `/:topicId/permanent` | JWT | Permanently delete |
| PATCH | `/:topicId/move` | JWT | Move topic to new parent |
| POST | `/:topicId/duplicate` | JWT | Duplicate topic tree |

### Resources (`/resources`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/collections/:collectionId` | JWT + File | Upload resource to collection |
| GET | `/collections/:collectionId` | JWT | List resources in collection |
| POST | `/topics/:topicId` | JWT + File | Upload resource to topic |
| GET | `/topics/:topicId` | JWT | List resources in topic |
| PUT | `/:resourceId` | JWT | Update resource metadata |
| DELETE | `/:resourceId` | JWT | Soft-delete to trash |
| PATCH | `/:resourceId/restore` | JWT | Restore from trash |
| DELETE | `/:resourceId/permanent` | JWT | Permanently delete (removes from Cloudinary) |
| PATCH | `/:resourceId/move` | JWT | Move resource to different collection/topic |
| POST | `/:resourceId/duplicate` | JWT | Duplicate resource |

### Trash (`/trash`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | JWT | Get all trashed items (collections, topics, resources) |

### Search (`/search`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/?q=<query>&type=<file\|link>` | JWT | Search across resources by title, description, extracted text, tags, filename |

**Total: 30 API endpoints** (including health check)

---

## Resource Subtypes

The 17 supported resource subtypes and their extraction methods:

| SubType | Source | Content Extraction |
|---------|--------|-------------------|
| `document` | PDF upload | pdf-parse + tesseract.js OCR fallback |
| `presentation` | PPTX upload | adm-zip (slide XML parsing) |
| `spreadsheet` | XLSX upload | Stored as raw file |
| `code` | Code file upload | Stored as raw file |
| `image` | Image upload | Stored on Cloudinary |
| `video` | Video upload | Stored on Cloudinary |
| `archive` | ZIP/RAR upload | Stored on Cloudinary |
| `text` | TXT upload | Stored as raw file |
| `youtube` | YouTube link | oEmbed API (title, thumbnail, description) |
| `github` | GitHub link | GitHub REST API (repo description, stars, language) |
| `website` | Any URL | Meta tags (og:title, og:description) |
| `chatgpt` | ChatGPT link | Meta tags |
| `drive` | Google Drive link | Meta tags |
| `linkedin` | LinkedIn link | Meta tags |
| `leetcode` | LeetCode link | Meta tags |
| `geeksforgeeks` | GFG link | Meta tags |
| `other` | Fallback | Meta tags |

---

## Database Schema

### User
- `username` — String, unique, 3–25 chars
- `email` — String, unique, regex validated
- `password` — String, bcrypt hashed, min 6 chars
- `passwordResetToken` / `passwordResetExpires` — for 15-min reset flow

### Collection
- `name`, `description`, `color` (default `#3B82F6`), `icon` (default `📁`)
- `favorite`, `isPinned`, `isDeleted`, `deletedAt`
- `user` → ref User

### Topic (recursive tree)
- `name`, `description`
- `collection` → ref Collection
- `parentTopic` → ref Topic (self-referencing, null = root)
- `favorite`, `isPinned`, `isDeleted`, `deletedAt`
- `user` → ref User

### Resource
- `title`, `description`, `extractedText`
- `resourceType` (file | link), `subType` (17 enum values)
- `linkUrl`, `fileUrl`, `publicId`, `cloudinaryResourceType`
- `fileName`, `fileSize`, `mimeType`, `fileExtension`, `language`
- `collection` → ref Collection, `topic` → ref Topic (nullable)
- `tags[]`, `favorite`, `isPinned`, `isArchived`, `lastOpened`
- `isDeleted`, `deletedAt`
- `user` → ref User

---

## Authentication Flow

1. User registers/logs in → server returns a JWT (7-day expiry)
2. Token is stored in `localStorage` and attached as `Authorization: Bearer <token>` on all requests
3. Auth middleware verifies JWT, looks up user, attaches `req.user`
4. Password reset: server generates a random token, hashes it (SHA-256), stores hash in DB with 15-minute expiry, emails the raw token as a link
5. User clicks link → submits new password → server hashes the URL token, matches against stored hash, updates password

---

## .env Setup

Create a `backend/.env` file with the following variables:

```env
# Server
PORT=4000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/resurf

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth2 (for sending emails via Gmail API)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

**Required variables:**
- `MONGODB_URI` — MongoDB Atlas connection string (or local MongoDB URI)
- `JWT_SECRET` — Any long random string for signing JWTs
- `JWT_EXPIRES_IN` — Token lifetime (default `7d`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — From [Cloudinary Dashboard](https://cloudinary.com/console)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` — From [Google Cloud Console](https://console.cloud.google.com) with Gmail API enabled
- `FRONTEND_URL` — Used to build password reset links (e.g. `http://localhost:5173` in dev)
- `PORT` — Server port (default `4000`)

---

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (or local MongoDB instance)
- Cloudinary account (free tier works)
- Google Cloud project with Gmail API enabled + OAuth2 credentials
- GraphicsMagick + Ghostscript (required for OCR/scanned PDF support)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Resurf.git
cd Resurf
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env    # or create .env manually with the variables above
npm run dev
```

The server starts at `http://localhost:4000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:5173` with API requests proxied to the backend.

### 4. Docker (Backend — Optional)

```bash
cd backend
docker build -t resurf-backend .
docker run -p 4000:4000 --env-file .env resurf-backend
```

---

## Deployment

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | [resurf-pi.vercel.app](https://resurf-pi.vercel.app) | Vercel, SPA rewrite rules |
| Backend | [resurf.onrender.com](https://resurf.onrender.com) | Render, Docker-based |

The frontend `vite.config.js` proxies `/api` to `localhost:4000` in development. In production, both Axios and the native `apiFetch()` wrapper point directly to the Render backend URL.

---

## Future Enhancements

- **AI-Powered Smart Search** — LLM interprets natural language queries like "Find the React authentication article I saved before placements"
- **AI Tag Generation** — Automatically generate meaningful tags for uploaded files and links (the `tags` field already exists, nothing populates it yet)
- **AI Summaries** — Generate concise summaries for lengthy articles, PDFs, and documentation
- **Semantic Search** — Retrieve resources based on meaning instead of exact keyword matches
- **Vision-Based Tagging** — Vision-capable model describes and tags page content from scanned/image-heavy PDFs

---

## Learning Outcomes

This project demonstrates:

- Full-Stack MERN Development
- REST API Design (30 endpoints)
- Authentication & Authorization (JWT + bcrypt)
- MongoDB Schema Design (including recursive/nested tree structures for Topics)
- File Upload & Cloud Storage Integration (Cloudinary)
- Document Parsing & Text Extraction (PDF, DOCX, PPTX)
- OCR Integration for Scanned Documents (Tesseract.js)
- Automated Web Metadata Extraction (OG tags, oEmbed, GitHub API)
- Multi-Field, Multi-Keyword Search Design
- Responsive UI Development with Tailwind CSS
- Docker Containerization

---

## License

This project is private and not currently licensed for public use.
