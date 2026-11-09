import { Router } from "express";

import providerRoutes from "./provider.routes.js";

const router = Router();

router.get("/api", (_req, res) => {
  res.json({ message: "SERVERS ARE LIVE!!!" });
});

router.use("/api/providers", providerRoutes);

export default router;
