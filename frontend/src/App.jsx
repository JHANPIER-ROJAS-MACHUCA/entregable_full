import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CarritoPage from "./pages/CarritoPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductoDetalle from "./pages/ProductoDetalle";

function App() {
  return (
    <BrowserRouter>

      {/* 🔥 NAVBAR SIEMPRE VISIBLE */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;