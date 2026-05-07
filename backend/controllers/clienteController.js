import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const crearCliente = async (req, res) => {
  const { nombres, telefono } = req.body;

  try {
    const { data, error } = await supabase
      .from("clientes")
      .insert([
        {
          nombres,
          telefono,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json(error);
    }

    res.json({ id_cliente: data.id_cliente });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};