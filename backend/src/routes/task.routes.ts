import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({ message: "Protected Task Route ✅" });
});

export default router;