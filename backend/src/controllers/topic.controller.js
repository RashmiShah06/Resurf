import { Topic } from "../models/topic.model.js";
import { Collection } from "../models/collection.model.js";
import { Resource } from "../models/resource.model.js";
import {
    moveTopicToTrash,
    restoreTopicFromTrash,
    deleteTopicForever
} from "../helpers/topicTree.helper.js";

const createTopic = async (req, res) => {
    try {
        const { name, description} = req.body;
        const { collectionId } = req.params;
        if (!name?.trim() || !collectionId) {
            return res.status(400).json({
                message: "Topic name and collection are required"});
        }
        const collection = await Collection.findOne({_id: collectionId,user: req.user._id});
        if(!collection){
            return res.status(404).json({message: "Collection not found"});
        }
        const existingTopic = await Topic.findOne({name: name.trim(),collection: collectionId,parentTopic:null,user: req.user._id});

        if (existingTopic){
            return res.status(409).json({message: "Topic already exists"});
        }
        const topic = await Topic.create({name,description,collection: collectionId,parentTopic: null,user: req.user._id});
         return res.status(201).json({
            message: "Topic successfully created",topic});
    } 
    catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const createChildTopic = async (req, res) =>{
    try{
        const { parentTopicId } = req.params;
        const { name, description } = req.body;
        if (!name?.trim()){
            return res.status(400).json({
                message: "Topic name is required"});
        }
        const parentTopic = await Topic.findOne({_id: parentTopicId,user: req.user._id});
        if (!parentTopic) {
            return res.status(404).json({
                message: "Parent topic not found"});
        }

        const existingTopic = await Topic.findOne({
            name: name.trim(),
            parentTopic: parentTopicId,
            user: req.user._id});

        if (existingTopic){
            return res.status(409).json({
                message: "Topic already exists"});
        }
         const topic = await Topic.create({
            name,
            description,
            collection: parentTopic.collection,
            parentTopic: parentTopicId,
            user: req.user._id
        });

        return res.status(201).json({
            message: "Child topic created successfully.",topic});

    }
    catch (error){
        return res.status(500).json({
            message: "Server error",error: error.message});
    }
};


const getRootTopics = async (req, res) => {
    try{
        const { collectionId } = req.params;
        const collection = await Collection.findOne({_id: collectionId,user: req.user._id});

        if (!collection) {
            return res.status(404).json({
                message: "Collection not found."});
        }

        const topics = await Topic.find({
            collection: collectionId,
            parentTopic: null,
            user: req.user._id,
            isDeleted: false
        }).sort({ createdAt: 1 });

        return res.status(200).json({topics});

    }
    catch(error){
        return res.status(500).json({
            message: "Server error",error: error.message});
    }
};

const getChildTopics = async (req, res) => {
    try{
        const { parentTopicId } = req.params;

        const topics = await Topic.find({
            parentTopic: parentTopicId,
            user: req.user._id,
            isDeleted: false
        }).sort({ createdAt: 1 });

        return res.status(200).json({topics});

    }
    catch(error){
        return res.status(500).json({
            message: "Server error",error: error.message});
    }
};



const updateTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { name, description } = req.body;
        if (!name?.trim()){
            return res.status(400).json({
                message: "Topic name is required."});
        }

        const topic = await Topic.findOne({_id: topicId,user: req.user._id});

        if(!topic){
            return res.status(404).json({message: "Topic not found."});
        }
        const duplicateTopic = await Topic.findOne({
            _id: { $ne: topicId },          // Exclude current topic
            name: name.trim(),
            collection: topic.collection,
            parentTopic: topic.parentTopic,
            user: req.user._id
        });

        if(duplicateTopic){
            return res.status(409).json({
                message: "Topic already exists"
            });
        }
        topic.name = name.trim();
        topic.description = description || "";

        await topic.save();
        return res.status(200).json({
            message: "Topic successfully updated",topic});

    }
    catch (error) {
        return res.status(500).json({
            message: "Server error",error: error.message});
    }
};


const toggleTopicFavorite = async (req, res) => {
    try{
        const { topicId } = req.params;
        const topic = await Topic.findOne({
            _id: topicId,
            user: req.user._id,
            isDeleted: false});

        if(!topic){
            return res.status(404).json({message: "Topic not found."});
        }
        topic.favorite = !topic.favorite;
        await topic.save();
        return res.status(200).json({
            message: "Topic updated",topic});
    }
    catch(error){
        return res.status(500).json({message: "Server error",error: error.message});
    }
};

const toggleTopicPinned = async (req, res) => {
    try{
        const { topicId } = req.params;
        const topic = await Topic.findOne({
            _id: topicId,
            user: req.user._id,
            isDeleted: false});

        if(!topic){
            return res.status(404).json({message: "Topic not found."});
        }
        topic.isPinned = !topic.isPinned;
        await topic.save();
        return res.status(200).json({
            message: "Topic updated",topic});
    }
    catch(error){
        return res.status(500).json({message: "Server error",error: error.message});
    }
};

