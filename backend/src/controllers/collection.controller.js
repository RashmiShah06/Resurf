import { Collection } from "../models/collection.model.js";
import { Topic } from "../models/topic.model.js";
import { Resource } from "../models/resource.model.js";

import {
    moveTopicToTrash,
    restoreTopicFromTrash,
    deleteTopicForever
} from "../helpers/topicTree.helper.js";
const createCollection = async (req, res) => {
    try {
        const {name,description,color,icon} = req.body;
        if (!name?.trim()) {
            return res.status(400).json({ message: "please enter the collection name"});
        }
        const existingCollection = await Collection.findOne({name: name.trim(),user: req.user._id});

        if (existingCollection) {
            return res.status(409).json({message: "Collection already exists."});
        }
        const collection = await Collection.create({
            name,description,color,icon,user: req.user._id});
        
        return res.status(201).json({message: "Collection successfully created",collection});
    } 
    catch (error) {
        return res.status(500).json({ message: "Server error",error: error.message});
    }
};
const getCollections = async (req, res) => {
    try {
        const collections = await Collection.find({user: req.user._id, isDeleted: false}).sort({ createdAt: -1 });
        return res.status(200).json({collections});

    } 
    catch (error) {
        return res.status(500).json({message: "Server error",error: error.message});
    }
};

const updateCollection = async (req, res) => {
    try{
        const { collectionId } = req.params;
        const { name, description, color, icon } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                message: "Collection name is required."});
        }

        const collection = await Collection.findOne({_id: collectionId,user: req.user._id});

        if(!collection){
            return res.status(404).json({message: "Collection not found."});
        }
        const existingCollection = await Collection.findOne({
            name: name.trim(),user: req.user._id});

        if(existingCollection && existingCollection._id.toString() !== collectionId) {
            return res.status(409).json({
                message: "Collection already exists"});
        }

        collection.name = name.trim();
        collection.description = description;
        collection.color = color;
        collection.icon = icon;

        await collection.save();
        return res.status(200).json({
            message: "Collection successfully updated",collection});

    }
    catch(error){
        return res.status(500).json({message: "Server error",error: error.message});
    }
};

const deleteCollection = async (req, res) => {
    try{
        const { collectionId } = req.params;
        const collection = await Collection.findOne({
            _id: collectionId,
            user: req.user._id,
            isDeleted: false});

        if(!collection){
            return res.status(404).json({
                message: "Collection not found."});
        }

        // Move collection-level resources to trash
        await Resource.updateMany({
                collection: collectionId,
                topic: null,
                user: req.user._id,
                isDeleted: false
            },
            {
                isDeleted: true,
                deletedAt: new Date()
            }
        );

        // Find all root topics and move to trash
        const rootTopics = await Topic.find({
            collection: collectionId,
            parentTopic: null,
            user: req.user._id,
            isDeleted: false
        });
        for(const topic of rootTopics){
            await moveTopicToTrash(topic._id, req.user._id);
        }

        // Move collection to trash
        collection.isDeleted = true;
        collection.deletedAt = new Date();
        await collection.save();

        return res.status(200).json({
            message: "Collection moved to trash"});

    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const restoreCollection = async (req, res) => {
    try{
        const { collectionId } = req.params;
        const collection = await Collection.findOne({
            _id: collectionId,
            user: req.user._id,
            isDeleted: true
        });
        if(!collection){
            return res.status(404).json({
                message: "Collection not found in trash"});
        }
        collection.isDeleted = false;
        collection.deletedAt = null;
        await collection.save();

        // Restore collection resources
        await Resource.updateMany({
                collection: collectionId,
                topic: null,
                user: req.user._id,
                isDeleted: true
            },
            {
                isDeleted: false,
                deletedAt: null
            }
        );
        // Restore root topics
        const rootTopics = await Topic.find({
            collection: collectionId,
            parentTopic: null,
            user: req.user._id,
            isDeleted: true
        });
        for (const topic of rootTopics) {
            await restoreTopicFromTrash(topic._id, req.user._id);
        }
        return res.status(200).json({
            message: "Collection restored successfully"});

    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const toggleCollectionFavorite = async (req, res) => {
    try{
        const { collectionId } = req.params;
        const collection = await Collection.findOne({
            _id: collectionId,
            user: req.user._id,
            isDeleted: false
        });
        if(!collection){
            return res.status(404).json({message: "Collection not found."});
        }
        collection.favorite = !collection.favorite;
        await collection.save();
        return res.status(200).json({
            message: "Collection updated",collection});
    }
    catch(error){
        return res.status(500).json({message: "Server error",error: error.message});
    }
};

const toggleCollectionPinned = async (req, res) => {
    try{
        const { collectionId } = req.params;
        const collection = await Collection.findOne({
            _id: collectionId,
            user: req.user._id,
            isDeleted: false
        });
        if(!collection){
            return res.status(404).json({message: "Collection not found."});
        }
        collection.isPinned = !collection.isPinned;
        await collection.save();
        return res.status(200).json({
            message: "Collection updated",collection});
    }
    catch(error){
        return res.status(500).json({message: "Server error",error: error.message});
    }
};

const deleteCollectionPermanently = async (req, res) => {
    try{
        const { collectionId } = req.params;
        const collection = await Collection.findOne({
            _id: collectionId,
            user: req.user._id,
            isDeleted: true
        });
        if(!collection){
            return res.status(404).json({
                message: "Collection not found in trash"});
        }
        // Delete collection-level resources
        await Resource.deleteMany({
            collection: collectionId,
            topic: null,
            user: req.user._id
        });

        // Delete all topic trees
        const rootTopics = await Topic.find({
            collection: collectionId,
            parentTopic: null,
            user: req.user._id
        });
        for(const topic of rootTopics){
            await deleteTopicForever(topic._id, req.user._id);}

        // Delete collection
        await Collection.findByIdAndDelete(collectionId);
        return res.status(200).json({
            message: "Collection deleted permanently"});

    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

export {
    createCollection, getCollections, updateCollection, deleteCollection, deleteCollectionPermanently, restoreCollection,
    toggleCollectionFavorite, toggleCollectionPinned
};