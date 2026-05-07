export default function SearchBar({ setBusqueda }) {
  return (
    <input
      type="text"
      className="form-control mb-3"
      placeholder="🔍 Buscar producto..."
      onChange={(e) => setBusqueda(e.target.value)}
    />
  );
}