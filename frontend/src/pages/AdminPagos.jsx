import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AdminPagos() {

  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    api.get("/pagos").then(res => setPagos(res.data));
  }, []);

  const confirmar = async (codigo) => {
    await api.post("/pagos/confirmar", {
      codigo,
      carrito: [] // puedes luego guardar carrito real
    });

    alert("Pago confirmado");
  };

  return (
    <div className="container mt-4">

      <h2>Pagos pendientes</h2>

      {pagos.map(p => (
        <div key={p.id_pago} className="card p-3 mb-3">

          <p><b>{p.nombre_cliente}</b></p>
          <p>Total: S/. {p.total}</p>

          <img
            src={`http://localhost:3000/uploads/${p.comprobante}`}
            width="150"
          />

          <button
            className="btn btn-success"
            onClick={() => confirmar(p.codigo)}
          >
            Confirmar pago
          </button>

        </div>
      ))}

    </div>
  );
}