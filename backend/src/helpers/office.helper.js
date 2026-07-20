import mammoth from "mammoth";
import AdmZip from "adm-zip";


const MAX_EXTRACTED_CHARS = 50000;

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PPTX_MIME = "application/vnd.openxmlformats-officedocument.presentationml.presentation";

function clip(text) {
    return (text || "").replace(/\s+/g, " ").trim().slice(0, MAX_EXTRACTED_CHARS);
}


async function extractDocxText(localFilePath) {
    try {
        const result = await mammoth.extractRawText({ path: localFilePath });
        return clip(result.value);
    }
    catch (error) {
        console.error("DOCX text extraction failed:", error.message);
        return "";
    }
}


async function extractPptxText(localFilePath) {
    try {
        const zip = new AdmZip(localFilePath);
        const slideEntries = zip.getEntries()
            .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.entryName));

        let combinedText = "";
        for (const entry of slideEntries) {
            const xml = entry.getData().toString("utf-8");
            const runs = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
            combinedText += " " + runs.map((r) => r.replace(/<\/?a:t>/g, "")).join(" ");
        }
        return clip(combinedText);
    }
    catch (error) {
        console.error("PPTX text extraction failed:", error.message);
        return "";
    }
}


async function extractOfficeText(localFilePath, mimeType) {
    if (mimeType === DOCX_MIME) return extractDocxText(localFilePath);
    if (mimeType === PPTX_MIME) return extractPptxText(localFilePath);
    return "";
}

export { extractDocxText, extractPptxText, extractOfficeText, DOCX_MIME, PPTX_MIME };