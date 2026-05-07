import { useState } from "react";
import { api } from "../services/api";

export default function QRPago({ total, carrito, cliente }) {

  const [codigo, setCodigo] = useState("");
  const [ventaId, setVentaId] = useState(null);

  const generarVenta = async () => {

    if (!cliente) {
      alert("❌ Debes ingresar datos del cliente");
      return;
    }

    const codigoPago = "YAPE-" + Date.now();

    const res = await api.post("/ventas/crear", {
      cliente,
      carrito,
      total,
      codigo_pago: codigoPago
    });

    setCodigo(codigoPago);
    setVentaId(res.data.idVenta);
  };

  return (
    <div style={{
      textAlign: "center",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px"
    }}>

      <h2>💳 Pago con Yape</h2>

      <h3>Total: S/. {total}</h3>

      {/* 🟣 TU QR FIJO */}
      <img
        src="/qr-yape.png"
        alt="QR Yape"
        width="250"
        style={{ margin: "10px 0" }}
      />

      <p>Escanea este QR con Yape</p>

      <button
        onClick={generarVenta}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "8px"
        }}
      >
        YA PAGUÉ
      </button>

      {codigo && (
        <div style={{ marginTop: "15px" }}>
          <p>🧾 Código de pago:</p>
          <h3>{codigo}</h3>
        </div>
      )}

    </div>
  );
}