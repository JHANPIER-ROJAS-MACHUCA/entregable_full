import { db } from "../config/db.js";
const generarCodigo = () => {
  return "PAY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 🔹 Crear pago
export const crearPago = async (req, res) => {
  const { nombre, telefono, total } = req.body;

  const codigo = generarCodigo();

  await pool.query(
    `INSERT INTO pagos (codigo, nombre_cliente, telefono, total) 
     VALUES (?, ?, ?, ?)`,
    [codigo, nombre, telefono, total]
  );

  res.json({ codigo });
};

// 🔹 Subir comprobante
export const subirComprobante = async (req, res) => {
  const { codigo } = req.body;

  const file = req.file.filename;

  await pool.query(
    "UPDATE pagos SET comprobante=? WHERE codigo=?",
    [file, codigo]
  );

  res.json({ ok: true });
};

// 🔹 Listar pagos admin
export const listarPagos = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM pagos WHERE estado='pendiente'");
  res.json(rows);
};

// 🔥 Confirmar pago (ADMIN)
export const confirmarPago = async (req, res) => {
  const { codigo, carrito } = req.body;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [pago] = await conn.query(
      "SELECT * FROM pagos WHERE codigo=? AND estado='pendiente'",
      [codigo]
    );

    if (pago.length === 0) throw new Error("Pago inválido");

    const { total } = pago[0];

    // Crear venta
    const [venta] = await conn.query(
      "INSERT INTO ventas (total, estado, metodo_pago) VALUES (?, 'pagado', 'YAPE')",
      [total]
    );

    const idVenta = venta.insertId;

    for (const item of carrito) {
      await conn.query(
        `INSERT INTO detalle_venta 
        (id_venta, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)`,
        [idVenta, item.id_producto, item.cantidad, item.precio, item.subtotal]
      );

      await conn.query(
        "UPDATE producto SET stock = stock - ? WHERE id_producto = ?",
        [item.cantidad, item.id_producto]
      );
    }

    await conn.query(
      "UPDATE pagos SET estado='pagado' WHERE codigo=?",
      [codigo]
    );

    await conn.commit();

    res.json({ ok: true });

  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
};