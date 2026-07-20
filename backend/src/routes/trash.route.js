import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getTrash } from "../controllers/trash.controller.js";

const router = Router();

router.get("/", verifyJWT, getTrash);

export default router;