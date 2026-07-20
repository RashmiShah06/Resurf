import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
    createCollectionResource,
    getCollectionResources,
    createTopicResource,
    getTopicResources,
    updateResource,
    deleteResource,
    restoreResource,
    deleteResourcePermanently,
    moveResource,
    duplicateResource
} from "../controllers/resource.controller.js";

const router = Router();

router.post("/collections/:collectionId", verifyJWT,upload.single("file"), createCollectionResource);
router.get("/collections/:collectionId", verifyJWT, getCollectionResources);
router.post("/topics/:topicId", verifyJWT,upload.single("file"), createTopicResource);
router.get("/topics/:topicId", verifyJWT, getTopicResources);
router.put("/:resourceId", verifyJWT, updateResource);
router.delete("/:resourceId", verifyJWT, deleteResource);
router.patch("/:resourceId/restore", verifyJWT, restoreResource);
router.delete("/:resourceId/permanent", verifyJWT, deleteResourcePermanently);
router.patch("/:resourceId/move", verifyJWT, moveResource);
router.post("/:resourceId/duplicate", verifyJWT, duplicateResource);

export default router;