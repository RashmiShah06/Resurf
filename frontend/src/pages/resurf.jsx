import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiSearch, FiPlus, FiFolderPlus, FiTag, FiFileText, FiStar, FiTrash2,
  FiChevronRight, FiGithub, FiVideo, FiLink2, FiGrid, FiFolder, FiHash,
  FiRotateCcw, FiX, FiCheck, FiMonitor, FiCode, FiImage, FiArchive,
  FiYoutube, FiGlobe, FiMessageSquare, FiHardDrive, FiLinkedin,
  FiUpload, FiRefreshCw, FiAlertCircle, FiLink,
  FiEdit2, FiScissors, FiCopy, FiClipboard, FiDownload, FiLogOut, FiSun, FiMoon,
} from "react-icons/fi";
import { TbPin } from "react-icons/tb";



const API_BASE = "https://resurf.onrender.com/api/v1"; 

const ENDPOINTS = {
  collections: () => "/collections",
  collection: (id) => `/collections/${id}`,
  collectionRestore: (id) => `/collections/${id}/restore`,
  collectionPermanent: (id) => `/collections/${id}/permanent`,
  collectionFavorite: (id) => `/collections/${id}/favorite`,
  collectionPin: (id) => `/collections/${id}/pin`,

  rootTopics: (collectionId) => `/collections/${collectionId}/topics`,
  childTopics: (parentTopicId) => `/topics/${parentTopicId}/children`,
  createRootTopic: (collectionId) => `/collections/${collectionId}/topics`,
  createChildTopic: (parentTopicId) => `/topics/${parentTopicId}/children`,
  topic: (id) => `/topics/${id}`,
  topicRestore: (id) => `/topics/${id}/restore`,
  topicPermanent: (id) => `/topics/${id}/permanent`,
  topicFavorite: (id) => `/topics/${id}/favorite`,
  topicPin: (id) => `/topics/${id}/pin`,

  collectionResources: (collectionId) => `/resources/collections/${collectionId}`,
  topicResources: (topicId) => `/resources/topics/${topicId}`,
  resource: (id) => `/resources/${id}`,
  resourceRestore: (id) => `/resources/${id}/restore`,
  resourcePermanent: (id) => `/resources/${id}/permanent`,

  me: () => "/users/getProfile", 
  logout: () => "/users/logout", 

  trash: () => "/trash",

  search: (q, type) => `/search?q=${encodeURIComponent(q)}${type ? `&type=${type}` : ""}`,

  topicMove: (id) => `/topics/${id}/move`,
  topicDuplicate: (id) => `/topics/${id}/duplicate`,
  resourceMove: (id) => `/resources/${id}/move`,
  resourceDuplicate: (id) => `/resources/${id}/duplicate`,
};

async function apiFetch(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; }
  catch {
    throw new Error(
      `Expected JSON from ${API_BASE}${path} but got something else (status ${res.status}). ` +
      `Check that this route actually exists on your backend and that API_BASE is correct.`
    );
  }

  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

const api = {
  getCollections: () => apiFetch(ENDPOINTS.collections()),
  createCollection: (body) => apiFetch(ENDPOINTS.collections(), { method: "POST", body: JSON.stringify(body) }),
  updateCollection: (id, body) => apiFetch(ENDPOINTS.collection(id), { method: "PUT", body: JSON.stringify(body) }),
  trashCollection: (id) => apiFetch(ENDPOINTS.collection(id), { method: "DELETE" }),
  restoreCollection: (id) => apiFetch(ENDPOINTS.collectionRestore(id), { method: "PATCH" }),
  deleteCollectionForever: (id) => apiFetch(ENDPOINTS.collectionPermanent(id), { method: "DELETE" }),
  toggleCollectionFavorite: (id) => apiFetch(ENDPOINTS.collectionFavorite(id), { method: "PATCH" }),
  toggleCollectionPinned: (id) => apiFetch(ENDPOINTS.collectionPin(id), { method: "PATCH" }),

  getRootTopics: (collectionId) => apiFetch(ENDPOINTS.rootTopics(collectionId)),
  getChildTopics: (parentTopicId) => apiFetch(ENDPOINTS.childTopics(parentTopicId)),
  createRootTopic: (collectionId, body) => apiFetch(ENDPOINTS.createRootTopic(collectionId), { method: "POST", body: JSON.stringify(body) }),
  createChildTopic: (parentTopicId, body) => apiFetch(ENDPOINTS.createChildTopic(parentTopicId), { method: "POST", body: JSON.stringify(body) }),
  updateTopic: (id, body) => apiFetch(ENDPOINTS.topic(id), { method: "PUT", body: JSON.stringify(body) }),
  trashTopic: (id) => apiFetch(ENDPOINTS.topic(id), { method: "DELETE" }),
  restoreTopic: (id) => apiFetch(ENDPOINTS.topicRestore(id), { method: "PATCH" }),
  deleteTopicForever: (id) => apiFetch(ENDPOINTS.topicPermanent(id), { method: "DELETE" }),
  toggleTopicFavorite: (id) => apiFetch(ENDPOINTS.topicFavorite(id), { method: "PATCH" }),
  toggleTopicPinned: (id) => apiFetch(ENDPOINTS.topicPin(id), { method: "PATCH" }),

  getCollectionResources: (collectionId) => apiFetch(ENDPOINTS.collectionResources(collectionId)),
  getTopicResources: (topicId) => apiFetch(ENDPOINTS.topicResources(topicId)),
  createCollectionResource: (collectionId, formData) => apiFetch(ENDPOINTS.collectionResources(collectionId), { method: "POST", body: formData }),
  createTopicResource: (topicId, formData) => apiFetch(ENDPOINTS.topicResources(topicId), { method: "POST", body: formData }),
  updateResource: (id, body) => apiFetch(ENDPOINTS.resource(id), { method: "PUT", body: JSON.stringify(body) }),
  trashResource: (id) => apiFetch(ENDPOINTS.resource(id), { method: "DELETE" }),
  restoreResource: (id) => apiFetch(ENDPOINTS.resourceRestore(id), { method: "PATCH" }),
  deleteResourceForever: (id) => apiFetch(ENDPOINTS.resourcePermanent(id), { method: "DELETE" }),

  getMe: () => apiFetch(ENDPOINTS.me()),
 
  logout: () => apiFetch(ENDPOINTS.logout(), { method: "POST" }),

  search: (q, type) => apiFetch(ENDPOINTS.search(q, type)),

  getTrash: () => apiFetch(ENDPOINTS.trash()),

  moveTopic: (id, body) => apiFetch(ENDPOINTS.topicMove(id), { method: "PATCH", body: JSON.stringify(body) }),
  duplicateTopic: (id, body) => apiFetch(ENDPOINTS.topicDuplicate(id), { method: "POST", body: JSON.stringify(body) }),
  moveResource: (id, body) => apiFetch(ENDPOINTS.resourceMove(id), { method: "PATCH", body: JSON.stringify(body) }),
  duplicateResource: (id, body) => apiFetch(ENDPOINTS.resourceDuplicate(id), { method: "POST", body: JSON.stringify(body) }),
};

