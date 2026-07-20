import { Topic } from "../models/topic.model.js";
import { Resource } from "../models/resource.model.js";

export const moveTopicToTrash = async (topicId, userId) => {
    const topic = await Topic.findOne({
        _id: topicId,
        user: userId,
        isDeleted: false});

    if(!topic){
        return;
    }

    // Move all resources inside this topic to trash
    await Resource.updateMany({
            topic: topicId,
            user: userId,
            isDeleted: false
        },
        {
            isDeleted: true,
            deletedAt: new Date()
        }
    );

    // Find child topics
    const childTopics = await Topic.find({
        parentTopic: topicId,
        user: userId,
        isDeleted: false
    });

    // Move every child topic recursively
    for(const child of childTopics){
        await moveTopicToTrash(child._id, userId);
    }

    // Move current topic to trash
    topic.isDeleted = true;
    topic.deletedAt = new Date();

    await topic.save();
};

export const restoreTopicFromTrash = async (topicId, userId) => {
    const topic = await Topic.findOne({
        _id: topicId,
        user: userId,
        isDeleted: true});
    if(!topic){
        return;
    }

    // Restore current topic
    topic.isDeleted = false;
    topic.deletedAt = null;

    await topic.save();

    // Restore resources
    await Resource.updateMany({
            topic: topicId,
            user: userId,
            isDeleted: true
        },
        {
            isDeleted: false,
            deletedAt: null
        }
    );

    // Restore children
    const childTopics = await Topic.find({
        parentTopic: topicId,
        user: userId,
        isDeleted: true});

    for(const child of childTopics){
        await restoreTopicFromTrash(child._id, userId);
    }

};

export const deleteTopicForever = async (topicId, userId) => {
    await Resource.deleteMany({
        topic: topicId,user: userId});
    // Find child topics
    const childTopics = await Topic.find({
        parentTopic: topicId,user: userId});
    // Delete children recursively
    for(const child of childTopics){
        await deleteTopicForever(child._id, userId);}
    // Delete current topic
    await Topic.findByIdAndDelete(topicId);
};