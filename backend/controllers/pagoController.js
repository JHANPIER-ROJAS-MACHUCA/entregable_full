import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const generarCodigo = () => {
  return "PAY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 🔹 Crear pago
export const crearPago = async (req, res) => {
  const { nombre, telefono, total } = req.body;

  const codigo = generarCodigo();

  const { error } = await supabase.from("pagos").insert([
    {
      codigo,
      nombre_cliente: nombre,
      telefono,
      total,
      estado: "pendiente",
    },
  ]);

  if (error) return res.status(500).json(error);

  res.json({ codigo });
};

// 🔹 Subir comprobante
export const subirComprobante = async (req, res) => {
  const { codigo } = req.body;

  const file = req.file.filename;

  const { error } = await supabase
    .from("pagos")
    .update({ comprobante: file })
    .eq("codigo", codigo);

  if (error) return res.status(500).json(error);

  res.json({ ok: true });
};

// 🔹 Listar pagos admin
export const listarPagos = async (req, res) => {
  const { data, error } = await supabase
    .from("pagos")
    .select("*")
    .eq("estado", "pendiente");

  if (error) return res.status(500).json(error);

  res.json(data);
};

// 🔹 Confirmar pago (SIMPLIFICADO SIN TRANSACCIONES SQL)
export const confirmarPago = async (req, res) => {
  const { codigo, carrito } = req.body;

  try {
    // obtener pago
    const { data: pagos, error: errorPago } = await supabase
      .from("pagos")
      .select("*")
      .eq("codigo", codigo)
      .eq("estado", "pendiente")
      .single();

    if (errorPago || !pagos) {
      return res.status(400).json({ error: "Pago inválido" });
    }

    const total = pagos.total;

    // crear venta
    const { data: venta, error: errorVenta } = await supabase
      .from("ventas")
      .insert([
        {
          total,
          estado: "pagado",
          metodo_pago: "YAPE",
        },
      ])
      .select()
      .single();

    if (errorVenta) return res.status(500).json(errorVenta);

    const idVenta = venta.id_venta;

    // detalles
    for (const item of carrito) {
      await supabase.from("detalle_venta").insert([
        {
          id_venta: idVenta,
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.subtotal,
        },
      ]);

      // actualizar stock
      const { data: prod } = await supabase
        .from("producto")
        .select("stock")
        .eq("id_producto", item.id_producto)
        .single();

      await supabase
        .from("producto")
        .update({ stock: prod.stock - item.cantidad })
        .eq("id_producto", item.id_producto);
    }

    // actualizar pago
    await supabase
      .from("pagos")
      .update({ estado: "pagado" })
      .eq("codigo", codigo);

    res.json({ ok: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};