import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

import productoRoutes from "./routes/productoRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 SUPABASE
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🔥 RUTAS
app.use("/productos", productoRoutes);
app.use("/ventas", ventaRoutes);
app.use("/clientes", clienteRoutes);

// 🔥 TEST
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase.from("productos").select("*");

  if (error) return res.status(500).json(error);

  res.json(data);
});

// 🔥 PORT CORRECTO PARA RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
