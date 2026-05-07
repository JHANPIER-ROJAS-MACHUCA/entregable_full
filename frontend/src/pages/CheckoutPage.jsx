import { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { api } from "../services/api";
import Swal from "sweetalert2"; // 🔥 IMPORTANTE

export default function CheckoutPage() {

  const { carrito, limpiarCarrito } = useContext(CarritoContext);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const total = carrito.reduce((acc, p) => acc + p.subtotal, 0);

  // 🔥 VALIDACIÓN
  const validar = () => {
    let err = {};

    if (!nombre.trim()) {
      err.nombre = "⚠️ Ingrese su nombre";
    }

    if (!telefono.trim()) {
      err.telefono = "⚠️ Ingrese su teléfono";
    }

    if (carrito.length === 0) {
      err.carrito = "⚠️ El carrito está vacío";
    }

    setErrores(err);

    return Object.keys(err).length === 0;
  };

  const comprar = async () => {

    if (!validar()) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Por favor completa todos los campos",
      });
      return;
    }

    try {
      setCargando(true);

      // 🚨 NO TOCAMOS ESTO (para no romper tu backend)
      await api.post("/ventas", {
        cliente: 1,
        carrito,
        total
      });

      // ✅ ALERTA BONITA (sin romper lógica)
      Swal.fire({
        icon: "success",
        title: "¡Compra confirmada! 🛒",
        text: "Tu compra se realizó correctamente",
        confirmButtonColor: "#28a745",
      });

      limpiarCarrito();

    } catch (error) {
      console.log(error.response?.data || error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo procesar la compra",
      });

    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mt-4">

      <h2>💳 Checkout</h2>

      {/* 🛒 PRODUCTOS */}
      <div className="card p-3 mb-3">

        <h4>Productos</h4>

        {carrito.length === 0 && (
          <p className="text-danger">{errores.carrito}</p>
        )}

        {carrito.map((p) => (
          <div key={p.id_producto} className="d-flex align-items-center mb-2 border-bottom pb-2">

            <img
              src={p.imagen}
              alt={p.nombre}
              style={{ width: 60, height: 60, objectFit: "cover", marginRight: 10 }}
            />

            <div className="flex-grow-1">
              <strong>{p.nombre}</strong>
              <br />
              Cantidad: {p.cantidad}
            </div>

            <div>
              S/. {p.subtotal.toFixed(2)}
            </div>

          </div>
        ))}

        <h4 className="text-end mt-2">
          Total: S/. {total.toFixed(2)}
        </h4>

      </div>

      {/* 👤 DATOS */}
      <div className="card p-3">

        <h4>Datos del cliente</h4>

        {/* NOMBRE */}
        <input
          className={`form-control mb-1 ${errores.nombre ? "is-invalid" : ""}`}
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        {errores.nombre && (
          <div className="text-danger mb-2">{errores.nombre}</div>
        )}

        {/* TELÉFONO */}
        <input
          className={`form-control mb-1 ${errores.telefono ? "is-invalid" : ""}`}
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        {errores.telefono && (
          <div className="text-danger mb-2">{errores.telefono}</div>
        )}

        {/* BOTÓN */}
        <button
          className="btn btn-success w-100 mt-2"
          onClick={comprar}
          disabled={cargando}
        >
          {cargando ? "Procesando..." : "Confirmar compra"}
        </button>

      </div>

    </div>
  );
}