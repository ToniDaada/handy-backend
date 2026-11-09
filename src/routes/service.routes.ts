import { Router } from "express";

import { createService, deleteService, listServices, updateService } from "../controllers/service.controller.js";
import { requireApiKey } from "../middleware/apiKey.js";

const router = Router({ mergeParams: true });

router.get("/", listServices);
router.post("/", requireApiKey, createService);
router.patch("/:serviceId", requireApiKey, updateService);
router.delete("/:serviceId", requireApiKey, deleteService);

export default router;
