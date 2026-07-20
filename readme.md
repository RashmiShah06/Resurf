# Resurf – Personal Knowledge Retrieval Platform

## 📌 Overview

Resurf is a full-stack MERN application designed to solve the problem of **re-finding digital resources**, not just storing them.

Every day, people discover useful information from different sources such as websites, PDFs, PowerPoint presentations, Word documents, YouTube videos, GitHub repositories, and personal notes. Over time, these resources become scattered across multiple platforms, making them difficult to locate when they are actually needed.

Resurf provides a centralized workspace where users can capture, organize, search, and rediscover their resources from a single place — and search by what a resource is *about*, not just what it's named.

---

# 🎯 Problem Statement

Existing tools such as browser bookmarks, file explorers, cloud storage, and note-taking applications manage only one type of resource at a time.

As a result, users often experience problems like:

* Forgetting where an important website was bookmarked.
* Losing track of downloaded PDFs, PPTs, and Word documents.
* Saving useful GitHub repositories but never finding them again.
* Managing resources spread across Chrome, Downloads, Google Drive, WhatsApp, YouTube, and personal notes.
* Spending unnecessary time searching for previously saved resources — especially when the *filename* is forgotten but the *content* isn't.

Resurf solves this problem by creating a unified platform focused on **capturing, organizing, and re-finding** digital resources.

---

# ✨ Key Features

## 🔐 Authentication

* User registration & secure login (bcrypt-hashed passwords)
* JWT-based authentication with protected routes
* Email-based password reset (time-limited, hashed reset tokens)

---

## 📚 Unified Resource Management

Every saved item — file or link — is stored as a single, consistent **Resource**, regardless of type.

**File uploads:**
* Documents, presentations, spreadsheets, code files, images, videos, archives, text files

**Links:**
* Websites, YouTube videos, GitHub repositories, ChatGPT conversations, Drive files, LinkedIn posts, LeetCode/GeeksforGeeks problems, and general links

---

## 🗂️ Collections & Nested Topics

Organize resources into custom **Collections** (e.g. *MCA*, *Placement Prep*, *MERN Development*, *AI*, *Research*), and further break each one down into **Topics** — which can nest inside other Topics for deeper hierarchy (e.g. *MCA → Networks → Routing Protocols*).

Resources, topics, and whole collections can be:
* **Favorited** or **Pinned** for quick access from the dashboard
* **Renamed**, **cut/copied and moved or duplicated** between collections and topics
* **Moved to Trash** (soft delete) and later **restored** or **permanently deleted** — deleting a collection or topic safely cascades to everything inside it

---

## 🔍 Content-Aware Search

Search isn't limited to titles and tags — Resurf looks *inside* what you saved:

* **Multi-keyword matching** — "mca networks" matches a resource titled *"Networks — MCA notes"* even though the words are reversed and scattered across different fields; every keyword just has to appear somewhere, in any order.
* **PDF content search** — text is extracted from PDFs at upload time (via `pdf-parse`) and indexed for search, so a document is findable by what's written on page 8, not just its filename.
* **OCR fallback for scanned PDFs** — when a PDF has no real text layer (a scan or photographed pages), Resurf automatically falls back to OCR (Tesseract) on the first few pages so even scanned documents stay somewhat searchable.
* **Word & PowerPoint content search** — `.docx` files (via `mammoth`) and `.pptx` slide text (parsed directly from the file) are also extracted and indexed.
* **Link content search** — saving a link automatically pulls in the page's title and description (via Open Graph / meta tags), with dedicated, more reliable handling for **YouTube** (oEmbed API) and **GitHub** (repo API) links specifically.

All search results are scoped privately to the logged-in user.

---

## 📄 Reliable File Handling (Cloudinary)

* Files are routed to the correct Cloudinary storage type based on their actual MIME type — PDFs open inline in the browser instead of being blocked or force-downloaded, while non-renderable files (zip, code files, etc.) download normally.
* Uploaded filenames are preserved exactly as the original — uniqueness is handled via storage path, not by mangling the visible filename.
* A dedicated **Download** action forces a proper download (with the correct original filename) for any file resource, independent of how it opens on click.

---

## ⭐ Favorites & 📌 Pinned

Two separate, always-accessible lists for quick recall — favorites for what matters most, pinned for what you're actively working with.

---

## 🎨 Light & Dark Theme

A theme toggle switches the entire interface between light and dark palettes, with the choice remembered across sessions.

---

## 📱 Responsive Interface

Designed to work across desktop, tablet, and mobile screen sizes.

---

# 🚀 Future Enhancements

## 🤖 AI-Powered Smart Search

Allow users to search naturally using queries such as:

> "Find the React authentication article I saved before placements."

An LLM interprets the query and retrieves the most relevant resources, rather than relying purely on keyword matching.

---

## 🏷️ AI Tag Generation

Automatically generate meaningful tags for uploaded files and links — reducing manual organization while improving search quality. (The `tags` field already exists on every resource; nothing currently populates it yet.)

---

## 📝 AI Summaries

Generate concise summaries for lengthy articles, PDFs, and documentation.

---

## 🧠 Semantic Search

Retrieve resources based on meaning instead of exact keyword matches — useful when a user remembers only the gist of something, not the specific words used in it.

---

## 🖼️ Vision-Based Tagging for Scanned/Image-Heavy PDFs

For scanned PDFs where OCR yields little (e.g. diagram-heavy pages), a vision-capable model could describe and tag page content directly from images.

---

# 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Authentication

* JWT
* bcrypt

### File Storage

* Cloudinary

### Content Extraction

* `pdf-parse` — PDF text extraction
* `tesseract.js` + `pdf2pic` — OCR fallback for scanned PDFs *(requires GraphicsMagick/ImageMagick + Ghostscript on the server)*
* `mammoth` — DOCX text extraction
* `adm-zip` — PPTX slide text extraction
* Native `fetch` — link metadata scraping, plus YouTube oEmbed & GitHub REST APIs

### Future AI Integration

* An LLM API (e.g. Claude, GPT, Gemini) for smart/semantic search, AI tag generation, and summaries

---


# 🎯 Project Goal

Resurf is built around one simple idea:

> **"You don't need to remember where you saved something. You only need to remember something about it."**

The application focuses on helping users capture, organize, and quickly rediscover valuable knowledge instead of allowing it to become scattered across multiple platforms.

---

# 💡 Why Resurf?

Unlike traditional bookmark managers or file storage systems, Resurf is designed around **retrieval** rather than **storage**.

Instead of asking:

> "Where did I save this?"

Users simply ask:

> "What do I remember about it?"

Resurf then searches across all saved resources — including what's written *inside* them — from a single interface.

---

# 📖 Learning Outcomes

This project demonstrates:

* Full-Stack MERN Development
* REST API Design
* Authentication & Authorization
* MongoDB Schema Design (including recursive/nested tree structures for Topics)
* File Upload & Cloud Storage Integration (Cloudinary)
* Document Parsing & Text Extraction (PDF, DOCX, PPTX)
* OCR Integration for Scanned Documents
* Automated Web Metadata Extraction
* Multi-Field, Multi-Keyword Search Design
* Responsive UI Development
* AI-assisted Search (Future)

---

# 🌟 Vision

Resurf aims to become a personal knowledge retrieval platform that helps users build a searchable knowledge base over time.

Rather than replacing tools like browser bookmarks or cloud storage, Resurf acts as a unified layer that makes information easier to organize, search, and rediscover whenever it is needed.