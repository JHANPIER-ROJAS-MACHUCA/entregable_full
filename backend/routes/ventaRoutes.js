import express from "express";
import { crearVenta } from "../controllers/ventaController.js";

const router = express.Router();

router.post("/", crearVenta);

export default router;