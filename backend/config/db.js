import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mybd"
});

db.connect(err => {
  if (err) {
    console.log("❌ Error DB:", err);
  } else {
    console.log("✅ MySQL conectado");
  }
});