import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { search } from "../controllers/search.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/", search);

export default router;