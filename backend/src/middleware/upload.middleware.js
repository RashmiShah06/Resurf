import multer from "multer";
import path from "path";
import os from "os";
import fs from "fs";

const uploadDir = path.join(os.tmpdir(), "resurf-uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function(req, file, cb) {

        const ext = path.extname(file.originalname);
        const base = path
            .basename(file.originalname, ext)
            .replace(/\s+/g, "_");

        const uniqueName = `${Date.now()}-${base}${ext}`;

        cb(null, uniqueName);

    }

});

const upload = multer({
    storage
});

export default upload;