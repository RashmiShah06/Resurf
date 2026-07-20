import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";

import {createCollection,deleteCollection,deleteCollectionPermanently,getCollections,restoreCollection,updateCollection,toggleCollectionFavorite,toggleCollectionPinned} from "../controllers/collection.controller.js";

import{createTopic,getRootTopics} from "../controllers/topic.controller.js";

const router = Router();

router.post("/", verifyJWT, createCollection);
router.get("/", verifyJWT, getCollections);
router.put("/:collectionId", verifyJWT, updateCollection);
router.delete("/:collectionId", verifyJWT, deleteCollection);
router.patch("/:collectionId/restore", verifyJWT, restoreCollection)
router.patch("/:collectionId/favorite", verifyJWT, toggleCollectionFavorite);
router.patch("/:collectionId/pin", verifyJWT, toggleCollectionPinned);
router.delete("/:collectionId/permanent", verifyJWT, deleteCollectionPermanently);
router.post("/:collectionId/topics", verifyJWT, createTopic);
router.get("/:collectionId/topics", verifyJWT, getRootTopics);

export default router;