/* 
   Normalizers — map your Mongoose documents to the shape the UI uses
*/

function normalizeCollection(c) {
  return {
    id: c._id, type: "collection", name: c.name, description: c.description || "",
    color: c.color || "#3B82F6", icon: c.icon || "📁", parentId: null, createdAt: c.createdAt,
    favorite: !!c.favorite, pinned: !!c.isPinned,
  };
}
function normalizeTopic(t, parentId) {
  return {
    id: t._id, type: "topic", name: t.name, description: t.description || "",
    parentId, createdAt: t.createdAt,
    favorite: !!t.favorite, pinned: !!t.isPinned,
  };
}
function normalizeResource(r, parentId) {
  return {
    id: r._id, type: "resource", name: r.title, description: r.description || "",
    resourceType: r.resourceType, subType: r.subType, linkUrl: r.linkUrl || "",
    fileUrl: r.fileUrl || "", fileName: r.fileName || "", tags: r.tags || [],
    favorite: !!r.favorite, pinned: !!r.isPinned, parentId, createdAt: r.createdAt,
  };
}


const SUBTYPE_META = {
  document: { icon: FiFileText, label: "Document" },
  presentation: { icon: FiMonitor, label: "Presentation" },
  spreadsheet: { icon: FiGrid, label: "Spreadsheet" },
  code: { icon: FiCode, label: "Code" },
  image: { icon: FiImage, label: "Image" },
  video: { icon: FiVideo, label: "Video" },
  archive: { icon: FiArchive, label: "Archive" },
  text: { icon: FiFileText, label: "Text" },
  youtube: { icon: FiYoutube, label: "YouTube" },
  github: { icon: FiGithub, label: "Repository" },
  website: { icon: FiGlobe, label: "Website" },
  chatgpt: { icon: FiMessageSquare, label: "ChatGPT" },
  drive: { icon: FiHardDrive, label: "Drive" },
  linkedin: { icon: FiLinkedin, label: "LinkedIn" },
  leetcode: { icon: FiCode, label: "LeetCode" },
  geeksforgeeks: { icon: FiCode, label: "GeeksforGeeks" },
  other: { icon: FiLink2, label: "Link" },
};

function openResource(node) {
  const url = node.resourceType === "file" ? node.fileUrl : node.linkUrl;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}


function buildDownloadUrl(fileUrl, fileName) {
  if (!fileUrl) return fileUrl;
  const dot = fileName.lastIndexOf(".");
  const base = dot > 0 ? fileName.slice(0, dot) : fileName;
  const safeName = encodeURIComponent(base.replace(/\s+/g, "_"));
  return fileUrl.replace("/upload/", `/upload/fl_attachment:${safeName}/`);
}

function downloadResource(node) {
  if (node.type !== "resource" || node.resourceType !== "file" || !node.fileUrl) return;
  const url = buildDownloadUrl(node.fileUrl, node.fileName || node.name);
  window.open(url, "_blank", "noopener,noreferrer");
}


function getGreeting(name) {
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return name ? `Happy ${day}, ${name}` : `Happy ${day}`;
}
function TypedGreeting({ text }) {
  const words = text.split(" ");
  return (
    <h1 className="greeting">
      {words.map((w, i) => (
        <span key={i} className="greeting-word" style={{ animationDelay: `${i * 0.07}s` }}>
          {w}&nbsp;
        </span>
      ))}
    </h1>
  );
}


