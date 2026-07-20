import path from "path";

export const getFileDetails = (file) => {

    const extension = path.extname(file.originalname).toLowerCase();

    let subType = "other";
    let language = "";

    switch (extension) {

        case ".pdf":
        case ".doc":
        case ".docx":
        case ".txt":
            subType = "document";
            break;

        case ".ppt":
        case ".pptx":
            subType = "presentation";
            break;

        case ".jpg":
        case ".jpeg":
        case ".png":
        case ".gif":
        case ".webp":
            subType = "image";
            break;

        case ".mp4":
        case ".avi":
        case ".mkv":
            subType = "video";
            break;

        case ".cpp":
            subType = "code";
            language = "cpp";
            break;

        case ".c":
            subType = "code";
            language = "c";
            break;

        case ".java":
            subType = "code";
            language = "java";
            break;

        case ".py":
            subType = "code";
            language = "python";
            break;

        case ".js":
            subType = "code";
            language = "javascript";
            break;

        case ".ts":
            subType = "code";
            language = "typescript";
            break;

        case ".html":
            subType = "code";
            language = "html";
            break;

        case ".css":
            subType = "code";
            language = "css";
            break;

        case ".json":
            subType = "code";
            language = "json";
            break;

        case ".zip":
        case ".rar":
            subType = "archive";
            break;
    }

    return {
        subType,
        language,
        extension
    };
};