import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AdminDashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then(res => setData(res.data));
  }, []);

  if (!data) return <p>Cargando...</p>;

  return (
    <div className="container mt-4">

      <h2 className="mb-4">📊 Dashboard Admin</h2>

      {/* 🔥 CARDS */}
      <div className="row">

        <div className="col-md-3">
          <div className="card p-3 text-center shadow">
            <h5>Ventas</h5>
            <h3>{data.total_ventas}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow">
            <h5>Ingresos</h5>
            <h3>S/. {data.total_ingresos}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow">
            <h5>Productos vendidos</h5>
            <h3>{data.total_productos}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow">
            <h5>Pagos pendientes</h5>
            <h3>{data.pagos_pendientes}</h3>
          </div>
        </div>

      </div>

      {/* 🔥 TABLA */}
      <div className="mt-5">
        <h4>🧾 Ventas recientes</h4>

        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Total</th>
              <th>Fecha</th>
            </tr>
          </thead>

          <tbody>
            {data.ventas_recientes.map(v => (
              <tr key={v.id_venta}>
                <td>{v.id_venta}</td>
                <td>S/. {v.total}</td>
                <td>{new Date(v.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}