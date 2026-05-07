import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const obtenerDashboard = async (req, res) => {
  try {
    // ventas pagadas
    const { data: ventas, error: e1 } = await supabase
      .from("ventas")
      .select("*")
      .eq("estado", "pagado");

    if (e1) throw e1;

    // ingresos total
    const total_ingresos = ventas.reduce(
      (acc, v) => acc + Number(v.total),
      0
    );

    // pendientes
    const { data: pendientesData, error: e2 } = await supabase
      .from("ventas")
      .select("*")
      .eq("estado", "pendiente");

    if (e2) throw e2;

    // detalle productos vendidos
    const { data: detalles, error: e3 } = await supabase
      .from("detalle_venta")
      .select("cantidad");

    if (e3) throw e3;

    const total_productos = detalles.reduce(
      (acc, d) => acc + Number(d.cantidad),
      0
    );

    // ventas recientes
    const { data: recientes, error: e4 } = await supabase
      .from("ventas")
      .select("id_venta,total,fecha")
      .order("id_venta", { ascending: false })
      .limit(5);

    if (e4) throw e4;

    res.json({
      total_ventas: ventas.length,
      total_ingresos,
      total_productos,
      pagos_pendientes: pendientesData.length,
      ventas_recientes: recientes,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};