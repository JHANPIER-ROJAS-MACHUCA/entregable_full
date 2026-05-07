import express from "express";
import { getProductos, getProductoById } from "../controllers/productoController.js";

const router = express.Router();

router.get("/", getProductos);
router.get("/:id", getProductoById);

export default router;