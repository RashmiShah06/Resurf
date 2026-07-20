import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        color: {
            type: String,
            default: "#3B82F6"
        },

        icon: {
            type: String,
            default: "📁"
        },

        favorite: {
            type: Boolean,
            default: false
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

export const Collection = mongoose.model(
    "Collection",
    collectionSchema
);