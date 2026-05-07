import { db } from "../config/db.js";

export const getProductos = async (req, res) => {
  try {

    const result = await db.query(`
      SELECT * FROM producto
      ORDER BY id_producto DESC
    `);

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });
  }
};

export const getProductoById = async (req, res) => {
  try {

    const result = await db.query(
      "SELECT * FROM producto WHERE id_producto = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });
  }
};