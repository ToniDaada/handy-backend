import { Router } from "express";

const router = Router();

router.get("/api", (_req, res) => {
  res.json({ message: "SERVERS ARE LIVE!!!" });
});

export default router;
