import fs from "fs";
import { createRequire } from "module";
import { ocrPdf } from "./ocr.helper.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");


const MAX_EXTRACTED_CHARS = 50000;

const MIN_TEXT_LENGTH_BEFORE_OCR = 20;


async function extractPdfText(localFilePath) {
    try {
        const buffer = fs.readFileSync(localFilePath);
        const data = await pdfParse(buffer);
        return (data.text || "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, MAX_EXTRACTED_CHARS);
    }
    catch (error) {
        console.error("PDF text extraction failed:", error.message);
        return "";
    }
}


async function extractPdfTextWithOcrFallback(localFilePath) {
    const directText = await extractPdfText(localFilePath);
    if (directText.length >= MIN_TEXT_LENGTH_BEFORE_OCR) {
        return directText;
    }
    return await ocrPdf(localFilePath);
}

export { extractPdfText, extractPdfTextWithOcrFallback };