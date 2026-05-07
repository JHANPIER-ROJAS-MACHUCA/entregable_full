import { useState, useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { api } from "../services/api";

export default function PagoPage() {

  const { carrito, limpiarCarrito } = useContext(CarritoContext);

  const [cliente, setCliente] = useState("");
  const [file, setFile] = useState(null);
  const [codigo, setCodigo] = useState("");

  const total = carrito.reduce((a, b) => a + b.subtotal, 0);

  const generarCodigo = () => {
    setCodigo("YAPE-" + Date.now());
  };

  const pagar = async () => {

    // 🚨 VALIDACIONES FRONT
    if (!cliente) return alert("Ingresa cliente");
    if (!file) return alert("Sube comprobante");
    if (!codigo) return alert("Genera código de pago");

    const formData = new FormData();

    formData.append("cliente", cliente);
    formData.append("carrito", JSON.stringify(carrito));
    formData.append("total", total);
    formData.append("codigo_pago", codigo);
    formData.append("comprobante", file);

    try {
      const res = await api.post("/ventas/crear", formData);

      alert(res.data.msg);

      limpiarCarrito();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">

      <h2>💳 Pago Yape</h2>

      <input
        placeholder="Nombre cliente"
        onChange={(e) => setCliente(e.target.value)}
      />

      <h3>Total: S/. {total}</h3>

      <button onClick={generarCodigo}>
        Generar código de pago
      </button>

      {codigo && <p>📌 {codigo}</p>}

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={pagar}>
        Confirmar pago
      </button>

    </div>
  );
}