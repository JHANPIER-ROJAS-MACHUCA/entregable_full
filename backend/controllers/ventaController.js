import { db } from "../config/db.js";

export const crearVenta = (req, res) => {
  const { cliente, carrito, total } = req.body;

  if (!cliente || !carrito || carrito.length === 0) {
    return res.status(400).json({ msg: "Datos inválidos" });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    db.query(
      `INSERT INTO ventas (id_cliente, total, estado, metodo_pago)
       VALUES (?, ?, 'pagado', 'YAPE')`,
      [cliente, total],
      (err, result) => {

        if (err) {
          return db.rollback(() => res.status(500).json(err));
        }

        const idVenta = result.insertId;
        let completados = 0;

        carrito.forEach((p) => {

          db.query(
            "SELECT stock FROM producto WHERE id_producto = ?",
            [p.id_producto],
            (err, rows) => {

              if (err) {
                return db.rollback(() => res.status(500).json(err));
              }

              if (!rows.length || rows[0].stock < p.cantidad) {
                return db.rollback(() =>
                  res.status(400).json({ msg: "Stock insuficiente" })
                );
              }

              db.query(
                `INSERT INTO detalle_venta 
                (id_venta, id_producto, cantidad, precio_unitario, subtotal)
                VALUES (?, ?, ?, ?, ?)`,
                [idVenta, p.id_producto, p.cantidad, p.precio, p.subtotal],
                (err) => {

                  if (err) {
                    return db.rollback(() => res.status(500).json(err));
                  }

                  db.query(
                    "UPDATE producto SET stock = stock - ? WHERE id_producto = ?",
                    [p.cantidad, p.id_producto],
                    (err) => {

                      if (err) {
                        return db.rollback(() => res.status(500).json(err));
                      }

                      completados++;

                      if (completados === carrito.length) {

                        db.commit((err) => {
                          if (err) {
                            return db.rollback(() => res.status(500).json(err));
                          }

                          res.json({
                            msg: "✅ Compra realizada",
                            idVenta
                          });
                        });

                      }

                    }
                  );

                }
              );

            }
          );

        });

      }
    );

  });
};