import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET TODOS LOS PRODUCTOS
export const getProductos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("producto")
      .select("*")
      .order("id_producto", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// GET POR ID
export const getProductoById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("producto")
      .select("*")
      .eq("id_producto", req.params.id)
      .single();

    if (error) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json(data);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};