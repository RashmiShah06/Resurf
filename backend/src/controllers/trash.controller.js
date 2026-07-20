import { Collection } from "../models/collection.model.js";
import { Topic } from "../models/topic.model.js";
import { Resource } from "../models/resource.model.js";

// Returns everything currently in the trash for this user, across all
// three types, so the frontend can show one unified Trash view.
const getTrash = async (req, res) => {
    try {
        const [collections, topics, resources] = await Promise.all([
            Collection.find({ user: req.user._id, isDeleted: true }).sort({ deletedAt: -1 }),
            Topic.find({ user: req.user._id, isDeleted: true }).sort({ deletedAt: -1 }),
            Resource.find({ user: req.user._id, isDeleted: true }).sort({ deletedAt: -1 }),
        ]);

        return res.status(200).json({ collections, topics, resources });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { getTrash };