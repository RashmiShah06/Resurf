# Resurf – Personal Knowledge Retrieval Platform

## 📌 Overview

Resurf is a full-stack MERN application designed to solve the problem of **re-finding digital resources**, not just storing them.

Every day, people discover useful information from different sources such as websites, PDFs, PowerPoint presentations, YouTube videos, GitHub repositories, and personal notes. Over time, these resources become scattered across multiple platforms, making them difficult to locate when they are actually needed.

Resurf provides a centralized workspace where users can capture, organize, search, and rediscover their resources from a single place.

---

# 🎯 Problem Statement

Existing tools such as browser bookmarks, file explorers, cloud storage, and note-taking applications manage only one type of resource at a time.

As a result, users often experience problems like:

* Forgetting where an important website was bookmarked.
* Losing track of downloaded PDFs and PPTs.
* Saving useful GitHub repositories but never finding them again.
* Managing resources spread across Chrome, Downloads, Google Drive, WhatsApp, YouTube, and personal notes.
* Spending unnecessary time searching for previously saved resources.

Resurf solves this problem by creating a unified platform focused on **capturing, organizing, and re-finding** digital resources.

---

# ✨ Key Features

## 🔐 Authentication

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes

---

## 📚 Unified Resource Management

Store different kinds of learning and reference materials in one place.

Supported resource types:

* 🌐 Websites
* 📄 PDF Documents
* 📊 PPT / PPTX Files
* 🎥 YouTube Videos
* 💻 GitHub Repositories
* 📝 Personal Notes

Instead of treating each type differently, Resurf stores everything as a unified **Resource**.

---

## 🗂️ Workspaces

Organize resources into custom workspaces based on your needs.

Examples:

* MCA
* Placement Preparation
* MERN Development
* AI
* Personal
* Research
* Finance

Workspaces are fully customizable.

---

## 🔍 Unified Search

Search all saved resources from one place.

Users can search using:

* Resource Title
* Tags
* Description
* Personal Notes
* Resource Type
* Workspace

Instead of remembering where something was saved, users only need to remember what it was about.

---

## 📄 File Upload

Upload:

* PDF Documents
* PPT / PPTX Files

Files are securely stored while their metadata is maintained inside the database.

---

## 🌐 Automatic Metadata Extraction

When a user saves a website, Resurf automatically extracts:

* Page Title
* Description
* Website Icon (Favicon)
* URL

This minimizes manual effort while saving resources.

---

## ⭐ Favorites

Mark important resources as favorites for quick access.

---

## 📱 Responsive Interface

Designed to work seamlessly across:

* Desktop
* Tablet
* Mobile

---

# 🚀 Future Enhancements

## 📄 PDF Text Indexing

Extract text from uploaded PDFs to enable searching inside document contents instead of relying only on filenames.

---

## 🤖 AI-Powered Smart Search

Allow users to search naturally using queries such as:

> "Find the React authentication article I saved before placements."

AI interprets the query and retrieves the most relevant resources.

---

## 🏷️ AI Tag Generation

Automatically generate meaningful tags for:

* Websites
* PDFs
* PPTs

This reduces manual organization while improving search quality.

---

## 📝 AI Summaries

Generate concise summaries for lengthy:

* Articles
* PDFs
* Documentation

---

## 🎤 Voice Search

Allow users to search their personal knowledge base using speech instead of typing.

---

## 🧠 Semantic Search

Retrieve resources based on meaning instead of exact keyword matches, making it easier to find information even when users remember only partial details.

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

* MongoDB

### Authentication

* JWT

### File Storage

* Cloudinary

### Future AI Integration

* Groq API / OpenAI API / Gemini API
* AI Tag Generation
* Natural Language Search
* Semantic Search

---

# 📂 Project Structure

```text
client/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── context/
│   ├── utils/
│   └── assets/
│
server/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── server.js
```

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

Resurf then searches across all saved resources from a single interface.

---

# 📖 Learning Outcomes

This project demonstrates:

* Full-Stack MERN Development
* REST API Design
* Authentication & Authorization
* MongoDB Schema Design
* File Upload & Cloud Storage
* Metadata Extraction
* Full-Text Search
* Information Retrieval Concepts
* Responsive UI Development
* AI-assisted Search (Future)

---

# 🌟 Vision

Resurf aims to become a personal knowledge retrieval platform that helps users build a searchable knowledge base over time.

Rather than replacing tools like browser bookmarks or cloud storage, Resurf acts as a unified layer that makes information easier to organize, search, and rediscover whenever it is needed.
