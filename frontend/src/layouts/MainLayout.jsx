import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container-fluid px-4 mt-4">
        {children}
      </main>
      <Footer />
    </>
  );
}