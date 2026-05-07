import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const crearVenta = async (req, res) => {
  const { cliente, carrito, total } = req.body;

  if (!cliente || !carrito || carrito.length === 0) {
    return res.status(400).json({ msg: "Datos inválidos" });
  }

  try {
    // 1. Crear venta
    const { data: venta, error: errorVenta } = await supabase
      .from("ventas")
      .insert([
        {
          id_cliente: cliente,
          total,
          estado: "pagado",
          metodo_pago: "YAPE",
        },
      ])
      .select()
      .single();

    if (errorVenta) throw errorVenta;

    const idVenta = venta.id_venta;

    // 2. Procesar productos
    for (const p of carrito) {
      // verificar stock
      const { data: producto, error: errorProd } = await supabase
        .from("producto")
        .select("stock")
        .eq("id_producto", p.id_producto)
        .single();

      if (errorProd || !producto) {
        return res.status(400).json({ msg: "Producto no encontrado" });
      }

      if (producto.stock < p.cantidad) {
        return res.status(400).json({ msg: "Stock insuficiente" });
      }

      // detalle venta
      const { error: errorDetalle } = await supabase
        .from("detalle_venta")
        .insert([
          {
            id_venta: idVenta,
            id_producto: p.id_producto,
            cantidad: p.cantidad,
            precio_unitario: p.precio,
            subtotal: p.subtotal,
          },
        ]);

      if (errorDetalle) throw errorDetalle;

      // actualizar stock
      const { error: errorStock } = await supabase
        .from("producto")
        .update({
          stock: producto.stock - p.cantidad,
        })
        .eq("id_producto", p.id_producto);

      if (errorStock) throw errorStock;
    }

    res.json({
      msg: "✅ Compra realizada",
      idVenta,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};