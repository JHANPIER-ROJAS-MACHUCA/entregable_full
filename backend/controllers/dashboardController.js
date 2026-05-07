import { db } from "../config/db.js";

export const obtenerDashboard = async (req, res) => {
  try {

    const [[ventas]] = await db.query(
      "SELECT COUNT(*) as total_ventas FROM ventas WHERE estado='pagado'"
    );

    const [[ingresos]] = await db.query(
      "SELECT IFNULL(SUM(total),0) as total_ingresos FROM ventas WHERE estado='pagado'"
    );

    const [[productos]] = await db.query(
      "SELECT IFNULL(SUM(cantidad),0) as total_productos FROM detalle_venta"
    );

    const [[pendientes]] = await db.query(
      "SELECT COUNT(*) as pendientes FROM ventas WHERE estado='pendiente'"
    );

    const [recientes] = await db.query(`
      SELECT v.id_venta, v.total, v.fecha
      FROM ventas v
      ORDER BY v.id_venta DESC
      LIMIT 5
    `);

    res.json({
      total_ventas: ventas.total_ventas,
      total_ingresos: ingresos.total_ingresos,
      total_productos: productos.total_productos,
      pagos_pendientes: pendientes.pendientes,
      ventas_recientes: recientes
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};