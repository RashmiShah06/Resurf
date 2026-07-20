import { Collection } from "../models/collection.model.js";
import { Topic } from "../models/topic.model.js";
import { Resource } from "../models/resource.model.js";


function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


function buildKeywordQuery(rawQuery, fields) {
    const keywords = rawQuery.split(/\s+/).filter(Boolean);
    return {
        $and: keywords.map((word) => {
            const pattern = new RegExp(escapeRegex(word), "i");
            return { $or: fields.map((field) => ({ [field]: pattern })) };
        })
    };
}

const MAX_RESULTS_PER_TYPE = 20;


const search = async (req, res) => {
    try {
        const rawQuery = (req.query.q || "").trim();
        const type = (req.query.type || "all").toLowerCase();

        if (!rawQuery) {
            return res.status(200).json({ query: "", collections: [], topics: [], resources: [] });
        }

        const userId = req.user._id;

        const wantCollections = type === "all" || type === "collection";
        const wantTopics = type === "all" || type === "topic";
        const wantResources = type === "all" || type === "resource";

        const [collections, topics, resources] = await Promise.all([
            wantCollections
                ? Collection.find({
                    user: userId,
                    isDeleted: false,
                    ...buildKeywordQuery(rawQuery, ["name", "description"])
                }).sort({ updatedAt: -1 }).limit(MAX_RESULTS_PER_TYPE)
                : [],

            wantTopics
                ? Topic.find({
                    user: userId,
                    isDeleted: false,
                    ...buildKeywordQuery(rawQuery, ["name", "description"])
                }).sort({ updatedAt: -1 }).limit(MAX_RESULTS_PER_TYPE)
                : [],

            wantResources
                ? Resource.find({
                    user: userId,
                    isDeleted: false,
                    ...buildKeywordQuery(rawQuery, ["title", "description", "fileName", "linkUrl", "tags", "extractedText"])
                }).sort({ updatedAt: -1 }).limit(MAX_RESULTS_PER_TYPE)
                : []
        ]);

        return res.status(200).json({
            query: rawQuery,
            counts: {
                collections: collections.length,
                topics: topics.length,
                resources: resources.length
            },
            collections,
            topics,
            resources
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { search };