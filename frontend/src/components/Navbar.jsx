import { Link } from "react-router-dom";
import { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";

export default function Navbar() {

  const { carrito = [] } = useContext(CarritoContext) || {};

  const totalItems = carrito.reduce((a, b) => a + (b.cantidad || 0), 0);

  return (
    <nav className="navbar navbar-dark bg-dark px-3">

      <Link to="/" className="navbar-brand">
        🛒 ShopPro
      </Link>

      <Link to="/checkout" className="btn btn-warning">
        Carrito ({totalItems})
      </Link>

    </nav>
  );
}