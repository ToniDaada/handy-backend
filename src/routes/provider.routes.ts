import { Router } from "express";

import { listProviders, showProvider } from "../controllers/provider.controller.js";
import serviceRoutes from "./service.routes.js";

const router = Router();

router.get("/", listProviders);
router.get("/:id", showProvider);
router.use("/:id/services", serviceRoutes);

export default router;