const deleteTopic = async (req, res) => {
    try{
        const { topicId } = req.params;
        const topic = await Topic.findOne({
            _id: topicId,
            user: req.user._id,
            isDeleted: false});

        if(!topic){
            return res.status(404).json({
                message: "Topic not found"});
        }

        await moveTopicToTrash(topicId, req.user._id);

        return res.status(200).json({
            message: "Topic moved to trash"});

    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const restoreTopic = async (req, res) => {
    try{
        const { topicId } = req.params;
        const topic = await Topic.findOne({
            _id: topicId,
            user: req.user._id,
            isDeleted: true});

        if(!topic){
            return res.status(404).json({
                message: "Topic not found in trash"});
        }

        await restoreTopicFromTrash(topicId, req.user._id);

        return res.status(200).json({
            message: "Topic successfully restored"});

    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const deleteTopicPermanently = async (req, res) => {
    try{
        const { topicId } = req.params;
        const topic = await Topic.findOne({
            _id: topicId,
            user: req.user._id,
            isDeleted: true});

        if(!topic){
            return res.status(404).json({
                message: "Topic not found in trash"});
        }
        await deleteTopicForever(topicId, req.user._id);
        return res.status(200).json({
            message: "Topic deleted permanently"});

    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

/* -------------------------------------------------------------
   MOVE (cut/paste) — reparents a topic under a different topic
   or collection. If the collection changes, every descendant
   topic AND every resource anywhere in the subtree needs its
   `collection` field updated too, since your schema stores that
   redundantly at every level for fast lookups.
------------------------------------------------------------- */
async function collectDescendantTopicIds(topicId) {
    const ids = [];
    const children = await Topic.find({ parentTopic: topicId });
    for (const child of children) {
        ids.push(child._id);
        const nested = await collectDescendantTopicIds(child._id);
        ids.push(...nested);
    }
    return ids;
}

const moveTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { targetCollectionId, targetParentTopicId } = req.body;

        if (!targetCollectionId) {
            return res.status(400).json({ message: "targetCollectionId is required" });
        }

        const topic = await Topic.findOne({ _id: topicId, user: req.user._id, isDeleted: false });
        if (!topic) return res.status(404).json({ message: "Topic not found" });

        if (targetParentTopicId) {
            if (targetParentTopicId === topicId) {
                return res.status(400).json({ message: "Cannot move a topic into itself" });
            }
            const descendantIds = (await collectDescendantTopicIds(topicId)).map(String);
            if (descendantIds.includes(targetParentTopicId)) {
                return res.status(400).json({ message: "Cannot move a topic into its own subtopic" });
            }
            const targetParent = await Topic.findOne({ _id: targetParentTopicId, user: req.user._id, isDeleted: false });
            if (!targetParent) return res.status(404).json({ message: "Target topic not found" });
        }

        const targetCollection = await Collection.findOne({ _id: targetCollectionId, user: req.user._id, isDeleted: false });
        if (!targetCollection) return res.status(404).json({ message: "Target collection not found" });

        const duplicateAtDestination = await Topic.findOne({
            _id: { $ne: topicId },
            name: topic.name,
            collection: targetCollectionId,
            parentTopic: targetParentTopicId || null,
            user: req.user._id
        });
        if (duplicateAtDestination) {
            return res.status(409).json({ message: "A topic with this name already exists there" });
        }

        const collectionChanged = topic.collection.toString() !== targetCollectionId;

        topic.parentTopic = targetParentTopicId || null;
        topic.collection = targetCollectionId;
        await topic.save();

        if (collectionChanged) {
            const descendantTopicIds = await collectDescendantTopicIds(topicId);
            if (descendantTopicIds.length > 0) {
                await Topic.updateMany({ _id: { $in: descendantTopicIds } }, { collection: targetCollectionId });
            }
            const allTopicIds = [topicId, ...descendantTopicIds.map(String)];
            await Resource.updateMany({ topic: { $in: allTopicIds } }, { collection: targetCollectionId });
        }

        return res.status(200).json({ message: "Topic moved successfully", topic });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* -------------------------------------------------------------
   DUPLICATE (copy/paste) — deep-copies a topic, all its child
   topics recursively, and every resource in that subtree.
------------------------------------------------------------- */
async function duplicateTopicRecursive(sourceTopicId, newCollectionId, newParentTopicId, userId, isRoot = false) {
    const source = await Topic.findOne({ _id: sourceTopicId, user: userId });

    const copy = await Topic.create({
        name: isRoot ? `${source.name} (copy)` : source.name,
        description: source.description,
        collection: newCollectionId,
        parentTopic: newParentTopicId,
        user: userId
    });

    const resources = await Resource.find({ topic: sourceTopicId, user: userId, isDeleted: false });
    for (const r of resources) {
        await Resource.create({
            title: r.title,
            description: r.description,
            resourceType: r.resourceType,
            subType: r.subType,
            language: r.language,
            linkUrl: r.linkUrl,
            fileName: r.fileName,
            fileUrl: r.fileUrl,
            fileSize: r.fileSize,
            mimeType: r.mimeType,
            fileExtension: r.fileExtension,
            publicId: r.publicId,
            cloudinaryResourceType: r.cloudinaryResourceType,
            collection: newCollectionId,
            topic: copy._id,
            user: userId
        });
    }

    const children = await Topic.find({ parentTopic: sourceTopicId, user: userId, isDeleted: false });
    for (const child of children) {
        await duplicateTopicRecursive(child._id, newCollectionId, copy._id, userId, false);
    }

    return copy;
}

const duplicateTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { targetCollectionId, targetParentTopicId } = req.body;

        if (!targetCollectionId) {
            return res.status(400).json({ message: "targetCollectionId is required" });
        }

        const topic = await Topic.findOne({ _id: topicId, user: req.user._id, isDeleted: false });
        if (!topic) return res.status(404).json({ message: "Topic not found" });

        const targetCollection = await Collection.findOne({ _id: targetCollectionId, user: req.user._id, isDeleted: false });
        if (!targetCollection) return res.status(404).json({ message: "Target collection not found" });

        const copy = await duplicateTopicRecursive(topicId, targetCollectionId, targetParentTopicId || null, req.user._id, true);

        return res.status(201).json({ message: "Topic duplicated successfully", topic: copy });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export {
    createTopic, getRootTopics, createChildTopic, getChildTopics, updateTopic, deleteTopic, restoreTopic, deleteTopicPermanently,
    moveTopic, duplicateTopic, toggleTopicFavorite, toggleTopicPinned
};