import { Router } from "express";

import serviceRoutes from "./service.routes.js";

const router = Router();

router.get("/api", (_req, res) => {
  res.json({ message: "SERVERS ARE LIVE!!!" });
});

router.use("/api/services", serviceRoutes);

export default router;
