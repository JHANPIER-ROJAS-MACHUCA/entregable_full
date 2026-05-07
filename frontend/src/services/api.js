import axios from "axios";

export const api = axios.create({
  baseURL: "https://entregable-full.onrender.com",
});