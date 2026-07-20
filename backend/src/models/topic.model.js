import mongoose, { Schema } from "mongoose";

const topicSchema = new Schema(
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

        collection: {
            type: Schema.Types.ObjectId,
            ref: "Collection",
            required: true
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        parentTopic: {
            type: Schema.Types.ObjectId,
            ref: "Topic",
            default: null
        },
        favorite: {
            type: Boolean,
            default: false
        },
        isPinned: {
            type: Boolean,
            default: false
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

export const Topic = mongoose.model("Topic", topicSchema);