import { fromPath } from "pdf2pic";
import Tesseract from "tesseract.js";
import fs from "fs";
import os from "os";
import path from "path";


const MAX_OCR_PAGES = 5;
const MAX_EXTRACTED_CHARS = 50000;


async function ocrPdf(localFilePath) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "resurf-ocr-"));

    try {
        const convertPage = fromPath(localFilePath, {
            density: 150,
            saveFilename: "page",
            savePath: tempDir,
            format: "png",
            width: 1200,
            height: 1600
        });

        let combinedText = "";

        for (let pageNum = 1; pageNum <= MAX_OCR_PAGES; pageNum++) {
            let pageImage;
            try {
                pageImage = await convertPage(pageNum, { responseType: "image" });
            }
            catch {
                break; // no more pages in the document
            }
            if (!pageImage?.path) break;

            const { data } = await Tesseract.recognize(pageImage.path, "eng");
            combinedText += " " + (data.text || "");

            fs.unlink(pageImage.path, () => {}); // best-effort cleanup, don't block on it
        }

        return combinedText.replace(/\s+/g, " ").trim().slice(0, MAX_EXTRACTED_CHARS);
    }
    catch (error) {
        // Missing system binaries, a malformed PDF, whatever — OCR
        // failing shouldn't block the upload, the resource just ends up
        // without content-searchable text, same as before this existed.
        console.error("OCR failed:", error.message);
        return "";
    }
    finally {
        fs.rm(tempDir, { recursive: true, force: true }, () => {});
    }
}

export { ocrPdf };