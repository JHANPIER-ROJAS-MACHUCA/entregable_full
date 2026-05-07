import { useEffect, useState, useContext } from "react";
import { api } from "../services/api";
import ProductoCard from "../components/ProductoCard";
import { CarritoContext } from "../context/CarritoContext";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const { agregarProducto } = useContext(CarritoContext);

  useEffect(() => {
    api.get("/productos").then(res => setProductos(res.data));
  }, []);

  const filtrados = productos.filter(p =>
    p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <SearchBar setBusqueda={setBusqueda} />

      <div className="row g-4">
        {filtrados.map(p => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id_producto}>
            <ProductoCard producto={p} addToCart={agregarProducto} />
          </div>
        ))}
      </div>
    </div>
  );
}