import { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CarritoPage() {
  const { carrito, eliminarProducto, actualizarCantidad } = useContext(CarritoContext);
  const navigate = useNavigate();

  const total = carrito.reduce((acc, item) => acc + Number(item.subtotal), 0);

  const formato = (num) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN"
    }).format(num);

  return (
    <div className="mt-4">
      <h2 className="mb-4">🛒 Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <div className="text-center">
          <h4>Tu carrito está vacío</h4>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
            Ir a comprar
          </button>
        </div>
      ) : (
        <>
          {carrito.map(item => (
            <motion.div
              key={item.id_producto}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card mb-3 p-3 d-flex flex-row align-items-center shadow-sm carrito-item"
            >
              {/* 🖼 Imagen */}
              <img
                src={item.imagen || "https://via.placeholder.com/80"}
                width="80"
                className="me-3 rounded"
              />

              {/* 📦 Info */}
              <div className="flex-grow-1">
                <h5>{item.nombre}</h5>
                <p className="text-muted small">{item.detalle}</p>
                <p className="fw-bold">{formato(item.subtotal)}</p>
              </div>

              {/* ➕➖ CONTROLES */}
              <div className="d-flex align-items-center gap-2">

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => actualizarCantidad(item.id_producto, item.cantidad - 1)}
                >
                  ➖
                </button>

                <span className="fw-bold">{item.cantidad}</span>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => actualizarCantidad(item.id_producto, item.cantidad + 1)}
                >
                  ➕
                </button>

              </div>

              {/* ❌ ELIMINAR */}
              <button
                className="btn btn-danger ms-3"
                onClick={() => eliminarProducto(item.id_producto)}
              >
                ✕
              </button>

            </motion.div>
          ))}

          {/* 💰 TOTAL */}
          <div className="card p-3 shadow mt-4">
            <h3>Total: {formato(total)}</h3>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-success"
                onClick={() => navigate("/checkout")}
              >
                💳 Comprar
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => navigate("/")}
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}