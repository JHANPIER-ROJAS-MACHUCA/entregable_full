import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

import productoRoutes from "./routes/productoRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// 🔥 VALIDACIÓN DE VARIABLES DE ENTORNO (IMPORTANTE)
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Faltan variables de entorno de Supabase");
}

// 🔥 SUPABASE CLIENT
=======
// 🔥 SUPABASE
>>>>>>> 7bf9fa9 (fix backend server)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🔥 RUTAS
app.use("/productos", productoRoutes);
app.use("/ventas", ventaRoutes);
app.use("/clientes", clienteRoutes);

<<<<<<< HEAD
// 🔥 RUTA BASE
=======
// 🔥 TEST
>>>>>>> 7bf9fa9 (fix backend server)
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

<<<<<<< HEAD
// 🔥 TEST CONEXIÓN A SUPABASE
app.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*");

    if (error) {
      return res.status(500).json({
        message: "Error en Supabase",
        error,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Error del servidor",
      error: err.message,
    });
  }
});

// 🔥 PORT PARA RENDER (OBLIGATORIO)
=======
app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase.from("productos").select("*");

  if (error) return res.status(500).json(error);

  res.json(data);
});

// 🔥 PORT CORRECTO PARA RENDER
>>>>>>> 7bf9fa9 (fix backend server)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> 7bf9fa9 (fix backend server)
