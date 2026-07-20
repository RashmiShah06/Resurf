import { Resource } from "../models/resource.model.js";
import { Collection } from "../models/collection.model.js";
import { Topic } from "../models/topic.model.js";
import { getFileDetails } from "../helpers/file.helper.js";
import { extractPdfTextWithOcrFallback } from "../helpers/pdf.helper.js";
import { extractOfficeText } from "../helpers/office.helper.js";
import { fetchLinkMetadata } from "../helpers/link.helper.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";

function buildUploadFolder(req) {
    const uniqueToken = path.parse(req.file.filename).name;
    return `resurf/${req.user._id}/${uniqueToken}`;
}

const createCollectionResource = async (req, res) => {
    try{
        const { collectionId } = req.params;
        let {
            title,
            description,
            resourceType,
            //subType,
            linkUrl
        } = req.body;
        let subType = "";
        let language = "";
        let extension = "";
        let extractedText = "";

        if(!resourceType){
            return res.status(400).json({message: "Resource type is required"});
        }
        let cloudinaryResponse = null;
        if(resourceType === "file"){
            if (!req.file) {
                return res.status(400).json({message: "File is required"
                });
            }
            const MAX_FILE_SIZE = 10 * 1024 * 1024;

            if (req.file.size > MAX_FILE_SIZE) {
                return res.status(400).json({message: "File size must be less than 10 MB."});
            }
            title = req.file.originalname;
            ({ subType, language, extension } = getFileDetails(req.file));

            // Must run before uploadOnCloudinary — that call deletes the
            // local temp file once the Cloudinary upload succeeds, so the
            // text has to be pulled out first.
            if (req.file.mimetype === "application/pdf") {
                extractedText = await extractPdfTextWithOcrFallback(req.file.path);
            } else {
                extractedText = await extractOfficeText(req.file.path, req.file.mimetype);
            }

            cloudinaryResponse = await uploadOnCloudinary(req.file.path, req.file.mimetype, req.file.originalname, buildUploadFolder(req));
            // if (req.file) {
            //     fs.unlink(req.file.path, (err) => {
            //     if (err) console.error(err);});
            // }

            if(!cloudinaryResponse){
                return res.status(500).json({message: "Failed to upload file"});
            }
        }
        if(resourceType === "link"){
            if(!title?.trim()){
                return res.status(400).json({message: "Title is required"});
            }
            if(!linkUrl?.trim()){
                return res.status(400).json({message: "URL is required"});
            }
            subType = "website";
        }
        const collection = await Collection.findOne({
            _id: collectionId,user: req.user._id});

        if(!collection){
            return res.status(404).json({
                message: "Collection not found"});
        }

        let duplicateQuery = {
            collection: collectionId,
            topic: null,
            user: req.user._id,
            isDeleted: false
        };

        if(resourceType === "file"){
            duplicateQuery.fileName = req.file.originalname;
        }
        else{
            duplicateQuery.linkUrl = linkUrl.trim();
        }
        const existingResource = await Resource.findOne(duplicateQuery);
        if(existingResource){
            if(req.file){
                fs.unlink(req.file.path, (err) => {
                    if(err){
                        console.error(err);
                    }
                });
            }

            return res.status(409).json({message: "Resource already exists"});
        }

        // Runs after the duplicate check so we don't waste a network
        // fetch on a link that's about to be rejected anyway.
        if (resourceType === "link") {
            const metadata = await fetchLinkMetadata(linkUrl.trim());
            extractedText = metadata.description;
        }

        const resource = await Resource.create({
            title: title.trim(),
            description,
            resourceType,
            subType,
            language,
            linkUrl,
            fileName: req.file?.originalname || "",
            fileUrl: cloudinaryResponse?.secure_url || "",
            fileSize: req.file?.size || 0,
            mimeType: req.file?.mimetype || "",
            fileExtension: extension,
            publicId: cloudinaryResponse?.public_id || "", cloudinaryResourceType: cloudinaryResponse?.resource_type || "",
            extractedText,
            collection: collectionId,
            topic: null,
            user: req.user._id
        });

        return res.status(201).json({
            message: "Resource successfully created",resource});

    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const getCollectionResources = async (req, res) => {
    try{
        const { collectionId } = req.params;
        const collection = await Collection.findOne({
            _id: collectionId,user: req.user._id});

        if(!collection){
            return res.status(404).json({
                message: "Collection not found"});
        }

        const resources = await Resource.find({
            collection: collectionId,
            topic: null,
            isArchived: false,
            user: req.user._id,
            isDeleted: false
        }).sort({ createdAt: -1 });

        return res.status(200).json({resources});

    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const createTopicResource = async(req,res) => {
    try{
    const { topicId } = req.params;
        let {
            title,
            description,
            resourceType,
            //subType,
            linkUrl
        } = req.body;
        let subType = "";
        let language = "";
        let extension = "";
        let extractedText = "";
        let cloudinaryResponse = null;
        if(!resourceType){
            return res.status(400).json({message: "Resource type is required"});
        }

        if(resourceType === "file"){
            if(!req.file){
                return res.status(400).json({message: "File is required"});
            }
            const MAX_FILE_SIZE = 10 * 1024 * 1024;

            if(req.file.size > MAX_FILE_SIZE){
                return res.status(400).json({message: "File size must be less than 10 MB."});
            }

            title = req.file.originalname;

            ({ subType, language, extension } = getFileDetails(req.file));

            // Must run before uploadOnCloudinary — it deletes the local
            // temp file once the Cloudinary upload succeeds.
            if (req.file.mimetype === "application/pdf") {
                extractedText = await extractPdfTextWithOcrFallback(req.file.path);
            } else {
                extractedText = await extractOfficeText(req.file.path, req.file.mimetype);
            }

            cloudinaryResponse = await uploadOnCloudinary(req.file.path, req.file.mimetype, req.file.originalname, buildUploadFolder(req));

            if(!cloudinaryResponse){
                return res.status(500).json({message: "Failed to upload file"});
            }
        }
        if(resourceType === "link"){
            if(!title?.trim()){
                return res.status(400).json({message: "Title is required"});
            }

            if(!linkUrl?.trim()){
                return res.status(400).json({message: "URL is required"});
            }
            subType = "website";
        }

        const topic = await Topic.findOne({
            _id: topicId,user: req.user._id});

        if(!topic){
            return res.status(404).json({message: "Topic not found"});
        }
        let duplicateQuery = {
            collection: topic.collection,
            topic: topicId,
            user: req.user._id,
            isDeleted: false
        };

        if(resourceType === "file"){
            duplicateQuery.fileName = req.file.originalname;
        }
        else{
            duplicateQuery.linkUrl = linkUrl.trim();
        }
        const existingResource = await Resource.findOne(duplicateQuery);
        if(existingResource){
            // if(req.file){
            //     fs.unlink(req.file.path, (err) => {
            //         if(err){
            //             console.error(err);
            //         }
            //     });
            // }
            return res.status(409).json({message: "Resource already exists"});
        }

        
        if (resourceType === "link") {
            const metadata = await fetchLinkMetadata(linkUrl.trim());
            extractedText = metadata.description;
        }

        const resource = await Resource.create({
            title: title.trim(),
            description,
            resourceType,
            subType,
            language,
            linkUrl,
            fileName: req.file?.originalname || "",
            fileUrl: cloudinaryResponse?.secure_url|| "",
            fileSize: req.file?.size || 0,
            mimeType: req.file?.mimetype || "",
            fileExtension: extension,
            publicId: cloudinaryResponse?.public_id || "",cloudinaryResourceType: cloudinaryResponse?.resource_type || "",
            extractedText,
            collection: topic.collection,
            topic: topicId,
            user: req.user._id
        });

        return res.status(201).json({
            message: "Resource successfully created",resource});

    }
    catch (error) {
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const getTopicResources = async (req, res) => {
    try{
        const { topicId } = req.params;
        const topic = await Topic.findOne({_id: topicId,user: req.user._id});

        if(!topic){
            return res.status(404).json({
                message: "Topic not found."});
        }

        const resources = await Resource.find({
            topic: topicId,
            isArchived: false,
            user: req.user._id,
            isDeleted: false
        }).sort({ createdAt: -1 });

        return res.status(200).json({resources});
    }
    catch (error) {
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const updateResource = async (req, res) => {
    try{
        const { resourceId } = req.params;
        const {
            title,
            description,
            favorite,
            isPinned,
            isArchived
        } = req.body;

        const resource = await Resource.findOne({_id: resourceId,user: req.user._id});

        if(!resource){
            return res.status(404).json({
                message: "Resource not found"});
        }
        if (title?.trim()){
            const existingResource = await Resource.findOne({
            title: title.trim(),
            collection: resource.collection,
            topic: resource.topic,
            user: req.user._id});
            if(existingResource &&existingResource._id.toString() !== resourceId){
                return res.status(409).json({
                    message: "Resource already exists"});
            }
        }
        if(title?.trim()){
            resource.title = title.trim();
        }

        if(description !== undefined){
            resource.description = description;
        }

        if(favorite !== undefined){
            resource.favorite = favorite;
        }

        if(isPinned !== undefined){
            resource.isPinned = isPinned;
        }

        if(isArchived !== undefined){
            resource.isArchived = isArchived;
        }
        await resource.save();

        return res.status(200).json({
            message: "Resource successfully updated",resource});

    }
    catch (error) {
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const deleteResource = async (req, res) => {
    try{
        const { resourceId } = req.params;
        const resource = await Resource.findOne({
            _id: resourceId,
            user: req.user._id,
            isDeleted: false});

        if(!resource){
            return res.status(404).json({message: "Resource not found"});
        }
        resource.isDeleted = true;
        resource.deletedAt = new Date();
        await resource.save();
        return res.status(200).json({
            message: "Resource moved to trash"});

    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const restoreResource = async (req, res) => {
    try{
        const { resourceId } = req.params;
        const resource = await Resource.findOne({
            _id: resourceId,
            user: req.user._id,
            isDeleted: true});

        if(!resource){
            return res.status(404).json({
                message: "Resource not found in trash"});
        }

        resource.isDeleted = false;
        resource.deletedAt = null;

        await resource.save();

        return res.status(200).json({
            message: "Resource restored successfully",resource});
    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const deleteResourcePermanently = async (req, res) => {
    try{
        const { resourceId } = req.params;
        const resource = await Resource.findOne({
            _id: resourceId,
            user: req.user._id,
            isDeleted: true});

        if(!resource){
            return res.status(404).json({
                message: "Resource not found in trash"});
        }

        if (resource.resourceType === "file" && resource.publicId) {
                

            await deleteFromCloudinary(resource.publicId, resource.cloudinaryResourceType);
        }
        await Resource.findByIdAndDelete(resourceId);
        return res.status(200).json({
            message: "Resource deleted permanently"});

    }
    catch(error){
        return res.status(500).json({
            message: "Server Error",error: error.message});
    }
};

const moveResource = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const { targetCollectionId, targetTopicId } = req.body;

        if (!targetCollectionId) {
            return res.status(400).json({ message: "targetCollectionId is required" });
        }

        const resource = await Resource.findOne({ _id: resourceId, user: req.user._id, isDeleted: false });
        if (!resource) return res.status(404).json({ message: "Resource not found" });

        const targetCollection = await Collection.findOne({ _id: targetCollectionId, user: req.user._id, isDeleted: false });
        if (!targetCollection) return res.status(404).json({ message: "Target collection not found" });

        if (targetTopicId) {
            const targetTopic = await Topic.findOne({ _id: targetTopicId, user: req.user._id, isDeleted: false });
            if (!targetTopic) return res.status(404).json({ message: "Target topic not found" });
        }

        const duplicateQuery = {
            collection: targetCollectionId,
            topic: targetTopicId || null,
            user: req.user._id,
            isDeleted: false,
            _id: { $ne: resourceId }
        };
        if (resource.resourceType === "file") duplicateQuery.fileName = resource.fileName;
        else duplicateQuery.linkUrl = resource.linkUrl;

        const existing = await Resource.findOne(duplicateQuery);
        if (existing) return res.status(409).json({ message: "A resource like this already exists there" });

        resource.collection = targetCollectionId;
        resource.topic = targetTopicId || null;
        await resource.save();

        return res.status(200).json({ message: "Resource moved successfully", resource });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};


const duplicateResource = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const { targetCollectionId, targetTopicId } = req.body;

        if (!targetCollectionId) {
            return res.status(400).json({ message: "targetCollectionId is required" });
        }

        const resource = await Resource.findOne({ _id: resourceId, user: req.user._id, isDeleted: false });
        if (!resource) return res.status(404).json({ message: "Resource not found" });

        const targetCollection = await Collection.findOne({ _id: targetCollectionId, user: req.user._id, isDeleted: false });
        if (!targetCollection) return res.status(404).json({ message: "Target collection not found" });

        const copy = await Resource.create({
            title: `${resource.title} (copy)`,
            description: resource.description,
            resourceType: resource.resourceType,
            subType: resource.subType,
            language: resource.language,
            linkUrl: resource.linkUrl,
            fileName: resource.fileName,
            fileUrl: resource.fileUrl,
            fileSize: resource.fileSize,
            mimeType: resource.mimeType,
            fileExtension: resource.fileExtension,
            publicId: resource.publicId,
            cloudinaryResourceType: resource.cloudinaryResourceType,
            collection: targetCollectionId,
            topic: targetTopicId || null,
            user: req.user._id
        });

        return res.status(201).json({ message: "Resource duplicated successfully", resource: copy });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export {
    createCollectionResource,getCollectionResources,createTopicResource,getTopicResources,updateResource,deleteResource,restoreResource,deleteResourcePermanently,
    moveResource, duplicateResource
};