function CreateMenu({ parentType, onCreateCollection, onCreateTopic, onCreateResource }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [name, setName] = useState("");
  const [resKind, setResKind] = useState("link");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) close();
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function close() {
    setOpen(false); setMode(null); setName(""); setLinkUrl(""); setFile(null); setResKind("link");
  }

  const options = [
    { key: "collection", label: "New collection", icon: FiFolderPlus, show: parentType === "root" },
    { key: "topic", label: parentType === "topic" ? "New topic here" : "New topic", icon: FiTag, show: parentType !== "root" },
    { key: "resource", label: parentType === "topic" ? "New resource here" : "New resource", icon: FiFileText, show: parentType !== "root" },
  ].filter((o) => o.show);

  async function submitNamed() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      if (mode === "collection") await onCreateCollection(name.trim());
      if (mode === "topic") await onCreateTopic(name.trim());
      close();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitResource() {
    if (resKind === "link" && !linkUrl.trim()) return;
    if (resKind === "file" && !file) return;
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("resourceType", resKind);
      if (resKind === "link") {
        formData.append("title", name.trim() || linkUrl.trim());
        formData.append("linkUrl", linkUrl.trim());
      } else {
        formData.append("file", file); 
      }
      await onCreateResource(formData);
      close();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="create-menu" ref={ref}>
      <button className="btn-primary" onClick={() => setOpen((o) => !o)}>
        <FiPlus size={16} strokeWidth={2.5} /> New
      </button>

      {open && !mode && (
        <div className="create-dropdown">
          {options.map((o) => (
            <button key={o.key} className="create-option" onClick={() => setMode(o.key)}>
              <o.icon size={16} /> {o.label}
            </button>
          ))}
        </div>
      )}

      {open && (mode === "collection" || mode === "topic") && (
        <div className="create-dropdown create-input-panel">
          <div className="create-input-label">{mode === "collection" ? "Collection name" : "Topic name"}</div>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitNamed()}
            placeholder="Type a name and press Enter…"
            disabled={busy}
          />
          <div className="create-input-actions">
            <button className="btn-ghost" onClick={close}><FiX size={14} /> Cancel</button>
            <button className="btn-primary small" onClick={submitNamed} disabled={busy}>
              <FiCheck size={14} /> {busy ? "Creating…" : "Create"}
            </button>
          </div>
        </div>
      )}

      {open && mode === "resource" && (
        <div className="create-dropdown create-input-panel">
          <div className="create-input-label">Add a resource</div>
          <div className="res-kind-toggle">
            <button className={resKind === "link" ? "active" : ""} onClick={() => setResKind("link")}>
              <FiLink size={13} /> Link
            </button>
            <button className={resKind === "file" ? "active" : ""} onClick={() => setResKind("file")}>
              <FiUpload size={13} /> File
            </button>
          </div>
          {resKind === "link" ? (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Title (optional)"
                disabled={busy}
                style={{ marginBottom: 8 }}
              />
              <input
                autoFocus
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitResource()}
                placeholder="https://…"
                disabled={busy}
              />
            </>
          ) : (
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={busy}
            />
          )}
          <div className="create-input-actions">
            <button className="btn-ghost" onClick={close}><FiX size={14} /> Cancel</button>
            <button className="btn-primary small" onClick={submitResource} disabled={busy}>
              <FiCheck size={14} /> {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

//entry row
function EntryRow({ node, onOpen, onContextMenu, isClipped }) {
  const isResource = node.type === "resource";
  const meta = isResource ? (SUBTYPE_META[node.subType] || SUBTYPE_META.other) : null;
  const Icon = isResource ? meta.icon : node.type === "collection" ? FiFolder : FiTag;
  const sourceLine = isResource
    ? (node.resourceType === "file" ? node.fileName : node.linkUrl)
    : (node.type === "collection" ? "Collection" : "Topic");
  const subLabel = isResource ? `${meta.label}${sourceLine ? ` · ${sourceLine}` : ""}` : sourceLine;

  return (
    <div
      className={`resource-row ${isClipped ? "clipped" : ""}`}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, node); }}
    >
      <div className={`resource-icon ${!isResource && node.type === "topic" ? "topic-icon" : ""}`} onClick={() => onOpen(node)} role="button" title="Open">
        <Icon size={16} />
      </div>
      <div className="resource-main" onClick={() => onOpen(node)} role="button">
        <div className="resource-name">{node.name}</div>
        <div className="resource-sub">{subLabel}</div>
      </div>
      {(node.pinned || node.favorite) && (
        <div className="resource-badges">
          {node.pinned && <TbPin size={14} className="badge-pin" title="Pinned" />}
          {node.favorite && <FiStar size={14} className="badge-fav" title="Favorite" />}
        </div>
      )}
    </div>
  );
}

