import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🔥 GENERAR CÓDIGO
const generarCodigo = () => {
  return "PAY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
};


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


export const subirComprobante = async (req, res) => {
  const { codigo } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No se envió archivo" });
  }

  const file = req.file.filename;

  const { error } = await supabase
    .from("pagos")
    .update({ comprobante: file })
    .eq("codigo", codigo);

  if (error) return res.status(500).json(error);

  res.json({ ok: true });
};


export const listarPagos = async (req, res) => {
  const { data, error } = await supabase
    .from("pagos")
    .select("*")
    .eq("estado", "pendiente");

  if (error) return res.status(500).json(error);

  res.json(data);
};


export const confirmarPago = async (req, res) => {
  const { codigo, carrito } = req.body;

  try {
    // 1. obtener pago
    const { data: pago, error: errorPago } = await supabase
      .from("pagos")
      .select("*")
      .eq("codigo", codigo)
      .eq("estado", "pendiente")
      .single();

    if (errorPago || !pago) {
      return res.status(400).json({ error: "Pago inválido" });
    }

    const total = pago.total;

    // 2. crear venta
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

    // 🔥 ID seguro (evita undefined)
    const idVenta = venta.id_venta || venta.id;

    // 3. detalle de venta
    for (const item of carrito) {
      const { error: errorDetalle } = await supabase
        .from("detalle_venta")
        .insert([
          {
            id_venta: idVenta,
            id_producto: item.id_producto,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
            subtotal: item.subtotal,
          },
        ]);

      if (errorDetalle) console.log(errorDetalle);

      // 4. actualizar stock
      const { data: producto } = await supabase
        .from("producto")
        .select("stock")
        .eq("id_producto", item.id_producto)
        .single();

      if (producto) {
        await supabase
          .from("producto")
          .update({
            stock: producto.stock - item.cantidad,
          })
          .eq("id_producto", item.id_producto);
      }
    }

    // 5. actualizar pago
    await supabase
      .from("pagos")
      .update({ estado: "pagado" })
      .eq("codigo", codigo);

    res.json({ ok: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};