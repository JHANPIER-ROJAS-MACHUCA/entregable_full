import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { CarritoContext } from "../context/CarritoContext";

export default function ProductoDetalle() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarProducto } = useContext(CarritoContext);

  const [producto, setProducto] = useState(null);

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then(res => setProducto(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!producto) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-4">

      <div className="row">

        {/* 🖼 IMAGEN */}
        <div className="col-md-6 text-center">
          <img
            src={producto.imagen}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>

        {/* 📦 INFO */}
        <div className="col-md-6">

          <h2>{producto.nombre}</h2>

          <h3 className="text-success mb-3">
            S/. {producto.precio}
          </h3>

          <p className="text-muted">
            {producto.detalle || "Sin descripción"}
          </p>

          {/* 🛒 BOTONES */}
          <button
            className="btn btn-primary w-100 mb-2"
            onClick={() => {
              agregarProducto(producto);
              navigate("/carrito");
            }}
          >
            🛒 Agregar al carrito
          </button>

          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/")}
          >
            ← Seguir comprando
          </button>

        </div>

      </div>

    </div>
  );
}