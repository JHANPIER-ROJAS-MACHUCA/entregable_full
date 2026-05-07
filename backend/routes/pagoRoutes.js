import { Router } from "express";
import {
  crearPago,
  subirComprobante,
  listarPagos,
  confirmarPago
} from "../controllers/pagoController.js";

import { upload } from "../config/multer.js";

const router = Router();

router.post("/", crearPago);
router.post("/comprobante", upload.single("file"), subirComprobante);
router.get("/", listarPagos);
router.post("/confirmar", confirmarPago);

export default router;