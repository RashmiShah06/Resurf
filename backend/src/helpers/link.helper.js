

const FETCH_TIMEOUT_MS = 5000;
const MAX_EXTRACTED_CHARS = 2000;


const MAX_HTML_BYTES = 200_000;

function extractMetaContent(html, patterns) {
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) return decodeHtmlEntities(match[1].trim());
    }
    return "";
}

function decodeHtmlEntities(str) {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

async function readHeadHtml(response) {
    const reader = response.body.getReader();
    const chunks = [];
    let totalBytes = 0;

    try {
        while (totalBytes < MAX_HTML_BYTES) {
            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            totalBytes += value.length;

         
            const soFar = Buffer.concat(chunks).toString("utf-8");
            if (soFar.includes("</head>")) return soFar;
        }
    }
    finally {
        reader.cancel().catch(() => {});
    }

    return Buffer.concat(chunks).toString("utf-8");
}

async function fetchYouTubeMetadata(url) {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!response.ok) return null; // private/deleted/invalid video — fall back to generic scrape

    const data = await response.json();
    return {
        title: data.title || "",
        description: `${data.title || ""} ${data.author_name || ""}`.trim().slice(0, MAX_EXTRACTED_CHARS)
    };
}

async function fetchGitHubMetadata(url) {
    const match = new URL(url).pathname.match(/^\/([^/]+)\/([^/]+)/);
    if (!match) return null; 

    const [, owner, repo] = match;
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
            "User-Agent": "ResurfBot/1.0", // GitHub's API requires a User-Agent header
            "Accept": "application/vnd.github+json"
        }
    });
    // Unauthenticated GitHub API calls are capped at 60/hour — a 403 here
    // often means that limit was hit, not that the repo doesn't exist.
    if (!response.ok) return null;

    const data = await response.json();
    return {
        title: data.full_name || repo,
        description: `${data.full_name || ""} ${data.description || ""} ${(data.topics || []).join(" ")}`
            .trim().slice(0, MAX_EXTRACTED_CHARS)
    };
}

function isYouTubeUrl(hostname) {
    return hostname === "youtube.com" || hostname === "www.youtube.com" || hostname === "youtu.be";
}

function isGitHubRepoUrl(hostname) {
    return hostname === "github.com" || hostname === "www.github.com";
}

async function fetchLinkMetadata(url) {
    try {
        const hostname = new URL(url).hostname.toLowerCase();

        // youtube links
        if (isYouTubeUrl(hostname)) {
            const result = await fetchYouTubeMetadata(url).catch(() => null);
            if (result) return result;
        }
        if (isGitHubRepoUrl(hostname)) {
            const result = await fetchGitHubMetadata(url).catch(() => null);
            if (result) return result;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                // Some sites serve stripped-down/blocked responses to
                // requests with no user-agent at all.
                "User-Agent": "Mozilla/5.0 (compatible; ResurfBot/1.0; +link-preview)"
            }
        });
        clearTimeout(timeout);

        if (!response.ok) return { title: "", description: "" };

        const html = await readHeadHtml(response);


        const title = extractMetaContent(html, [
            /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
            /<title[^>]*>([^<]+)<\/title>/i
        ]);

        const description = extractMetaContent(html, [
            /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
            /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i
        ]);

        return {
            title,
            description: `${title} ${description}`.trim().slice(0, MAX_EXTRACTED_CHARS)
        };
    }
    catch (error) {
        
        console.error("Link metadata fetch failed:", error.message);
        return { title: "", description: "" };
    }
}

export { fetchLinkMetadata };