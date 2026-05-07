import { Router } from "express";
import { obtenerDashboard } from "../controllers/dashboardController.js";

const router = Router();

router.get("/", obtenerDashboard);

export default router;