import mongoose, { Schema } from "mongoose";

const resourceSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },
        extractedText: {
            type: String,
            default: ""
        },

        // file | link
        resourceType: {
            type: String,
            enum: ["file", "link"],
            required: true
        },

        // pdf | ppt | docx | youtube | github | chatgpt | website ...
        subType: {
            type: String,
            enum: [
            // Files
            "document",
            "presentation",
            "spreadsheet",
            "code",
            "image",
            "video",
            "archive",
            "text",

            // Links
            "youtube",
            "github",
            "website",
            "chatgpt",
            "drive",
            "linkedin",
            "leetcode",
            "geeksforgeeks",
            "other"],
            required: true
        },

        linkUrl: {
            type: String,
            default: ""
        },

        fileUrl: {
            type: String,
            default: ""
        },
        cloudinaryResourceType: {
            type: String,
            default: ""
        },
        publicId: {
            type: String,
            default: ""
        },
        fileName: {
            type: String,
            default: ""
        },

        fileSize: {
            type: Number,
            default: 0
        },

        mimeType: {
            type: String,
            default: ""
        },
        language: {
            type: String,
            default: ""
        },

        fileExtension: {
            type: String,
            default: ""
        },
        collection: {
            type: Schema.Types.ObjectId,
            ref: "Collection",
            required: true
        },

        topic: {
            type: Schema.Types.ObjectId,
            ref: "Topic",
            default: null
        },

        tags: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],

        favorite: {
            type: Boolean,
            default: false
        },
        
        isArchived: {
            type: Boolean,
            default: false
        },
        lastOpened: {
            type: Date,
            default: null
        },
        isPinned: {
            type: Boolean,
            default: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },

        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export const Resource = mongoose.model("Resource", resourceSchema);