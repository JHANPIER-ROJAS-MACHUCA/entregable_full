import { createContext, useState, useEffect } from "react";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {

  const [carrito, setCarrito] = useState(() => {
    const data = localStorage.getItem("carrito");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // 🟢 AGREGAR PRODUCTO
  const agregarProducto = (producto) => {

    const existe = carrito.find(p => p.id_producto === producto.id_producto);

    if (existe) {
      const actualizado = carrito.map(p =>
        p.id_producto === producto.id_producto
          ? {
              ...p,
              cantidad: p.cantidad + 1,
              subtotal: (p.cantidad + 1) * p.precio
            }
          : p
      );
      setCarrito(actualizado);

    } else {
      setCarrito([
        ...carrito,
        {
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: Number(producto.precio),
          imagen: producto.imagen,
          cantidad: 1,
          subtotal: Number(producto.precio) // 🔥 IMPORTANTE
        }
      ]);
    }
  };

  // 🔴 ELIMINAR
  const eliminarProducto = (id) => {
    setCarrito(carrito.filter(p => p.id_producto !== id));
  };

  // 🔄 ACTUALIZAR
  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) return;

    const actualizado = carrito.map(p =>
      p.id_producto === id
        ? {
            ...p,
            cantidad,
            subtotal: cantidad * p.precio
          }
        : p
    );

    setCarrito(actualizado);
  };

  // 🧹 LIMPIAR
  const limpiarCarrito = () => setCarrito([]);

  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarProducto,
      eliminarProducto,
      actualizarCantidad,
      limpiarCarrito
    }}>
      {children}
    </CarritoContext.Provider>
  );
};