//right click feature
function ContextMenu({ x, y, node, onClose, onRename, onToggleFavorite, onTogglePinned, onCut, onCopy, onTrash, onDownload }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: y, left: x, opacity: 0 });

  useEffect(() => {
    function onMouseDown(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    function onKeyDown(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    let left = x, top = y;
    if (left + rect.width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - rect.width - 8);
    if (top + rect.height > window.innerHeight - 8) top = Math.max(8, window.innerHeight - rect.height - 8);
    setPos({ top, left, opacity: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y]);

  const canCutCopy = node.type !== "collection";
  const isDownloadableFile = node.type === "resource" && node.resourceType === "file";

  return (
    <div className="context-menu" style={pos} ref={ref}>
      <button className="context-item" onClick={() => { onRename(node); onClose(); }}>
        <FiEdit2 size={14} /> Rename
      </button>
      {isDownloadableFile && (
        <button className="context-item" onClick={() => { onDownload(node); onClose(); }}>
          <FiDownload size={14} /> Download
        </button>
      )}
      <button className="context-item" onClick={() => { onToggleFavorite(node); onClose(); }}>
        <FiStar size={14} /> {node.favorite ? "Remove from favorites" : "Add to favorites"}
      </button>
      <button className="context-item" onClick={() => { onTogglePinned(node); onClose(); }}>
        <TbPin size={14} /> {node.pinned ? "Unpin" : "Pin"}
      </button>
      {canCutCopy && (
        <>
          <div className="context-divider" />
          <button className="context-item" onClick={() => { onCut(node); onClose(); }}>
            <FiScissors size={14} /> Cut
          </button>
          <button className="context-item" onClick={() => { onCopy(node); onClose(); }}>
            <FiCopy size={14} /> Copy
          </button>
        </>
      )}
      <div className="context-divider" />
      <button className="context-item danger" onClick={() => { onTrash(node); onClose(); }}>
        <FiTrash2 size={14} /> Move to trash
      </button>
    </div>
  );
}


function RenameModal({ node, onClose, onSubmit }) {
  const [value, setValue] = useState(node.name);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  async function submit() {
    const trimmed = value.trim();
    if (!trimmed || trimmed === node.name) { onClose(); return; }
    setBusy(true);
    try {
      await onSubmit(node, trimmed);
      onClose();
    } catch (e) {
      alert(e.message);
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-title">Rename {node.type}</div>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose(); }}
          disabled={busy}
        />
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose} disabled={busy}>
            <FiX size={14} /> Cancel
          </button>
          <button className="btn-primary small" onClick={submit} disabled={busy}>
            <FiCheck size={14} /> {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

//topic/collection card
function NodeCard({ node, counts, onOpen, onContextMenu, isClipped }) {
  const isCollection = node.type === "collection";
  return (
    <div
      className={`node-card ${isClipped ? "clipped" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(node)}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen(node); }}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, node); }}
    >
      {(node.pinned || node.favorite) && (
        <div className="node-card-badges">
          {node.pinned && <TbPin size={13} className="badge-pin" title="Pinned" />}
          {node.favorite && <FiStar size={13} className="badge-fav" title="Favorite" />}
        </div>
      )}
      <div
        className={`node-card-icon ${isCollection ? "" : "topic-icon"}`}
        style={isCollection ? { background: `${node.color}22`, color: node.color } : undefined}
      >
        {isCollection ? <span style={{ fontSize: 17 }}>{node.icon}</span> : <FiTag size={17} />}
      </div>
      <div className="node-card-name">{node.name}</div>
      <div className="node-card-meta">
        {counts.topics > 0 && <span>{counts.topics} topic{counts.topics !== 1 ? "s" : ""}</span>}
        {counts.topics > 0 && counts.resources > 0 && <span> · </span>}
        {counts.resources > 0 && <span>{counts.resources} resource{counts.resources !== 1 ? "s" : ""}</span>}
        {counts.topics === 0 && counts.resources === 0 && <span>Empty</span>}
      </div>
      <FiChevronRight size={16} className="node-card-arrow" />
    </div>
  );
}

//main
export default function Recall() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [view, setView] = useState("dashboard");
  const [currentParent, setCurrentParent] = useState(null); // node object, or null = root
  const [query, setQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [clipboard, setClipboard] = useState(null); // { mode: "cut" | "copy", node }
  const [trash, setTrash] = useState({ collections: [], topics: [], resources: [] });
  const [trashLoading, setTrashLoading] = useState(false);
  const [menu, setMenu] = useState(null); // { x, y, node } — right-click context menu
  const [renameTarget, setRenameTarget] = useState(null); // node being renamed via modal

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => { localStorage.setItem("theme", theme); }, [theme]);
  function toggleTheme() { setTheme((t) => (t === "light" ? "dark" : "light")); }

  
  useEffect(() => {
    api.getMe()
      .then((data) => {
        const u = data?.user || data;
        setUserName(u?.fullName || u?.name || u?.username || "");
      })
      .catch(() => setUserName("")); // fails silently — greeting just omits the name
  }, []);

  
  async function handleLogout() {
    try { await api.logout(); } catch { /* ignore — sign out locally regardless */ }
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  /* load the whole tree (collections -> topics -> resources)  */
  const loadTree = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const all = [];
      const { collections } = await api.getCollections();
      for (const c of collections) {
        all.push(normalizeCollection(c));
        await loadCollectionSubtree(c._id, all);
      }
      setNodes(all);
    } catch (e) {
      setLoadError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  async function loadCollectionSubtree(collectionId, all) {
    const [{ resources }, { topics }] = await Promise.all([
      api.getCollectionResources(collectionId),
      api.getRootTopics(collectionId),
    ]);
    resources.forEach((r) => all.push(normalizeResource(r, collectionId)));
    for (const t of topics) {
      all.push(normalizeTopic(t, collectionId));
      await loadTopicSubtree(t._id, all);
    }
  }
  async function loadTopicSubtree(topicId, all) {
    const [{ resources }, { topics }] = await Promise.all([
      api.getTopicResources(topicId),
      api.getChildTopics(topicId),
    ]);
    resources.forEach((r) => all.push(normalizeResource(r, topicId)));
    for (const t of topics) {
      all.push(normalizeTopic(t, topicId));
      await loadTopicSubtree(t._id, all);
    }
  }

  const loadTrash = useCallback(async () => {
    setTrashLoading(true);
    try {
      const data = await api.getTrash();
      setTrash({
        collections: (data.collections || []).map(normalizeCollection),
        topics: (data.topics || []).map((t) => normalizeTopic(t, t.parentTopic || t.collection)),
        resources: (data.resources || []).map((r) => normalizeResource(r, r.topic || r.collection)),
      });
    } catch (e) {
      // fails silently on load; the Trash view itself will show an empty
      // state, and any explicit retry there will surface the real error
    } finally {
      setTrashLoading(false);
    }
  }, []);

  useEffect(() => { loadTree(); loadTrash(); }, [loadTree, loadTrash]);

  function childrenOf(parentId) { return nodes.filter((n) => n.parentId === parentId); }
  function countsFor(id) {
    const kids = childrenOf(id);
    return {
      topics: kids.filter((k) => k.type === "topic").length,
      resources: kids.filter((k) => k.type === "resource").length,
    };
  }
  function nodePath(id) {
    const path = [];
    let cur = nodes.find((n) => n.id === id);
    while (cur) { path.unshift(cur); cur = cur.parentId ? nodes.find((n) => n.id === cur.parentId) : null; }
    return path;
  }
  function parentTypeAt(node) {
    if (!node) return "root";
    return node.type; // 'collection' | 'topic'
  }

  /* mutations */
  async function createCollection(name) {
    await api.createCollection({ name });
    await loadTree();
  }
  async function createTopic(name) {
    if (currentParent.type === "collection") await api.createRootTopic(currentParent.id, { name });
    else await api.createChildTopic(currentParent.id, { name });
    await loadTree();
  }
  async function createResource(formData) {
    if (currentParent.type === "collection") await api.createCollectionResource(currentParent.id, formData);
    else await api.createTopicResource(currentParent.id, formData);
    await loadTree();
  }

  async function toggleNodeFavorite(node) {
    setNodes((ns) => ns.map((n) => (n.id === node.id ? { ...n, favorite: !n.favorite } : n)));
    try {
      if (node.type === "resource") await api.updateResource(node.id, { favorite: !node.favorite });
      else if (node.type === "collection") await api.toggleCollectionFavorite(node.id);
      else await api.toggleTopicFavorite(node.id);
    } catch (e) { alert(e.message); loadTree(); }
  }
  async function toggleNodePinned(node) {
    setNodes((ns) => ns.map((n) => (n.id === node.id ? { ...n, pinned: !n.pinned } : n)));
    try {
      if (node.type === "resource") await api.updateResource(node.id, { isPinned: !node.pinned });
      else if (node.type === "collection") await api.toggleCollectionPinned(node.id);
      else await api.toggleTopicPinned(node.id);
    } catch (e) { alert(e.message); loadTree(); }
  }

  /* right-click context menu */
  function openMenu(e, node) { setMenu({ x: e.clientX, y: e.clientY, node }); }
  function closeMenu() { setMenu(null); }

  /* opening a node from a list row: resources open their file/link,
     collections/topics navigate into them */
  function openEntry(node) {
    if (node.type === "resource") openResource(node);
    else openNode(node);
  }

  
  async function trashNode(node) {
    try {
      if (node.type === "collection") await api.trashCollection(node.id);
      else if (node.type === "topic") await api.trashTopic(node.id);
      else await api.trashResource(node.id);
      if (clipboard && clipboard.node.id === node.id) setClipboard(null);
      if (currentParent && currentParent.id === node.id) setCurrentParent(null);
      await Promise.all([loadTree(), loadTrash()]);
    } catch (e) { alert(e.message); }
  }
  async function restoreFromTrash(item) {
    try {
      if (item.type === "collection") await api.restoreCollection(item.id);
      else if (item.type === "topic") await api.restoreTopic(item.id);
      else await api.restoreResource(item.id);
      await Promise.all([loadTree(), loadTrash()]);
    } catch (e) { alert(e.message); }
  }
  async function deleteForever(item) {
    if (!window.confirm(`Permanently delete "${item.name}"? This can't be undone.`)) return;
    try {
      if (item.type === "collection") await api.deleteCollectionForever(item.id);
      else if (item.type === "topic") await api.deleteTopicForever(item.id);
      else await api.deleteResourceForever(item.id);
      await loadTrash();
    } catch (e) { alert(e.message); }
  }

  async function renameNode(node, newName) {
    if (node.type === "collection") await api.updateCollection(node.id, { name: newName });
    else if (node.type === "topic") await api.updateTopic(node.id, { name: newName });
    else await api.updateResource(node.id, { title: newName });
    await loadTree();
  }

  
  function cutNode(node) { setClipboard({ mode: "cut", node }); }
  function copyNode(node) { setClipboard({ mode: "copy", node }); }
  function clearClipboard() { setClipboard(null); }

  function targetLocationFor(parent) {
    if (!parent) return null; // root — topics/resources always need a collection
    if (parent.type === "collection") return { collectionId: parent.id, topicId: null };
    // parent is a topic: walk up to find which collection it ultimately belongs to
    const ancestors = nodePath(parent.id);
    const collectionAncestor = ancestors.find((a) => a.type === "collection");
    return { collectionId: collectionAncestor?.id, topicId: parent.id };
  }

  async function pasteNode() {
    if (!clipboard || !currentParent) return;
    if (clipboard.node.id === currentParent.id) {
      alert("Can't paste an item into itself.");
      return;
    }
    const target = targetLocationFor(currentParent);
    if (!target || !target.collectionId) return;

    try {
      if (clipboard.node.type === "topic") {
        const body = { targetCollectionId: target.collectionId, targetParentTopicId: target.topicId };
        if (clipboard.mode === "cut") await api.moveTopic(clipboard.node.id, body);
        else await api.duplicateTopic(clipboard.node.id, body);
      } else if (clipboard.node.type === "resource") {
        const body = { targetCollectionId: target.collectionId, targetTopicId: target.topicId };
        if (clipboard.mode === "cut") await api.moveResource(clipboard.node.id, body);
        else await api.duplicateResource(clipboard.node.id, body);
      }
      if (clipboard.mode === "cut") setClipboard(null);
      await loadTree();
    } catch (e) { alert(e.message); }
  }

  const favorites = nodes.filter((n) => n.favorite);
  const pinned = nodes.filter((n) => n.pinned);
//searching

  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setSearchResults(null); setSearching(false); return; }

    setSearching(true);
    const handle = setTimeout(() => {
      api.search(q)
        .then((data) => {
          const combined = [
            ...(data.collections || []).map(normalizeCollection),
            ...(data.topics || []).map((t) => normalizeTopic(t, t.parentTopic || t.collection)),
            ...(data.resources || []).map((r) => normalizeResource(r, r.topic || r.collection)),
          ];
          setSearchResults(combined);
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 300);

    return () => clearTimeout(handle);
  }, [query]);

  const trashList = [...trash.collections, ...trash.topics, ...trash.resources];

  const currentKids = currentParent ? childrenOf(currentParent.id) : [];
  const currentTopics = currentKids.filter((n) => n.type === "topic");
  const currentResources = currentKids.filter((n) => n.type === "resource");
  const path = currentParent ? nodePath(currentParent.id) : [];

  function openNode(node) { setView("browse"); setCurrentParent(node); }

  const NAV = [
    { key: "dashboard", label: "Dashboard", icon: FiGrid },
    { key: "browse-root", label: "Collections", icon: FiFolder },
    { key: "favorites", label: "Favorites", icon: FiStar },
    { key: "pinned", label: "Pinned", icon: TbPin },
    { key: "trash", label: "Trash", icon: FiTrash2 },
  ];
  function selectNav(key) {
    if (key === "browse-root") { setView("browse"); setCurrentParent(null); }
    else { setView(key); setCurrentParent(null); }
    setQuery("");
  }

  const stats = {
    collections: nodes.filter((n) => n.type === "collection").length,
    topics: nodes.filter((n) => n.type === "topic").length,
    resources: nodes.filter((n) => n.type === "resource").length,
  };

  return (
    <div className={`app-shell ${theme === "dark" ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .app-shell {
          --paper: #F5F8FA; --ink: #152A3A; --ink-soft: #435868; --muted: #8CA0AC;
          --line: #E1E8ED; --card: #FFFFFF; --chip: #E4EFF6; --chip-ink: #1B4965;
          --amber: #2E6E8E; --amber-bg: #E9F2F6; --rose: #C99A4B; --rose-bg: #FBF3E4;
          --coral: #1B4965; --coral-bg: #E4EFF6;
          --navy-btn: #1B4965; --navy-btn-hover: #123448; --hover: #EAF1F5;
          --shadow: 21,42,58; --overlay: 0.32;
          display: flex; height: 100vh; width: 100%; background: var(--paper);
          font-family: 'Inter', sans-serif; color: var(--ink);
          transition: background 0.2s ease, color 0.2s ease;
        }
        .app-shell.dark {
          --paper: #0F1C24; --ink: #E7EEF3; --ink-soft: #A9BAC6; --muted: #6F8494;
          --line: #1E2C36; --card: #172631; --chip: #1B3446; --chip-ink: #7FB8DA;
          --amber: #6FA8C4; --amber-bg: #1D3A47; --rose: #E0B368; --rose-bg: #3A2E1A;
          --coral: #7FB8DA; --coral-bg: #1B3446;
          --navy-btn: #2A4356; --navy-btn-hover: #35546B; --hover: #1C2C37;
          --shadow: 0,0,0; --overlay: 0.55;
        }
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        .sidebar { width: 240px; flex-shrink: 0; background: var(--paper); border-right: 1px solid var(--line); padding: 28px 18px; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
        .logo { font-size: 22px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 28px; padding-left: 4px; }
        .logo-accent { color: var(--coral); }
        .nav-list { display: flex; flex-direction: column; gap: 2px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; border: none; background: transparent; color: var(--ink-soft); font-size: 14.5px; font-weight: 500; text-align: left; cursor: pointer; transition: background 0.15s; }
        .nav-item:hover { background: var(--hover); }
        .nav-item.active { background: var(--card); color: var(--ink); box-shadow: 0 1px 2px rgba(var(--shadow),0.08); border-left: 2.5px solid var(--coral); padding-left: 9.5px; }
        .nav-count { margin-left: auto; font-size: 12px; color: var(--muted); }
        .sidebar-footer { margin-top: auto; padding-top: 16px; }
        .sidebar-tagline { font-size: 12px; color: var(--muted); margin-bottom: 10px; }
        .sidebar-logout { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 10px; border: 1px solid var(--line); background: transparent; border-radius: 8px; font-size: 13px; color: var(--ink-soft); cursor: pointer; font-family: inherit; text-align: left; }
        .sidebar-logout:hover { background: var(--hover); color: var(--ink); }
        .main { flex: 1; min-width: 0; padding: 32px 44px; overflow-y: auto; }
        .top-row { display: flex; align-items: center; gap: 14px; margin-bottom: 30px; }
        .clipboard-banner { display: flex; align-items: center; gap: 8px; background: var(--chip); color: var(--chip-ink); border-radius: 10px; padding: 9px 14px; margin: -18px 0 22px 0; font-size: 13.5px; }
        .clipboard-banner strong { font-weight: 600; }
        .search-box { flex: 1; max-width: 460px; display: flex; align-items: center; gap: 8px; background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 9px 13px; color: var(--muted); }
        .search-box input { border: none; outline: none; background: transparent; font-size: 14px; width: 100%; color: var(--ink); font-family: inherit; }
        .greeting { font-family: 'Playfair Display', Georgia, serif; font-weight: 500; font-size: 38px; margin: 0 0 6px 0; color: var(--ink); }
        .greeting-word { display: inline-block; opacity: 0; transform: translateY(6px); animation: fadeUp 0.5s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .subtitle { color: var(--ink-soft); font-size: 15px; margin-bottom: 30px; }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 34px; max-width: 720px; }
        .stat-card { position: relative; background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 18px 20px; overflow: hidden; }
        .stat-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--stat-accent, var(--line)); }
        .stat-card.accent-coral { --stat-accent: var(--coral); }
        .stat-card.accent-gold { --stat-accent: var(--amber); }
        .stat-card.accent-teal { --stat-accent: var(--chip-ink); }
        .stat-label { font-size: 13px; color: var(--muted); margin-bottom: 8px; }
        .stat-value { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 500; }
        .section-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin: 6px 0 12px 0; font-weight: 600; }
        .trail { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-bottom: 22px; font-size: 14px; }
        .trail-item { display: flex; align-items: center; gap: 4px; background: none; border: none; color: var(--ink-soft); cursor: pointer; padding: 4px 8px; border-radius: 7px; font-family: inherit; font-size: 14px; }
        .trail-item:hover { background: var(--hover); }
        .trail-item.current { color: var(--ink); font-weight: 600; }
        .trail-sep { color: var(--muted); display: flex; }
        .view-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
        .view-header h2 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 26px; margin: 0; }
        .node-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-bottom: 30px; }
        .node-card { position: relative; text-align: left; background: var(--card); border: 1px solid var(--line); border-radius: 13px; padding: 18px 18px 16px 18px; cursor: pointer; font-family: inherit; transition: box-shadow 0.15s, transform 0.15s; }
        .node-card:hover { box-shadow: 0 4px 14px rgba(var(--shadow),0.08); transform: translateY(-1px); }
        .node-card.clipped { outline: 2px dashed var(--chip-ink); outline-offset: -1px; }
        .resource-row.clipped { outline: 2px dashed var(--chip-ink); outline-offset: -1px; }
        .node-card-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--chip); color: var(--chip-ink); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .topic-icon { background: var(--amber-bg); color: var(--amber); }
        .node-card-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; padding-right: 20px; }
        .node-card-meta { font-size: 12.5px; color: var(--muted); }
        .node-card-arrow { position: absolute; top: 18px; right: 16px; color: var(--muted); transition: opacity 0.15s; }
        .node-card:hover .node-card-arrow { opacity: 0; }
        .node-card-badges { position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; }
        .badge-pin { color: var(--amber); }
        .badge-fav { color: var(--rose); }
        .resource-badges { display: flex; gap: 8px; flex-shrink: 0; padding-right: 2px; }
        .resource-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
        .resource-row { display: flex; align-items: center; gap: 12px; background: var(--card); border: 1px solid var(--line); border-radius: 11px; padding: 11px 14px; }
        .resource-icon { width: 32px; height: 32px; flex-shrink: 0; background: var(--chip); color: var(--chip-ink); border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .resource-main { flex: 1; min-width: 0; cursor: pointer; }
        .resource-name { font-size: 14.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .resource-sub { font-size: 12.5px; color: var(--muted); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .resource-actions { display: flex; gap: 2px; flex-shrink: 0; }
        .icon-btn { width: 30px; height: 30px; border: none; background: transparent; border-radius: 7px; color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s, color 0.15s; }
        .icon-btn:hover { background: var(--hover); color: var(--ink-soft); }
        .icon-btn.active-amber { color: var(--amber); background: var(--amber-bg); }
        .icon-btn.active-rose { color: var(--rose); background: var(--rose-bg); }
        .empty-state { border: 1px dashed var(--line); border-radius: 13px; padding: 32px; text-align: center; color: var(--muted); font-size: 14px; }
        .error-banner { display: flex; align-items: center; gap: 10px; background: var(--rose-bg); color: var(--rose); border-radius: 12px; padding: 14px 16px; margin-bottom: 20px; font-size: 14px; }
        .btn-primary { display: flex; align-items: center; gap: 6px; background: var(--navy-btn); color: white; border: none; border-radius: 9px; padding: 9px 16px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-primary.small { padding: 6px 12px; font-size: 13px; }
        .btn-primary:hover { background: var(--navy-btn-hover); }
        .btn-primary:disabled { opacity: 0.6; cursor: default; }
        .btn-ghost { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--line); color: var(--ink-soft); border-radius: 9px; padding: 6px 12px; font-size: 13px; cursor: pointer; font-family: inherit; }
        .btn-ghost:hover { background: var(--hover); }
        .create-menu { position: relative; }
        .create-dropdown { position: absolute; top: 42px; right: 0; background: var(--card); border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 8px 24px rgba(var(--shadow),0.12); padding: 6px; min-width: 210px; z-index: 20; }
        .create-option { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px; border: none; background: transparent; border-radius: 8px; font-size: 14px; color: var(--ink); cursor: pointer; font-family: inherit; text-align: left; }
        .create-option:hover { background: var(--hover); }
        .create-input-panel { padding: 12px; min-width: 250px; }
        .create-input-label { font-size: 12px; color: var(--muted); margin-bottom: 6px; }
        .create-input-panel input { width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; font-size: 14px; outline: none; font-family: inherit; margin-bottom: 10px; }
        .create-input-panel input:focus { border-color: var(--chip-ink); }
        .create-input-actions { display: flex; justify-content: flex-end; gap: 8px; }
        .res-kind-toggle { display: flex; gap: 6px; margin-bottom: 10px; }
        .res-kind-toggle button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 7px; border: 1px solid var(--line); background: transparent; border-radius: 8px; font-size: 13px; cursor: pointer; color: var(--ink-soft); font-family: inherit; }
        .res-kind-toggle button.active { background: var(--chip); color: var(--chip-ink); border-color: var(--chip-ink); }

        .context-menu { position: fixed; background: var(--card); border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 10px 30px rgba(var(--shadow),0.16); padding: 6px; min-width: 200px; z-index: 100; }
        .context-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px; border: none; background: transparent; border-radius: 8px; font-size: 14px; color: var(--ink); cursor: pointer; font-family: inherit; text-align: left; }
        .context-item:hover { background: var(--hover); }
        .context-item.danger { color: var(--rose); }
        .context-item.danger:hover { background: var(--rose-bg); }
        .context-divider { height: 1px; background: var(--line); margin: 5px 4px; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(var(--shadow),var(--overlay)); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal-card { background: var(--card); border-radius: 14px; padding: 20px; width: 320px; box-shadow: 0 16px 40px rgba(var(--shadow),0.2); }
        .modal-title { font-size: 13px; color: var(--muted); margin-bottom: 10px; text-transform: capitalize; }
        .modal-card input { width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 9px 11px; font-size: 14.5px; outline: none; font-family: inherit; margin-bottom: 14px; }
        .modal-card input:focus { border-color: var(--chip-ink); }
        .modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
      `}</style>

      <aside className="sidebar">
        <div className="logo serif">Re<span className="logo-accent">surf</span></div>
        <nav className="nav-list">
          {NAV.map((item) => {
            const isActive =
              (item.key === "dashboard" && view === "dashboard") ||
              (item.key === "browse-root" && view === "browse") ||
              (item.key === view && item.key !== "dashboard" && item.key !== "browse-root");
            const count = item.key === "favorites" ? favorites.length : item.key === "pinned" ? pinned.length : item.key === "trash" ? trashList.length : null;
            return (
              <button key={item.key} className={`nav-item ${isActive ? "active" : ""}`} onClick={() => selectNav(item.key)}>
                <item.icon size={16} />
                {item.label}
                {count !== null && count > 0 && <span className="nav-count">{count}</span>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-tagline">Organize. Search. Rediscover.</div>
          <button className="sidebar-logout" onClick={toggleTheme} title="Toggle theme" style={{ marginBottom: 6 }}>
            {theme === "light" ? <FiMoon size={15} /> : <FiSun size={15} />}
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
          <button className="sidebar-logout" onClick={handleLogout} title="Log out">
            <FiLogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="top-row">
          <div className="search-box">
            <FiSearch size={15} />
            <input placeholder="Search your knowledge…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {clipboard && view === "browse" && currentParent && (
            <button className="btn-ghost" onClick={pasteNode} title={`Paste "${clipboard.node.name}"`}>
              <FiClipboard size={14} /> Paste {clipboard.mode === "cut" ? "(move)" : "(copy)"}
            </button>
          )}
          <CreateMenu
            parentType={currentParent ? parentTypeAt(currentParent) : "root"}
            onCreateCollection={createCollection}
            onCreateTopic={createTopic}
            onCreateResource={createResource}
          />
        </div>

        {clipboard && (
          <div className="clipboard-banner">
            {clipboard.mode === "cut" ? <FiScissors size={14} /> : <FiCopy size={14} />}
            <span>
              {clipboard.mode === "cut" ? "Cut" : "Copied"} <strong>"{clipboard.node.name}"</strong>
              {view === "browse" && currentParent
                ? " — click Paste above to drop it here"
                : " — open a collection or topic, then click Paste"}
            </span>
            <button className="btn-ghost" style={{ marginLeft: "auto" }} onClick={clearClipboard}>
              <FiX size={13} /> Cancel
            </button>
          </div>
        )}

        {loadError && (
          <div className="error-banner">
            <FiAlertCircle size={16} />
            Couldn't load your library: {loadError}
            <button className="btn-ghost" style={{ marginLeft: "auto" }} onClick={loadTree}>
              <FiRefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="empty-state">Loading your library…</div>
        ) : query.trim() ? (
          <>
            <div className="section-title">Results for "{query}"</div>
            {searching && searchResults === null ? (
              <div className="empty-state">Searching…</div>
            ) : (searchResults || []).length === 0 ? (
              <div className="empty-state">Nothing found. Try a different keyword.</div>
            ) : (
              <div className="resource-list">
                {searchResults.map((n) => (
                  <EntryRow key={n.id} node={n} onOpen={openEntry} onContextMenu={openMenu} isClipped={clipboard?.node.id === n.id} />
                ))}
              </div>
            )}
          </>
        ) : view === "dashboard" ? (
          <>
            <TypedGreeting text={getGreeting(userName)} />
            <div className="subtitle">Rediscover what matters.</div>
            <div className="stat-grid">
              <div className="stat-card accent-coral"><div className="stat-label">Collections</div><div className="stat-value">{stats.collections}</div></div>
              <div className="stat-card accent-gold"><div className="stat-label">Topics</div><div className="stat-value">{stats.topics}</div></div>
              <div className="stat-card accent-teal"><div className="stat-label">Resources</div><div className="stat-value">{stats.resources}</div></div>
            </div>

            <div className="section-title">Pinned</div>
            {pinned.length === 0 ? (
              <div className="empty-state" style={{ marginBottom: 30 }}>Nothing pinned yet. Pin a resource to keep it here.</div>
            ) : (
              <div className="resource-list" style={{ marginBottom: 30 }}>
                {pinned.slice(0, 4).map((n) => (
                  <EntryRow key={n.id} node={n} onOpen={openEntry} onContextMenu={openMenu} isClipped={clipboard?.node.id === n.id} />
                ))}
              </div>
            )}

            <div className="section-title">Your collections</div>
            {nodes.filter((n) => n.type === "collection").length === 0 ? (
              <div className="empty-state">No collections yet — create one to get started.</div>
            ) : (
              <div className="node-grid">
                {nodes.filter((n) => n.type === "collection").map((c) => (
                  <NodeCard key={c.id} node={c} counts={countsFor(c.id)} onOpen={openNode} onContextMenu={openMenu} isClipped={clipboard?.node.id === c.id} />
                ))}
              </div>
            )}
          </>
        ) : view === "favorites" ? (
          <>
            <div className="view-header"><h2 className="serif">Favorites</h2></div>
            {favorites.length === 0 ? (
              <div className="empty-state">Star a resource to save it here.</div>
            ) : (
              <div className="resource-list">
                {favorites.map((n) => (
                  <EntryRow key={n.id} node={n} onOpen={openEntry} onContextMenu={openMenu} isClipped={clipboard?.node.id === n.id} />
                ))}
              </div>
            )}
          </>
        ) : view === "pinned" ? (
          <>
            <div className="view-header"><h2 className="serif">Pinned</h2></div>
            {pinned.length === 0 ? (
              <div className="empty-state">Pin a resource to keep it close.</div>
            ) : (
              <div className="resource-list">
                {pinned.map((n) => (
                  <EntryRow key={n.id} node={n} onOpen={openEntry} onContextMenu={openMenu} isClipped={clipboard?.node.id === n.id} />
                ))}
              </div>
            )}
          </>
        ) : view === "trash" ? (
          <>
            <div className="view-header">
              <h2 className="serif">Trash</h2>
              <button className="btn-ghost" onClick={loadTrash}>
                <FiRefreshCw size={13} /> Refresh
              </button>
            </div>
            {trashLoading ? (
              <div className="empty-state">Loading trash…</div>
            ) : trashList.length === 0 ? (
              <div className="empty-state">Nothing in the trash.</div>
            ) : (
              <div className="resource-list">
                {trashList.map((n) => (
                  <div className="resource-row" key={n.id}>
                    <div className={`resource-icon ${n.type === "topic" ? "topic-icon" : ""}`}>
                      {n.type === "resource" ? React.createElement((SUBTYPE_META[n.subType] || SUBTYPE_META.other).icon, { size: 16 }) : n.type === "collection" ? <FiFolder size={16} /> : <FiTag size={16} />}
                    </div>
                    <div className="resource-main">
                      <div className="resource-name">{n.name}</div>
                      <div className="resource-sub">{n.type}</div>
                    </div>
                    <div className="resource-actions">
                      <button className="icon-btn" title="Restore" onClick={() => restoreFromTrash(n)}><FiRotateCcw size={15} /></button>
                      <button className="icon-btn" title="Delete forever" onClick={() => deleteForever(n)}><FiX size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="trail">
              <button className={`trail-item ${!currentParent ? "current" : ""}`} onClick={() => setCurrentParent(null)}>
                <FiFolder size={14} /> Collections
              </button>
              {path.map((p) => (
                <React.Fragment key={p.id}>
                  <span className="trail-sep"><FiChevronRight size={13} /></span>
                  <button className={`trail-item ${p.id === currentParent?.id ? "current" : ""}`} onClick={() => setCurrentParent(p)}>
                    {p.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {!currentParent ? (
              nodes.filter((n) => n.type === "collection").length === 0 ? (
                <div className="empty-state">No collections yet — create one to get started.</div>
              ) : (
                <div className="node-grid">
                  {nodes.filter((n) => n.type === "collection").map((c) => (
                    <NodeCard key={c.id} node={c} counts={countsFor(c.id)} onOpen={openNode} onContextMenu={openMenu} isClipped={clipboard?.node.id === c.id} />
                  ))}
                </div>
              )
            ) : (
              <>
                {currentTopics.length > 0 && (
                  <>
                    <div className="section-title">Topics</div>
                    <div className="node-grid">
                      {currentTopics.map((t) => (
                        <NodeCard key={t.id} node={t} counts={countsFor(t.id)} onOpen={openNode} onContextMenu={openMenu} isClipped={clipboard?.node.id === t.id} />
                      ))}
                    </div>
                  </>
                )}
                <div className="section-title">Resources</div>
                {currentResources.length === 0 ? (
                  <div className="empty-state">No resources here yet.</div>
                ) : (
                  <div className="resource-list">
                    {currentResources.map((n) => (
                      <EntryRow key={n.id} node={n} onOpen={openEntry} onContextMenu={openMenu} isClipped={clipboard?.node.id === n.id} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          node={menu.node}
          onClose={closeMenu}
          onRename={(n) => setRenameTarget(n)}
          onToggleFavorite={toggleNodeFavorite}
          onTogglePinned={toggleNodePinned}
          onCut={cutNode}
          onCopy={copyNode}
          onTrash={trashNode}
          onDownload={downloadResource}
        />
      )}

      {renameTarget && (
        <RenameModal
          node={renameTarget}
          onClose={() => setRenameTarget(null)}
          onSubmit={renameNode}
        />
      )}
    </div>
  );
}
