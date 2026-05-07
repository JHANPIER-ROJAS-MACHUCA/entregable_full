import express from "express";
import cors from "cors";

import productoRoutes from "./routes/productoRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";

const app = express();

// 🔥 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 🔥 RUTAS PRINCIPALES
app.use("/productos", productoRoutes);
app.use("/ventas", ventaRoutes);
app.use("/clientes", clienteRoutes);

// 🔥 TEST RUTA
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});