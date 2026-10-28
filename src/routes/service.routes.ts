import { Router } from "express";

import { createService, deleteService, getService, listServices, updateService } from "../controllers/service.controller.js";
import { requireApiKey } from "../middleware/apiKey.js";

const router = Router();

router.get("/", listServices);
router.get("/:id", getService);
router.post("/", requireApiKey, createService);
router.patch("/:id", requireApiKey, updateService);
router.delete("/:id", requireApiKey, deleteService);

export default router;
