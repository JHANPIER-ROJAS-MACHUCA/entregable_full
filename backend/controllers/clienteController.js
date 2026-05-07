import { db } from "../config/db.js";

export const crearCliente = (req, res) => {
  const { nombres, telefono } = req.body;

  const sql = `
    INSERT INTO clientes (nombres, telefono)
    VALUES (?, ?)
  `;

  db.query(sql, [nombres, telefono], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json({ id_cliente: result.insertId });
  });
};