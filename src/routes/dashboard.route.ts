import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { getDashboardStats } from "../controllers/dashboard.controller";

const router = Router();
//get user videos
router.use(authenticate);
router.route("/stats").get(getDashboardStats);

export default router;
