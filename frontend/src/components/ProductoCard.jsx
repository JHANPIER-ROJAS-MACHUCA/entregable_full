import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProductoCard({ producto, addToCart }) {
  const navigate = useNavigate();

  const handleAgregar = (e) => {
    e.stopPropagation(); // 🚨 IMPORTANTE: evita que dispare el click de la card

    Swal.fire({
      title: producto.nombre,
      text: "¿Deseas agregar este producto al carrito?",
      imageUrl: producto.imagen || "https://via.placeholder.com/200",
      imageWidth: 200,
      imageHeight: 200,
      showCancelButton: true,
      confirmButtonText: "Sí, agregar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
    }).then((result) => {
      if (result.isConfirmed) {
        addToCart(producto);

        Swal.fire({
          title: "Producto agregado 🛒",
          text: "¿Qué deseas hacer?",
          showCancelButton: true,
          confirmButtonText: "Ir al carrito",
          cancelButtonText: "Seguir comprando",
        }).then((res) => {
          if (res.isConfirmed) {
            navigate("/carrito");
          }
        });
      }
    });
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      {/* 👇 CLICK GLOBAL */}
      <div
        className="card producto-card shadow-sm h-100"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/producto/${producto.id_producto}`)}
      >

        <img
          src={producto.imagen || "https://via.placeholder.com/300"}
          className="card-img-top producto-img"
          style={{ height: "200px", objectFit: "cover" }}
        />

        <div className="card-body d-flex flex-column">

          <h5 className="fw-bold">{producto.nombre}</h5>

          <p className="text-muted small">
            {producto.descripcion?.substring(0, 60) || "Sin descripción"}...
          </p>

          <h6 className="text-success fw-bold">
            S/. {producto.precio}
          </h6>

          <button
            className="btn btn-primary w-100 mt-auto btn-custom"
            onClick={handleAgregar}
          >
            🛒 Agregar al carrito
          </button>

        </div>
      </div>
    </motion.div>
  );
}