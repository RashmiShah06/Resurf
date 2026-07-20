import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";

import {createChildTopic,getChildTopics,updateTopic,deleteTopic, restoreTopic, deleteTopicPermanently, moveTopic, duplicateTopic, toggleTopicFavorite, toggleTopicPinned} from "../controllers/topic.controller.js";

const router = Router();

router.post("/:parentTopicId/children", verifyJWT, createChildTopic);
router.get("/:parentTopicId/children", verifyJWT, getChildTopics);
router.put("/:topicId", verifyJWT, updateTopic);
router.delete("/:topicId", verifyJWT, deleteTopic);
router.patch("/:topicId/restore", verifyJWT, restoreTopic);
router.patch("/:topicId/favorite", verifyJWT, toggleTopicFavorite);
router.patch("/:topicId/pin", verifyJWT, toggleTopicPinned);
router.delete("/:topicId/permanent", verifyJWT, deleteTopicPermanently);
router.patch("/:topicId/move", verifyJWT, moveTopic);
router.post("/:topicId/duplicate", verifyJWT, duplicateTopic);

export default router;