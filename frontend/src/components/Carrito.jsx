import React from "react";

const Carrito = ({ carrito, setCarrito }) => {

  const aumentarCantidad = (id) => {
    const nuevo = carrito.map(p =>
      p.id_producto === id
        ? { ...p, cantidad: p.cantidad + 1 }
        : p
    );
    setCarrito(nuevo);
  };

  const disminuirCantidad = (id) => {
    const nuevo = carrito.map(p =>
      p.id_producto === id && p.cantidad > 1
        ? { ...p, cantidad: p.cantidad - 1 }
        : p
    );
    setCarrito(nuevo);
  };

  const eliminarProducto = (id) => {
    const nuevo = carrito.filter(p => p.id_producto !== id);
    setCarrito(nuevo);
  };

  const total = carrito.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛒 Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <div className="alert alert-info">El carrito está vacío</div>
      ) : (
        <div className="row">
          
          {/* LISTA PRODUCTOS */}
          <div className="col-md-8">
            {carrito.map((p) => (
              <div key={p.id_producto} className="card mb-3 shadow-sm">
                <div className="row g-0 align-items-center">

                  <div className="col-md-3 text-center">
                    <img
                      src={p.imagen}
                      alt={p.descripcion}
                      className="img-fluid rounded p-2"
                      style={{ maxHeight: "120px" }}
                    />
                  </div>

                  <div className="col-md-5">
                    <div className="card-body">
                      <h5>{p.descripcion}</h5>
                      <p className="text-muted">
                        Precio: S/ {p.precio}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-2 text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => disminuirCantidad(p.id_producto)}
                      >
                        -
                      </button>

                      <span className="mx-2">{p.cantidad}</span>

                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => aumentarCantidad(p.id_producto)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-md-2 text-center">
                    <p className="fw-bold">
                      S/ {p.precio * p.cantidad}
                    </p>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarProducto(p.id_producto)}
                    >
                      ❌
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* RESUMEN */}
          <div className="col-md-4">
            <div className="card shadow p-3">
              <h4>Resumen</h4>
              <hr />

              <p>
                Total: <strong>S/ {total}</strong>
              </p>

              <button className="btn btn-success w-100">
                Finalizar Compra
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Carrito;